import { useRateLimitStore } from '@/shared/stores/rate-limit'
import type { ResponseInterceptor } from '../ApiClient'

export const rateLimitInterceptor: ResponseInterceptor = async (response, url) => {
  const limitHeader = response.headers.get('X-RateLimit-Limit')
  const remainingHeader = response.headers.get('X-RateLimit-Remaining')
  const resetHeader = response.headers.get('X-RateLimit-Reset')

  if (limitHeader && remainingHeader && resetHeader) {
    const endpoint = extractEndpoint(url)
    const resetAt = Number(resetHeader) * 1000 // Convert Unix seconds to ms

    useRateLimitStore.getState().updateEndpoint(endpoint, {
      limit: Number(limitHeader),
      remaining: Number(remainingHeader),
      resetAt,
      retryAfter: response.status === 429 ? parseRetryAfter(response) : undefined,
    })
  }

  return response
}

function extractEndpoint(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.pathname
  } catch {
    // If URL is relative, use it as-is
    return url
  }
}

function parseRetryAfter(response: Response): number | undefined {
  const header = response.headers.get('Retry-After')
  if (!header) return undefined
  const seconds = Number(header)
  return Number.isFinite(seconds) ? seconds : undefined
}
