import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { chunkText } from '@/lib/ai/chunker'
import { generateEmbeddings } from '@/lib/ai/embeddings'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })

    const allowedTypes = ['text/plain', 'text/markdown', 'text/csv', 'application/pdf']
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      return NextResponse.json({ success: false, error: 'Unsupported file type. Use TXT, MD, CSV, or PDF.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Upload file to Supabase Storage
    const storagePath = `knowledge/${id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('knowledge-files')
      .upload(storagePath, file)

    if (uploadError) throw uploadError

    const { data: source, error } = await supabase
      .from('knowledge_sources')
      .insert({
        chatbot_id: id,
        type: 'file',
        name: file.name,
        storage_path: storagePath,
        file_size_bytes: file.size,
        mime_type: file.type,
        status: 'processing',
      })
      .select()
      .single()

    if (error) throw error

    // Process file text
    const text = await file.text()
    const chunks = chunkText(text)
    const embeddings = await generateEmbeddings(chunks.map((c) => c.content))

    const rows = chunks.map((chunk, i) => ({
      source_id: source.id,
      chatbot_id: id,
      content: chunk.content,
      token_count: chunk.token_count,
      embedding: JSON.stringify(embeddings[i]),
      metadata: { file_name: file.name, chunk_index: chunk.index },
    }))

    for (let i = 0; i < rows.length; i += 50) {
      await supabase.from('knowledge_chunks').insert(rows.slice(i, i + 50))
    }

    await supabase.from('knowledge_sources').update({
      status: 'ready',
      chunk_count: chunks.length,
      last_crawled_at: new Date().toISOString(),
    }).eq('id', source.id)

    return NextResponse.json({ success: true, data: source }, { status: 201 })
  } catch (error) {
    console.error('Upload file error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
