import { apiClient } from '@/shared/lib/api-client'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

export interface RegisterPayload {
  email: string
  name: string
  password: string
}

export interface RegisterResponse {
  user: {
    id: string
    email: string
    name: string
  }
  accessToken: string
}

export async function registerUser(data: RegisterPayload): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>(`${API_BASE}/auth/register`, {
    body: data,
    credentials: 'include',
  })

  return response
}
