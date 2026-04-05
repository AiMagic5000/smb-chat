import { getOpenAI } from './openai'
import { EMBEDDING_MODEL } from '@/lib/constants'

export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAI()
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.replace(/\n/g, ' ').trim(),
  })
  return response.data[0].embedding
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const openai = getOpenAI()
  const cleaned = texts.map(t => t.replace(/\n/g, ' ').trim())

  const batches: string[][] = []
  for (let i = 0; i < cleaned.length; i += 100) {
    batches.push(cleaned.slice(i, i + 100))
  }

  const results: number[][] = []
  for (const batch of batches) {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    })
    results.push(...response.data.map(d => d.embedding))
  }

  return results
}
