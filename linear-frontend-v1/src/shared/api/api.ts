/**
 * @deprecated Use `apiClient` from `@/shared/lib/api-client` instead.
 * This module provides backward compatibility for existing callers.
 */
import { apiClient } from '@/shared/lib/api-client'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

export { API_BASE }

/**
 * @deprecated Use `apiClient.get()` / `apiClient.post()` etc. instead.
 */
export async function authFetch(
  endpoint: string,
  init?: RequestInit,
): Promise<Response> {
  const method = (init?.method?.toUpperCase() ?? 'GET') as 'GET' | 'POST' | 'PATCH' | 'DELETE'

  let body: unknown = undefined
  if (init?.body) {
    try {
      body = JSON.parse(init.body as string)
    } catch {
      body = init.body
    }
  }

  const headers = init?.headers as Record<string, string> | undefined

  try {
    const data = await apiClient.request(method, endpoint, {
      body,
      headers,
      signal: init?.signal,
      credentials: init?.credentials,
      cache: init?.cache,
    })

    // Wrap the data in a Response-like object for backward compatibility
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    // Convert typed errors back to Response for backward compat
    if (err instanceof Error && 'status' in err && typeof (err as Record<string, unknown>).status === 'number') {
      const apiErr = err as { message: string; code: string; status: number }
      return new Response(
        JSON.stringify({
          error: { message: apiErr.message, code: apiErr.code },
        }),
        {
          status: apiErr.status,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    throw err
  }
}
