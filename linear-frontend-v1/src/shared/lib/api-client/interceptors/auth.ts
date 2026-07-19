import { useAuthStore } from '@/entities/session/model/store'
import type { RequestInterceptor } from '../ApiClient'

export const authInterceptor: RequestInterceptor = (url, init) => {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    const headers = new Headers(init.headers)
    headers.set('Authorization', `Bearer ${accessToken}`)
    return { url, init: { ...init, headers } }
  }

  return { url, init }
}
