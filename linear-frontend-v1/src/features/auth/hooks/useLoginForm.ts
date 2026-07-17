import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from './useAuth'
import { useAuthStore } from '@/entities/session/model/store'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter a valid email address')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export function useLoginForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, isLoading, error, clearError } = useAuth()

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      if (isLoading) return

      clearError()
      await login(data.email, data.password)

      if (useAuthStore.getState().isAuthenticated) {
        const redirectTo = searchParams.get('redirect') || '/'
        navigate(redirectTo, { replace: true })
      }
    },
    [login, isLoading, navigate, clearError, searchParams],
  )

  return {
    register,
    handleSubmit: rhfHandleSubmit(onSubmit),
    errors,
    isLoading,
    error,
  }
}
