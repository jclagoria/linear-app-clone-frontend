import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useFormFormik } from '../lib/useFormFormik'
import { TextField } from '../ui/TextField'
import { SubmitButton } from '../ui/SubmitButton'
import { z } from 'zod'

const testFormSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type TestFormData = z.infer<typeof testFormSchema>

function TestForm({
  onSubmit,
}: {
  onSubmit?: (data: TestFormData) => Promise<void>
}) {
  const defaultSubmit = async (data: TestFormData) => {
    const response = await fetch('/api/v1/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Submission failed')
  }

  const { control, handleSubmit, formState } = useFormFormik<TestFormData>({
    schema: testFormSchema,
    defaultValues: { title: '', email: '' },
    onSubmit: onSubmit ?? defaultSubmit,
  })

  return (
    <form onSubmit={handleSubmit} aria-label="Test form" noValidate>
      <TextField name="title" control={control} label="Title" placeholder="Enter title" />
      <TextField name="email" control={control} label="Email" placeholder="Enter email" />
      <SubmitButton isSubmitting={formState.isSubmitting}>Submit</SubmitButton>
    </form>
  )
}

describe('Form Submission Flow Integration', () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'bypass' })
  })

  afterEach(() => {
    server.resetHandlers()
    server.close()
  })

  it('should show validation errors on submit with empty fields', async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('should show validation error when title is too short', async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    await user.type(screen.getByPlaceholderText(/enter title/i), 'ab')
    await user.tab()
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    await user.type(screen.getByPlaceholderText(/enter email/i), 'not-an-email')
    await user.tab()
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })

  it('should successfully submit with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<TestForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText(/enter title/i), 'Test Issue Title')
    await user.type(screen.getByPlaceholderText(/enter email/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Test Issue Title',
        email: 'user@example.com',
      })
    })
  })

  it('should disable submit button during submission', async () => {
    const user = userEvent.setup()
    let resolveSubmit: () => void
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve
    })

    const onSubmit = vi.fn().mockImplementation(() => submitPromise)

    render(<TestForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText(/enter title/i), 'Test Issue Title')
    await user.type(screen.getByPlaceholderText(/enter email/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled()
    })

    resolveSubmit!()
    await submitPromise
  })

  it('should re-enable form after submission failure', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockImplementation(async () => {
      throw new Error('Network error')
    })

    render(<TestForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText(/enter title/i), 'Test Issue Title')
    await user.type(screen.getByPlaceholderText(/enter email/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled()
    })

    expect(screen.getByPlaceholderText(/enter title/i)).not.toBeDisabled()
    expect(screen.getByPlaceholderText(/enter email/i)).not.toBeDisabled()
  })

  it('should call API with correct data on valid submission', async () => {
    const user = userEvent.setup()
    let capturedRequest: Request | null = null

    server.use(
      http.post('/api/v1/issues', async ({ request }) => {
        capturedRequest = request.clone()
        const body = await request.json()
        return HttpResponse.json({ data: { id: '1', ...body } }, { status: 201 })
      }),
    )

    render(<TestForm />)

    await user.type(screen.getByPlaceholderText(/enter title/i), 'New Bug Report')
    await user.type(screen.getByPlaceholderText(/enter email/i), 'reporter@example.com')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(capturedRequest).not.toBeNull()
    })

    const body = await capturedRequest!.json()
    expect(body).toEqual({
      title: 'New Bug Report',
      email: 'reporter@example.com',
    })
  })

  it('should clear validation errors when corrected', async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText(/enter title/i), 'Valid Title')
    await user.tab()

    await waitFor(() => {
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
    })
  })
})
