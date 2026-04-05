const store = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { allowed: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  store.set(key, { ...record, count: record.count + 1 })
  return { allowed: true, remaining: limit - record.count - 1 }
}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of store) {
    if (now > record.resetAt) store.delete(key)
  }
}, 5 * 60 * 1000)
