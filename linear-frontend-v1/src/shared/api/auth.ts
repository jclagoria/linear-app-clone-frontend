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

export class RegisterError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors?: Record<string, string>,
  ) {
    super(message)
    this.name = 'RegisterError'
  }
}

export async function registerUser(data: RegisterPayload): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 409) {
      throw new RegisterError('An account with this email already exists', 409)
    }
    if (response.status === 400) {
      const errors = (body as { errors?: Record<string, string> }).errors
      if (errors) {
        const firstError = Object.values(errors)[0]
        throw new RegisterError(firstError || 'Validation failed', 400, errors)
      }
    }
    throw new RegisterError(
      (body as { message?: string }).message ?? 'Registration failed',
      response.status,
    )
  }

  return (body as { data: RegisterResponse }).data
}
