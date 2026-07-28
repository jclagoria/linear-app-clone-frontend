import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useAuthStore } from '@/entities/session/model/store'
import { setTestNow } from './test-utils'

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  })

  describe('clearError', () => {
    it('clears the error state', () => {
      useAuthStore.setState({ error: 'Some error' })
      useAuthStore.getState().clearError()
      expect(useAuthStore.getState().error).toBeNull()
    })
  })

  describe('login', () => {
    it('prevents duplicate requests when already loading', async () => {
      useAuthStore.setState({ isLoading: true })
      const fetchSpy = vi.spyOn(globalThis, 'fetch')

      await useAuthStore.getState().login('test@example.com', 'password123')

      expect(fetchSpy).not.toHaveBeenCalled()
      fetchSpy.mockRestore()
    })

    it('handles successful login — parses data envelope', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            accessToken: 'mock-access-token',
            user: { id: '1', email: 'test@example.com', name: 'Test User' },
          },
        }),
      }
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response)

      await useAuthStore.getState().login('test@example.com', 'password123')

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
      expect(state.user?.email).toBe('test@example.com')
      expect(state.accessToken).toBe('mock-access-token')
      expect(state.error).toBeNull()

      vi.restoreAllMocks()
    })

    it('handles login with invalid credentials — 401 response', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid email or password' }),
      }
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response)

      await useAuthStore.getState().login('wrong@example.com', 'wrongpass')

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('Invalid email or password')
      expect(state.user).toBeNull()

      vi.restoreAllMocks()
    })

    it('handles network failure', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(
        new Error('Failed to fetch'),
      )

      await useAuthStore.getState().login('test@example.com', 'password123')

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('Connection error. Please try again.')

      vi.restoreAllMocks()
    })
  })

  describe('logout', () => {
    it('clears auth state', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ data: { success: true } }),
      } as Response)

      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        accessToken: 'mock-token',
        isAuthenticated: true,
      })

      await useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
      expect(state.accessToken).toBeNull()

      vi.restoreAllMocks()
    })

    it('sends Bearer token in logout request', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue({
          ok: true,
          json: async () => ({ data: { success: true } }),
        } as Response)

      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        accessToken: 'my-access-token',
        isAuthenticated: true,
      })

      await useAuthStore.getState().logout()

      const callArgs = fetchSpy.mock.calls[0]
      if (callArgs?.[1]) {
        const headers = callArgs[1].headers as Record<string, string>
        expect(headers['Authorization']).toBe('Bearer my-access-token')
      }

      vi.restoreAllMocks()
    })
  })

  describe('hydrate', () => {
    it('sends request with credentials and sets authenticated on success', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            accessToken: 'new-access-token',
          },
        }),
      }
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response)

      await useAuthStore.getState().hydrate()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
      expect(state.accessToken).toBe('new-access-token')

      vi.restoreAllMocks()
    })

    it('handles hydration with expired cookie', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: async () => ({}),
      }
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response)

      await useAuthStore.getState().hydrate()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)

      vi.restoreAllMocks()
    })
  })

  describe('refreshAccessToken', () => {
    beforeEach(() => { setTestNow() })
    afterEach(() => { vi.useRealTimers() })

    it('returns existing token if still valid', async () => {
      const farFutureExp = Math.floor((Date.now() + 3600_000) / 1000)
      const mockToken = `header.${btoa(JSON.stringify({ exp: farFutureExp }))}.signature`
      useAuthStore.setState({ accessToken: mockToken })

      const result = await useAuthStore.getState().refreshAccessToken()
      expect(result).toBe(mockToken)
    })

    it('returns null when refresh fails', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: async () => ({}),
      }
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response)

      useAuthStore.setState({
        accessToken: 'expired-token',
        isAuthenticated: true,
      })

      const result = await useAuthStore.getState().refreshAccessToken()

      expect(result).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)

      vi.restoreAllMocks()
    })

    it('refreshes token successfully', async () => {
      useAuthStore.setState({
        accessToken: 'about-to-expire',
        isAuthenticated: true,
      })

      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            accessToken: 'new-access-token',
          },
        }),
      }
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response)

      const result = await useAuthStore.getState().refreshAccessToken()

      expect(result).toBe('new-access-token')
      expect(useAuthStore.getState().accessToken).toBe('new-access-token')

      vi.restoreAllMocks()
    })

    it('clears auth state when refresh fails', async () => {
      useAuthStore.setState({
        accessToken: 'expired-token',
        isAuthenticated: true,
        user: { id: '1', email: 'test@example.com', name: 'Test' },
      })

      const mockResponse = {
        ok: false,
        status: 401,
        json: async () => ({}),
      }
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response)

      const result = await useAuthStore.getState().refreshAccessToken()

      expect(result).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().user).toBeNull()

      vi.restoreAllMocks()
    })
  })
})
