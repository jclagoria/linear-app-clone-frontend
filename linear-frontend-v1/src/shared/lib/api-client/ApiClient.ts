import { useAuthStore } from '@/entities/session/model/store'
import { UnauthorizedError } from './errors'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

export interface RequestInterceptor {
  (url: string, init: RequestInit): { url: string; init: RequestInit }
}

export interface ResponseInterceptor {
  (response: Response, url: string): Promise<Response>
}

export interface ApiClientConfig {
  baseUrl?: string
  requestInterceptors?: RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor[]
}

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  body?: unknown
  params?: Record<string, string>
}

export class ApiClient {
  private baseUrl: string
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private refreshPromise: Promise<string | null> | null = null

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? API_BASE
    this.requestInterceptors = config.requestInterceptors ?? []
    this.responseInterceptors = config.responseInterceptors ?? []
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor)
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('GET', endpoint, options)
  }

  async post<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('POST', endpoint, options)
  }

  async patch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('PATCH', endpoint, options)
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, options)
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint}`

    if (!params) return url

    const parsed = new URL(url)
    for (const [key, value] of Object.entries(params)) {
      parsed.searchParams.set(key, value)
    }
    return parsed.toString()
  }

  private buildInit(method: RequestMethod, options: RequestOptions): RequestInit {
    // Build headers, preserving any caller-provided headers
    const headers = new Headers()
    if (options.headers) {
      const raw = options.headers as Record<string, string>
      for (const [k, v] of Object.entries(raw)) {
        headers.set(k, v)
      }
    }

    // Default Content-Type for requests with body
    if (options.body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    return {
      method,
      headers,
      ...(options.body !== undefined
        ? { body: JSON.stringify(options.body) }
        : {}),
      signal: options.signal,
      credentials: options.credentials,
      cache: options.cache,
    }
  }

  async request<T>(
    method: RequestMethod,
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    let url = this.buildUrl(endpoint, options.params)
    let init = this.buildInit(method, options)

    // 1. Run request interceptors (e.g., auth token injection)
    for (const interceptor of this.requestInterceptors) {
      const result = interceptor(url, init)
      url = result.url
      init = result.init
    }

    // 2. Initial fetch
    let response = await fetch(url, init)

    // 3. Handle 401 with single-flight token refresh
    if (response.status === 401) {
      const newToken = await this.refreshTokenSingleFlight()

      if (newToken) {
        // Rebuild headers with new token
        const retryInit: RequestInit = { ...init }
        const retryHeaders = new Headers(init.headers)
        retryHeaders.set('Authorization', `Bearer ${newToken}`)
        retryInit.headers = retryHeaders

        // Retry with fresh token
        response = await fetch(url, retryInit)
      } else {
        throw new UnauthorizedError('Session expired. Please log in again.')
      }
    }

    // 4. Run response interceptors (error mapping, rate limit tracking)
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response, url)
    }

    // 5. Parse successful response
    if (response.ok) {
      return this.parseResponse<T>(response)
    }

    // 6. If response interceptors didn't throw (no error interceptor registered), throw generic
    throw new UnauthorizedError(`Request failed with status ${response.status}`)
  }

  private async refreshTokenSingleFlight(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = useAuthStore.getState().refreshAccessToken()

    try {
      return await this.refreshPromise
    } finally {
      this.refreshPromise = null
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return undefined as T
    }

    const text = await response.text()
    if (!text) return undefined as T

    return JSON.parse(text) as T
  }
}

// Singleton instance for app-wide use
export const apiClient = new ApiClient()
