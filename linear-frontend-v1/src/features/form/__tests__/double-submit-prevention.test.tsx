import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFormFormik } from '../lib/useFormFormik'
import { TextField } from '../ui/TextField'
import { SubmitButton } from '../ui/SubmitButton'
import { z } from 'zod'

const simpleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

type SimpleFormData = z.infer<typeof simpleSchema>

function DoubleSubmitTestForm({
  onSubmit,
}: {
  onSubmit: (data: SimpleFormData) => Promise<void>
}) {
  const { control, handleSubmit, formState } = useFormFormik<SimpleFormData>({
    schema: simpleSchema,
    defaultValues: { name: '' },
    onSubmit,
  })

  return (
    <form onSubmit={handleSubmit} aria-label="Test form" noValidate>
      <TextField name="name" control={control} label="Name" disabled={formState.isSubmitting} />
      <SubmitButton isSubmitting={formState.isSubmitting}>Submit</SubmitButton>
    </form>
  )
}

describe('Double-Submit Prevention Integration', () => {
  it('should prevent double submission on rapid clicks', async () => {
    const user = userEvent.setup()

    const onSubmit = vi.fn().mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
    })

    render(<DoubleSubmitTestForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/name/i), 'Test Name')

    await user.click(screen.getByRole('button', { name: /submit/i }))
    await user.click(screen.getByRole('button', { name: /submit/i }))
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
  })

  it('should show loading state immediately on first click', async () => {
    const user = userEvent.setup()
    let resolveSubmit: () => void
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve
    })

    const onSubmit = vi.fn().mockImplementation(() => submitPromise)

    render(<DoubleSubmitTestForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/name/i), 'Test Name')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submitting/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled()

    resolveSubmit!()
  })

  it('should re-enable submit button after submission completes', async () => {
    const user = userEvent.setup()

    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<DoubleSubmitTestForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/name/i), 'Test Name')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled()
    })
  })

  it('should re-enable submit button after submission fails', async () => {
    const user = userEvent.setup()

    const onSubmit = vi.fn().mockImplementation(async () => {
      throw new Error('Failed')
    })

    render(<DoubleSubmitTestForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/name/i), 'Test Name')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled()
    })
  })

  it('should not accept field input while submitting', async () => {
    const user = userEvent.setup()
    let resolveSubmit: () => void
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve
    })

    const onSubmit = vi.fn().mockImplementation(() => submitPromise)

    render(<DoubleSubmitTestForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/name/i), 'Initial')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeDisabled()
    })

    resolveSubmit!()
    await submitPromise
  })
})
