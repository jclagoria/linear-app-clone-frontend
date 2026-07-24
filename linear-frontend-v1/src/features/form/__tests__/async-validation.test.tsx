import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useFormFormik } from '../lib/useFormFormik'
import { TextField } from '../ui/TextField'
import { SubmitButton } from '../ui/SubmitButton'
import { z } from 'zod'

const asyncValidationSchema = z.object({
  username: z.string().min(1, 'Username is required').min(3, 'Username must be at least 3 characters'),
}).refine(
  async (data) => {
    if (!data.username || data.username.length < 3) return true
    const response = await fetch(`/api/v1/check-username?username=${encodeURIComponent(data.username)}`)
    const result = await response.json()
    return result.available
  },
  {
    message: 'This username is already taken',
    path: ['username'],
  },
)

type AsyncFormData = z.infer<typeof asyncValidationSchema>

function AsyncValidationTestForm({
  onSubmit,
}: {
  onSubmit: (data: AsyncFormData) => Promise<void>
}) {
  const { control, handleSubmit, formState } = useFormFormik<AsyncFormData>({
    schema: asyncValidationSchema,
    defaultValues: { username: '' },
    onSubmit,
  })

  return (
    <form onSubmit={handleSubmit} aria-label="Test form" noValidate>
      <TextField name="username" control={control} label="Username" placeholder="Choose a username" />
      <SubmitButton isSubmitting={formState.isSubmitting}>Register</SubmitButton>
    </form>
  )
}

describe('Async Validation Integration', () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'bypass' })
  })

  afterEach(() => {
    server.resetHandlers()
    server.close()
  })

  it('should show validation error for unavailable username', async () => {
    const user = userEvent.setup()

    server.use(
      http.get('/api/v1/check-username', ({ request }) => {
        const url = new URL(request.url)
        const username = url.searchParams.get('username')
        const taken = username === 'takenuser'
        return HttpResponse.json({ available: !taken })
      }),
    )

    render(<AsyncValidationTestForm onSubmit={vi.fn()} />)

    await user.type(screen.getByPlaceholderText(/choose a username/i), 'takenuser')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText('This username is already taken')).toBeInTheDocument()
    })
  })

  it('should allow submission with available username', async () => {
    const user = userEvent.setup()

    server.use(
      http.get('/api/v1/check-username', () => {
        return HttpResponse.json({ available: true })
      }),
    )

    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<AsyncValidationTestForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText(/choose a username/i), 'availableuser')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ username: 'availableuser' })
    })
  })

  it('should show required error before async validation runs', async () => {
    const user = userEvent.setup()

    render(<AsyncValidationTestForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument()
    })
  })

  it('should not run async validation for short usernames', async () => {
    const user = userEvent.setup()
    let checkCalled = false

    server.use(
      http.get('/api/v1/check-username', () => {
        checkCalled = true
        return HttpResponse.json({ available: true })
      }),
    )

    render(<AsyncValidationTestForm onSubmit={vi.fn()} />)

    await user.type(screen.getByPlaceholderText(/choose a username/i), 'ab')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument()
    })

    expect(checkCalled).toBe(false)
  })

  it('should disable submit button during async validation', async () => {
    const user = userEvent.setup()
    let resolveCheck: (value: boolean) => void
    const checkPromise = new Promise<boolean>((resolve) => {
      resolveCheck = resolve
    })

    server.use(
      http.get('/api/v1/check-username', async () => {
        const available = await checkPromise
        return HttpResponse.json({ available })
      }),
    )

    render(<AsyncValidationTestForm onSubmit={vi.fn()} />)

    await user.type(screen.getByPlaceholderText(/choose a username/i), 'checkinguser')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /submitting|register/i })
      expect(button).toBeDisabled()
    }, { timeout: 2000 })

    resolveCheck!(true)

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /submitting|register/i })
      expect(button).not.toBeDisabled()
    }, { timeout: 5000 })
  })
})
