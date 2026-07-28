import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRegisterForm } from '../useRegisterForm'
import { useAuthStore } from '@/entities/session/model/store'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

describe('useRegisterForm', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    vi.restoreAllMocks()
  })

  it('returns form register function and errors', () => {
    const { result } = renderHook(() => useRegisterForm())

    expect(result.current.register).toBeDefined()
    expect(result.current.handleSubmit).toBeDefined()
    expect(result.current.errors).toBeDefined()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('validates required fields', async () => {
    const { result } = renderHook(() => useRegisterForm())

    await act(async () => {
      await result.current.handleSubmit(new Event('submit'))
    })

    expect(result.current.errors.name?.message).toBe('Name is required')
    expect(result.current.errors.email?.message).toBe('Email is required')
    expect(result.current.errors.password?.message).toBe('Password must be at least 8 characters')
    expect(result.current.errors.confirmPassword?.message).toBe('Passwords do not match')
  })

  it('validates password minimum length', async () => {
    const { result } = renderHook(() => useRegisterForm())

    await act(async () => {
      const { onChange } = result.current.register('password')
      await onChange({ target: { value: 'abc' } })
    })

    await act(async () => {
      await result.current.handleSubmit(new Event('submit'))
    })

    expect(result.current.errors.password?.message).toBe('Password must be at least 8 characters')
  })

  it('does not submit when already loading', async () => {
    useAuthStore.setState({ isLoading: true })
    const mockRegister = vi.fn()
    useAuthStore.setState({ register: mockRegister })

    const { result } = renderHook(() => useRegisterForm())

    await act(async () => {
      await result.current.handleSubmit(new Event('submit'))
    })

    expect(mockRegister).not.toHaveBeenCalled()
  })
})
