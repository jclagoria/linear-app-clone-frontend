export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
}

export interface LoginResponse {
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

export interface RefreshResponse {
  data: {
    accessToken: string
    refreshToken: string
  }
}

export interface LogoutResponse {
  data: {
    success: boolean
  }
}

export interface AuthError {
  message: string
  code?: string
}

export interface ValidationErrors {
  email?: string
  password?: string
}

export interface LoginFormData {
  email: string
  password: string
}
