import { CHUNK_SIZE, CHUNK_OVERLAP } from '@/lib/constants'

interface Chunk {
  content: string
  index: number
  token_count: number
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function chunkText(
  text: string,
  chunkSize = CHUNK_SIZE,
  overlap = CHUNK_OVERLAP
): Chunk[] {
  const paragraphs = text.split(/\n\n+/)
  const chunks: Chunk[] = []
  let current = ''
  let index = 0

  for (const para of paragraphs) {
    const combined = current ? `${current}\n\n${para}` : para

    if (estimateTokens(combined) > chunkSize && current) {
      chunks.push({
        content: current.trim(),
        index,
        token_count: estimateTokens(current.trim()),
      })
      index++

      const words = current.split(/\s+/)
      const overlapWords = words.slice(-Math.floor(overlap / 1.5))
      current = `${overlapWords.join(' ')}\n\n${para}`
    } else {
      current = combined
    }
  }

  if (current.trim()) {
    chunks.push({
      content: current.trim(),
      index,
      token_count: estimateTokens(current.trim()),
    })
  }

  return chunks
}
