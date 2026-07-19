import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiClient } from '@/shared/lib/api-client/ApiClient'
import { useAuthStore } from '@/entities/session/model/store'

describe('ApiClient', () => {
  let client: ApiClient

  beforeEach(() => {
    client = new ApiClient({ baseUrl: 'http://test-api' })
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    vi.restoreAllMocks()
  })

  describe('interceptor pipeline', () => {
    it('runs request interceptors in order', async () => {
      const order: number[] = []
      client.addRequestInterceptor((url, init) => {
        order.push(1)
        return { url, init }
      })
      client.addRequestInterceptor((url, init) => {
        order.push(2)
        return { url, init }
      })

      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      await client.get('/test')

      expect(order).toEqual([1, 2])
    })

    it('passes modified request between interceptors', async () => {
      client.addRequestInterceptor((url, init) => {
        const headers = new Headers(init.headers)
        headers.set('X-First', 'first')
        return { url, init: { ...init, headers } }
      })
      client.addRequestInterceptor((url, init) => {
        const headers = new Headers(init.headers)
        headers.set('X-Second', 'second')
        return { url, init: { ...init, headers } }
      })

      let capturedHeaders: Headers | null = null
      vi.spyOn(globalThis, 'fetch').mockImplementation(
        async (_url, init) => {
          capturedHeaders = new Headers(init?.headers as Record<string, string>)
          return new Response(JSON.stringify({ data: 'ok' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        },
      )

      await client.get('/test')

      expect(capturedHeaders?.get('X-First')).toBe('first')
      expect(capturedHeaders?.get('X-Second')).toBe('second')
    })

    it('runs response interceptors in order', async () => {
      const order: number[] = []

      client.addResponseInterceptor(async (response) => {
        order.push(1)
        return response
      })
      client.addResponseInterceptor(async (response) => {
        order.push(2)
        return response
      })

      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      await client.get('/test')

      expect(order).toEqual([1, 2])
    })
  })

  describe('auth token injection', () => {
    it('injects token via auth interceptor', async () => {
      useAuthStore.setState({ accessToken: 'test-token', isAuthenticated: true })
      client.addRequestInterceptor((url, init) => {
        const { accessToken } = useAuthStore.getState()
        if (accessToken) {
          const headers = new Headers(init.headers)
          headers.set('Authorization', `Bearer ${accessToken}`)
          return { url, init: { ...init, headers } }
        }
        return { url, init }
      })

      let capturedHeaders: Headers | null = null
      vi.spyOn(globalThis, 'fetch').mockImplementation(
        async (_url, init) => {
          capturedHeaders = new Headers(init?.headers as Record<string, string>)
          return new Response(JSON.stringify({ data: 'ok' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        },
      )

      await client.get('/test')

      expect(capturedHeaders?.get('Authorization')).toBe('Bearer test-token')
    })
  })

  describe('request methods', () => {
    it('get sends GET request', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      await client.get('/test')

      expect(fetchSpy).toHaveBeenCalled()
      const args = fetchSpy.mock.calls[0]
      expect(args?.[0]).toBe('http://test-api/test')
      const init = args?.[1] as RequestInit
      expect(init.method).toBe('GET')
    })

    it('post sends POST request with JSON body', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: 'created' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      await client.post('/test', { body: { name: 'test' } })

      const args = fetchSpy.mock.calls[0]
      const init = args?.[1] as RequestInit
      expect(init.method).toBe('POST')
      expect(init.body).toBe(JSON.stringify({ name: 'test' }))
    })

    it('patch sends PATCH request', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: 'updated' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      await client.patch('/test/1', { body: { name: 'updated' } })

      const args = fetchSpy.mock.calls[0]
      const init = args?.[1] as RequestInit
      expect(init.method).toBe('PATCH')
    })

    it('delete sends DELETE request', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(null, { status: 204 }),
      )

      await client.delete('/test/1')

      const args = fetchSpy.mock.calls[0]
      const init = args?.[1] as RequestInit
      expect(init.method).toBe('DELETE')
    })

    it('adds query params', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      await client.get('/test', { params: { filter: 'active', page: '1' } })

      const url = fetchSpy.mock.calls[0]?.[0] as string
      expect(url).toContain('filter=active')
      expect(url).toContain('page=1')
    })
  })

  describe('response parsing', () => {
    it('returns parsed JSON for successful responses', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: { id: 1, name: 'test' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const result = await client.get<{ data: { id: number; name: string } }>('/test')

      expect(result.data).toEqual({ id: 1, name: 'test' })
    })

    it('returns undefined for 204 responses', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(null, { status: 204 }),
      )

      const result = await client.delete('/test/1')

      expect(result).toBeUndefined()
    })
  })

  describe('token refresh', () => {
    it('attempts token refresh on 401 and retries', async () => {
      const refreshSpy = vi.fn().mockResolvedValue('new-token')
      useAuthStore.setState({
        accessToken: 'expired-token',
        isAuthenticated: true,
        refreshAccessToken: refreshSpy,
      } as any)

      let callCount = 0
      vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
        callCount++
        if (callCount === 1) {
          return new Response(
            JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'Token expired' } }),
            { status: 401, headers: { 'Content-Type': 'application/json' } },
          )
        }
        return new Response(JSON.stringify({ data: 'retried' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      })

      // Add auth interceptor for token injection
      client.addRequestInterceptor((url, init) => {
        const { accessToken } = useAuthStore.getState()
        if (accessToken) {
          const headers = new Headers(init.headers)
          headers.set('Authorization', `Bearer ${accessToken}`)
          return { url, init: { ...init, headers } }
        }
        return { url, init }
      })

      const result = await client.get<{ data: string }>('/test')

      // Should have called refresh
      expect(refreshSpy).toHaveBeenCalled()
      // Should have retried with new token
      expect(result.data).toBe('retried')
      // Should have made 2 requests (original + retry)
      expect(callCount).toBe(2)
    })
  })
})
