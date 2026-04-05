import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { chunkText } from '@/lib/ai/chunker'
import { generateEmbeddings } from '@/lib/ai/embeddings'
import { z } from 'zod'

const FIRECRAWL_API_KEY = 'fc-12871c0a5bbd4374ad35731d85b58652'
const FIRECRAWL_BASE_URL = 'https://api.firecrawl.dev/v1'
const POLL_INTERVAL_MS = 5000
const MAX_POLL_MS = 5 * 60 * 1000

const schema = z.object({
  url: z.string().url(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid URL' }, { status: 400 })

    const supabase = createAdminClient()

    // Start the Firecrawl crawl job
    const crawlRes = await fetch(`${FIRECRAWL_BASE_URL}/crawl`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: parsed.data.url,
        limit: 50,
        scrapeOptions: { formats: ['markdown'] },
      }),
    })

    if (!crawlRes.ok) {
      const errText = await crawlRes.text()
      throw new Error(`Firecrawl crawl start failed: ${crawlRes.status} ${errText}`)
    }

    const crawlData = await crawlRes.json()
    const crawlJobId: string = crawlData.id

    if (!crawlJobId) throw new Error('Firecrawl did not return a job id')

    const hostname = new URL(parsed.data.url).hostname

    const { data: source, error } = await supabase
      .from('knowledge_sources')
      .insert({
        chatbot_id: id,
        type: 'website',
        name: hostname,
        source_url: parsed.data.url,
        status: 'processing',
      })
      .select()
      .single()

    if (error) throw error

    // Fire-and-forget background processing
    processCrawl(supabase, source.id, id, crawlJobId, parsed.data.url).catch((err) => {
      console.error('Crawl processing failed:', err)
      supabase.from('knowledge_sources').update({
        status: 'failed',
        error_message: err instanceof Error ? err.message : String(err),
      }).eq('id', source.id)
    })

    return NextResponse.json({ success: true, data: source }, { status: 201 })
  } catch (error) {
    console.error('Add crawl source error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

async function processCrawl(
  supabase: ReturnType<typeof createAdminClient>,
  sourceId: string,
  chatbotId: string,
  crawlJobId: string,
  siteUrl: string
) {
  const deadline = Date.now() + MAX_POLL_MS

  // Poll until complete or timed out
  let pages: Array<{ markdown?: string; metadata?: { sourceURL?: string } }> = []

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))

    const statusRes = await fetch(`${FIRECRAWL_BASE_URL}/crawl/${crawlJobId}`, {
      headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}` },
    })

    if (!statusRes.ok) {
      throw new Error(`Firecrawl status check failed: ${statusRes.status}`)
    }

    const statusData = await statusRes.json()

    if (statusData.status === 'failed') {
      throw new Error(`Firecrawl job failed: ${statusData.error ?? 'unknown error'}`)
    }

    if (statusData.status === 'completed') {
      pages = statusData.data ?? []
      break
    }

    // Still scraping — keep polling
  }

  if (pages.length === 0) {
    throw new Error('Crawl timed out or returned no pages')
  }

  // Build rows from all pages
  const rows: Array<{
    source_id: string
    chatbot_id: string
    content: string
    token_count: number
    embedding: string
    metadata: Record<string, unknown>
  }> = []

  for (const page of pages) {
    const markdown = page.markdown?.trim()
    if (!markdown || markdown.length < 50) continue

    const pageUrl = page.metadata?.sourceURL ?? siteUrl
    const chunks = chunkText(markdown)
    const embeddings = await generateEmbeddings(chunks.map((c) => c.content))

    for (let i = 0; i < chunks.length; i++) {
      rows.push({
        source_id: sourceId,
        chatbot_id: chatbotId,
        content: chunks[i].content,
        token_count: chunks[i].token_count,
        embedding: JSON.stringify(embeddings[i]),
        metadata: { page_url: pageUrl, chunk_index: chunks[i].index },
      })
    }
  }

  if (rows.length === 0) {
    throw new Error('No usable content extracted from crawled pages')
  }

  // Insert in batches of 50
  for (let i = 0; i < rows.length; i += 50) {
    await supabase.from('knowledge_chunks').insert(rows.slice(i, i + 50))
  }

  await supabase.from('knowledge_sources').update({
    status: 'ready',
    chunk_count: rows.length,
    last_crawled_at: new Date().toISOString(),
  }).eq('id', sourceId)
}
