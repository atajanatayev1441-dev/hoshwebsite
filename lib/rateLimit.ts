import Redis from 'ioredis'

let client: Redis | null = null

function getClient(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!client) {
    client = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1 })
    client.on('error', (err) => console.error('[redis]', err.message))
  }
  return client
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
}

// Fixed-window limiter: `limit` requests per `windowSeconds`, keyed by caller.
// Fails open (allows the request) if Redis is unreachable or unconfigured —
// a rate limiter going down should never be able to take the whole site down.
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const redis = getClient()
  if (!redis) return { allowed: true, remaining: limit }

  try {
    const fullKey = `ratelimit:${key}`
    const count = await redis.incr(fullKey)
    if (count === 1) {
      await redis.expire(fullKey, windowSeconds)
    }
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) }
  } catch (err) {
    console.error('[rateLimit] error:', (err as Error).message)
    return { allowed: true, remaining: limit }
  }
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return headers.get('x-real-ip') ?? 'unknown'
}
