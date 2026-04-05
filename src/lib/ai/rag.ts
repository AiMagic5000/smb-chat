import { createAdminClient } from '@/lib/supabase/admin'
import { getOpenAI } from './openai'
import { generateEmbedding } from './embeddings'
import { RAG_TOP_K, MAX_CONTEXT_MESSAGES } from '@/lib/constants'

interface RagContext {
  chunks: Array<{ content: string; metadata: Record<string, unknown>; score: number }>
  history: Array<{ role: string; content: string }>
}

export async function retrieveContext(
  chatbotId: string,
  conversationId: string,
  query: string
): Promise<RagContext> {
  const supabase = createAdminClient()

  const [embedding, historyResult] = await Promise.all([
    generateEmbedding(query),
    supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(MAX_CONTEXT_MESSAGES),
  ])

  const { data: chunks } = await supabase.rpc('match_knowledge_chunks', {
    query_embedding: embedding,
    match_chatbot_id: chatbotId,
    match_count: RAG_TOP_K,
    match_threshold: 0.7,
  })

  return {
    chunks: (chunks ?? []).map((c: { content: string; metadata: Record<string, unknown>; similarity: number }) => ({
      content: c.content,
      metadata: c.metadata,
      score: c.similarity,
    })),
    history: (historyResult.data ?? []).reverse(),
  }
}

export async function generateResponse(
  chatbotConfig: {
    model: string
    system_prompt: string
    temperature: number
    max_tokens: number
  },
  context: RagContext,
  userMessage: string
): Promise<{ reply: string; sources: Array<{ title: string; url: string; score: number }> }> {
  const openai = getOpenAI()

  const ragContext = context.chunks.length > 0
    ? `\n\nUse the following context to answer the user's question. If the context doesn't contain relevant information, say so honestly.\n\n---\n${context.chunks.map(c => c.content).join('\n\n---\n')}\n---`
    : ''

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: chatbotConfig.system_prompt + ragContext },
    ...context.history.map(h => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    })),
    { role: 'user', content: userMessage },
  ]

  const completion = await openai.chat.completions.create({
    model: chatbotConfig.model,
    messages,
    temperature: chatbotConfig.temperature,
    max_tokens: chatbotConfig.max_tokens,
  })

  const reply = completion.choices[0]?.message?.content ?? 'I apologize, I was unable to generate a response.'

  const sources = context.chunks.map(c => ({
    title: (c.metadata?.heading as string) ?? (c.metadata?.page_url as string) ?? 'Source',
    url: (c.metadata?.page_url as string) ?? '',
    score: c.score,
  }))

  return { reply, sources }
}
