import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerSupabase } from '@/lib/supabase/server'
import { chunkText } from '@/lib/ai/chunker'
import { generateEmbeddings } from '@/lib/ai/embeddings'
import { z } from 'zod'

const schema = z.object({
  url: z.string().url(),
  name: z.string().optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authSupabase = await createServerSupabase()
    const { data: { user } } = await authSupabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid URL' }, { status: 400 })

    const supabase = createAdminClient()

    const { data: source, error } = await supabase
      .from('knowledge_sources')
      .insert({
        chatbot_id: id,
        type: 'url',
        name: parsed.data.name ?? new URL(parsed.data.url).hostname,
        source_url: parsed.data.url,
        status: 'processing',
      })
      .select()
      .single()

    if (error) throw error

    // Fetch and process the URL in the background
    processUrl(supabase, source.id, id, parsed.data.url).catch((err) => {
      console.error('URL processing failed:', err)
      supabase.from('knowledge_sources').update({
        status: 'failed',
        error_message: err.message,
      }).eq('id', source.id)
    })

    return NextResponse.json({ success: true, data: source }, { status: 201 })
  } catch (error) {
    console.error('Add URL source error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

async function processUrl(
  supabase: ReturnType<typeof createAdminClient>,
  sourceId: string,
  chatbotId: string,
  url: string
) {
  // Fetch the page content
  const response = await fetch(url, {
    headers: { 'User-Agent': 'SMBChat/1.0 (Knowledge Crawler)' },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`)
  }

  const html = await response.text()

  // Strip HTML tags, scripts, styles
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!text || text.length < 50) {
    throw new Error('Page content too short or empty')
  }

  // Chunk the text
  const chunks = chunkText(text)

  // Generate embeddings
  const embeddings = await generateEmbeddings(chunks.map((c) => c.content))

  // Insert chunks with embeddings
  const rows = chunks.map((chunk, i) => ({
    source_id: sourceId,
    chatbot_id: chatbotId,
    content: chunk.content,
    token_count: chunk.token_count,
    embedding: JSON.stringify(embeddings[i]),
    metadata: { page_url: url, chunk_index: chunk.index },
  }))

  // Insert in batches of 50
  for (let i = 0; i < rows.length; i += 50) {
    await supabase.from('knowledge_chunks').insert(rows.slice(i, i + 50))
  }

  // Update source status
  await supabase.from('knowledge_sources').update({
    status: 'ready',
    chunk_count: chunks.length,
    last_crawled_at: new Date().toISOString(),
  }).eq('id', sourceId)
}
