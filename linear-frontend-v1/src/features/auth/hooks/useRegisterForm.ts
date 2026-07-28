import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/entities/session/model/store'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Passwords do not match'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type RegisterFormData = z.infer<typeof registerSchema>

export function useRegisterForm() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, fieldErrors, clearError } = useAuthStore()

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (fieldErrors) {
      for (const [field, message] of Object.entries(fieldErrors)) {
        if (field in registerSchema.shape) {
          setError(field as keyof RegisterFormData, { message })
        }
      }
    }
  }, [fieldErrors, setError])

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      if (isLoading) return

      clearError()
      await registerUser({ email: data.email, name: data.name, password: data.password })

      if (useAuthStore.getState().isAuthenticated) {
        navigate('/', { replace: true })
      }
    },
    [registerUser, isLoading, navigate, clearError],
  )

  return {
    register,
    handleSubmit: rhfHandleSubmit(onSubmit),
    errors,
    isLoading,
    error,
  }
}
