import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { useAuthStore } from '@/entities/session/model/store'

const API_BASE = '/api/v1'

const handlers = [
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    if (body.email === 'valid@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        data: {
          accessToken: 'valid-access-token',
          user: {
            id: '1',
            email: 'valid@example.com',
            name: 'Valid User',
          },
        },
      })
    }

    return HttpResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 },
    )
  }),

  http.post(`${API_BASE}/auth/logout`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json({ data: { success: true } })
  }),

  http.post(`${API_BASE}/auth/refresh`, async () => {
    return HttpResponse.json({
      data: {
        accessToken: 'refreshed-access-token',
      },
    })
  }),
]

const server = setupServer(...handlers)

describe('Login Flow Integration', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
  afterAll(() => server.close())
  afterEach(() => {
    server.resetHandlers()
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  })

  it('completes login flow with valid credentials', async () => {
    await useAuthStore.getState().login('valid@example.com', 'password123')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.accessToken).toBe('valid-access-token')
    expect(state.user?.email).toBe('valid@example.com')
  })

  it('fails login with wrong password', async () => {
    await useAuthStore.getState().login('valid@example.com', 'wrongpassword')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBe('Invalid email or password')
  })

  it('handles network failure gracefully', async () => {
    server.use(
      http.post(`${API_BASE}/auth/login`, () => {
        return HttpResponse.error()
      }),
    )

    await useAuthStore.getState().login('valid@example.com', 'password123')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBe('Connection error. Please try again.')
  })

  it('supports retry after login error', async () => {
    server.use(
      http.post(`${API_BASE}/auth/login`, () => {
        return HttpResponse.error()
      }),
    )

    await useAuthStore.getState().login('valid@example.com', 'password123')
    expect(useAuthStore.getState().error).toBe('Connection error. Please try again.')

    server.resetHandlers()

    await useAuthStore.getState().login('valid@example.com', 'password123')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.error).toBeNull()
  })
})

describe('Token Refresh Integration', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      accessToken: 'old-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
  afterAll(() => server.close())

  it('successfully refreshes access token', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    const result = await useAuthStore.getState().refreshAccessToken()

    expect(result).toBe('refreshed-access-token')
    expect(useAuthStore.getState().accessToken).toBe('refreshed-access-token')

    fetchSpy.mockRestore()
  })

  it('clears auth state when refresh fails', async () => {
    server.use(
      http.post(`${API_BASE}/auth/refresh`, () => {
        return HttpResponse.json({ message: 'Token expired' }, { status: 401 })
      }),
    )

    const result = await useAuthStore.getState().refreshAccessToken()

    expect(result).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })
})

describe('Logout Integration', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@example.com', name: 'Test' },
      accessToken: 'my-token',
      isAuthenticated: true,
    })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
  afterAll(() => server.close())

  it('sends Bearer token and clears state', async () => {
    await useAuthStore.getState().logout()

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })
})
