import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setTestNow } from '../test-utils'
import { authInterceptor } from '@/shared/lib/api-client/interceptors/auth'
import { errorInterceptor } from '@/shared/lib/api-client/interceptors/error'
import { rateLimitInterceptor } from '@/shared/lib/api-client/interceptors/rate-limit'
import { useAuthStore } from '@/entities/session/model/store'
import { useRateLimitStore } from '@/shared/stores/rate-limit'
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  BusinessRuleError,
  RateLimitError,
  InternalError,
} from '@/shared/lib/api-client/errors'

describe('authInterceptor', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  })

  it('adds Bearer token when authenticated', () => {
    useAuthStore.setState({ accessToken: 'my-token', isAuthenticated: true })

    const result = authInterceptor('/api/test', {
      method: 'GET',
      headers: new Headers(),
    })

    expect(result.init.headers).toBeDefined()
    const headers = new Headers(result.init.headers)
    expect(headers.get('Authorization')).toBe('Bearer my-token')
  })

  it('does not add Authorization header when not authenticated', () => {
    const result = authInterceptor('/api/test', {
      method: 'GET',
      headers: new Headers(),
    })

    const headers = new Headers(result.init.headers)
    expect(headers.has('Authorization')).toBe(false)
  })

  it('preserves existing headers', () => {
    useAuthStore.setState({ accessToken: 'token', isAuthenticated: true })
    const headers = new Headers({ 'X-Custom': 'value' })

    const result = authInterceptor('/api/test', { method: 'GET', headers })

    const resultHeaders = new Headers(result.init.headers)
    expect(resultHeaders.get('X-Custom')).toBe('value')
    expect(resultHeaders.get('Authorization')).toBe('Bearer token')
  })
})

describe('errorInterceptor', () => {
  function makeResponse(status: number, body: unknown, headers?: Record<string, string>): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', ...headers },
    })
  }

  it('returns response as-is for 2xx', async () => {
    const response = makeResponse(200, { data: 'ok' })
    const result = await errorInterceptor(response, '/api/test')
    expect(result).toBe(response)
  })

  it('throws ValidationError on 400', async () => {
    const response = makeResponse(400, {
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: [{ field: 'name', message: 'Required' }] },
    })

    await expect(errorInterceptor(response, '/api/test')).rejects.toThrow(ValidationError)
  })

  it('throws UnauthorizedError on 401', async () => {
    const response = makeResponse(401, { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } })
    await expect(errorInterceptor(response, '/api/test')).rejects.toThrow(UnauthorizedError)
  })

  it('throws ForbiddenError on 403', async () => {
    const response = makeResponse(403, { error: { code: 'FORBIDDEN', message: 'Forbidden' } })
    await expect(errorInterceptor(response, '/api/test')).rejects.toThrow(ForbiddenError)
  })

  it('throws NotFoundError on 404', async () => {
    const response = makeResponse(404, { error: { code: 'NOT_FOUND', message: 'Not found' } })
    await expect(errorInterceptor(response, '/api/test')).rejects.toThrow(NotFoundError)
  })

  it('throws ConflictError on 409', async () => {
    const response = makeResponse(409, { error: { code: 'CONFLICT', message: 'Conflict' } })
    await expect(errorInterceptor(response, '/api/test')).rejects.toThrow(ConflictError)
  })

  it('throws BusinessRuleError on 422', async () => {
    const response = makeResponse(422, { error: { code: 'BUSINESS_RULE_ERROR', message: 'Business rule' } })
    await expect(errorInterceptor(response, '/api/test')).rejects.toThrow(BusinessRuleError)
  })

  it('throws RateLimitError on 429 with retryAfter', async () => {
    const response = makeResponse(429, { error: { code: 'RATE_LIMITED', message: 'Rate limit' } }, { 'Retry-After': '30' })

    try {
      await errorInterceptor(response, '/api/test')
      expect.fail('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(RateLimitError)
      if (err instanceof RateLimitError) {
        expect(err.retryAfter).toBe(30)
      }
    }
  })

  it('throws InternalError on 500', async () => {
    const response = makeResponse(500, { error: { code: 'SERVER_ERROR', message: 'Server error' } })
    await expect(errorInterceptor(response, '/api/test')).rejects.toThrow(InternalError)
  })

  it('handles missing body gracefully', async () => {
    const response = new Response(null, { status: 400, headers: { 'Content-Type': 'application/json' } })
    await expect(errorInterceptor(response, '/api/test')).rejects.toThrow(ValidationError)
  })

  it('handles non-JSON body gracefully', async () => {
    const response = new Response('not json', { status: 500, headers: { 'Content-Type': 'text/plain' } })
    await expect(errorInterceptor(response, '/api/test')).rejects.toThrow(InternalError)
  })
})

describe('rateLimitInterceptor', () => {
  beforeEach(() => {
    setTestNow()
    useRateLimitStore.setState({ endpoints: new Map() })
  })
  afterEach(() => { vi.useRealTimers() })

  function makeResponse(status: number, headers?: Record<string, string>): Response {
    return new Response(null, {
      status,
      headers: { 'Content-Type': 'application/json', ...headers },
    })
  }

  it('parses rate limit headers and updates store', async () => {
    const resetTime = Math.floor(Date.now() / 1000) + 60
    const response = makeResponse(200, {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': '85',
      'X-RateLimit-Reset': String(resetTime),
    })

    await rateLimitInterceptor(response, '/api/v1/issues')

    const entry = useRateLimitStore.getState().endpoints.get('/api/v1/issues')
    expect(entry).toBeDefined()
    expect(entry?.limit).toBe(100)
    expect(entry?.remaining).toBe(85)
    expect(entry?.resetAt).toBe(resetTime * 1000)
  })

  it('updates store on 429 with retryAfter', async () => {
    const resetTime = Math.floor(Date.now() / 1000) + 30
    const response = makeResponse(429, {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(resetTime),
      'Retry-After': '30',
    })

    await rateLimitInterceptor(response, '/api/v1/issues')

    const entry = useRateLimitStore.getState().endpoints.get('/api/v1/issues')
    expect(entry?.remaining).toBe(0)
    expect(entry?.retryAfter).toBe(30)
  })

  it('skips update when headers are missing', async () => {
    const response = makeResponse(200)

    await rateLimitInterceptor(response, '/api/test')

    expect(useRateLimitStore.getState().endpoints.size).toBe(0)
  })

  it('extracts endpoint path from full URL', async () => {
    const resetTime = Math.floor(Date.now() / 1000) + 60
    const response = makeResponse(200, {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': '50',
      'X-RateLimit-Reset': String(resetTime),
    })

    await rateLimitInterceptor(response, 'https://api.example.com/api/v1/projects')

    const entry = useRateLimitStore.getState().endpoints.get('/api/v1/projects')
    expect(entry).toBeDefined()
  })
})
