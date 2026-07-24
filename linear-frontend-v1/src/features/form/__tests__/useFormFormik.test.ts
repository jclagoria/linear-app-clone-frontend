import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFormFormik } from '../lib/useFormFormik'
import { z } from 'zod'

const testSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

type TestFormData = z.infer<typeof testSchema>

describe('useFormFormik', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useFormFormik<TestFormData>({
        schema: testSchema,
        defaultValues: { name: '', email: '' },
        onSubmit: vi.fn(),
      }),
    )

    expect(result.current.formState.errors).toEqual({})
    expect(result.current.formState.isSubmitting).toBe(false)
  })

  it('should return control for field registration', () => {
    const { result } = renderHook(() =>
      useFormFormik<TestFormData>({
        schema: testSchema,
        defaultValues: { name: '', email: '' },
        onSubmit: vi.fn(),
      }),
    )

    expect(result.current.control).toBeDefined()
  })

  it('should provide handleSubmit function', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useFormFormik<TestFormData>({
        schema: testSchema,
        defaultValues: { name: '', email: '' },
        onSubmit,
      }),
    )

    expect(typeof result.current.handleSubmit).toBe('function')
  })

  it('should provide reset function', () => {
    const { result } = renderHook(() =>
      useFormFormik<TestFormData>({
        schema: testSchema,
        defaultValues: { name: '', email: '' },
        onSubmit: vi.fn(),
      }),
    )

    expect(typeof result.current.reset).toBe('function')
  })
})
