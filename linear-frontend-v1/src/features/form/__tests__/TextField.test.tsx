import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { TextField } from '../ui/TextField'

function TestWrapper() {
  const { control } = useForm({
    defaultValues: { testField: '' },
  })

  return <TextField name="testField" control={control} label="Test Field" />
}

describe('TextField', () => {
  it('should render with label', () => {
    render(<TestWrapper />)
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument()
  })

  it('should render input element', () => {
    render(<TestWrapper />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should have accessible label association', () => {
    render(<TestWrapper />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAccessibleName('Test Field')
  })
})
