import { useAuthStore } from '@/entities/session/model/store'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

export async function authFetch(
  endpoint: string,
  init?: RequestInit,
): Promise<Response> {

  const { accessToken } = useAuthStore.getState()

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const headers = new Headers(init?.headers)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response = await fetch(url, {
    ...init,
    headers,
  })

  // If 401, attempt token refresh and retry once
  if (response.status === 401) {
    const newToken = await refreshToken()

    if (newToken) {
      const retryHeaders = new Headers(init?.headers)
      retryHeaders.set('Authorization', `Bearer ${newToken}`)
      if (!retryHeaders.has('Content-Type')) {
        retryHeaders.set('Content-Type', 'application/json')
      }

      response = await fetch(url, {
        ...init,
        headers: retryHeaders,
      })
    }
  }

  return response
}

async function refreshToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = useAuthStore.getState().refreshAccessToken()

  try {
    return await refreshPromise
  } finally {
    isRefreshing = false
    refreshPromise = null
  }
}
