import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/widgets/Header/ui/ThemeToggle'
import { useUIStore } from '@/shared/stores/uiStore'

describe('ThemeToggle', () => {
  beforeEach(() => {
    useUIStore.setState({ theme: 'light' })
  })

  it('renders with light theme initially', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
  })

  it('has correct aria-label for switching to dark mode', () => {
    useUIStore.setState({ theme: 'light' })
    render(<ThemeToggle />)
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })

  it('cycles from light → dark → system → light', async () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')

    // light → dark
    await userEvent.click(btn)
    expect(useUIStore.getState().theme).toBe('dark')

    // dark → system
    await userEvent.click(btn)
    expect(useUIStore.getState().theme).toBe('system')

    // system → light
    await userEvent.click(btn)
    expect(useUIStore.getState().theme).toBe('light')
  })

  it('updates aria-label after cycling to dark', async () => {
    useUIStore.setState({ theme: 'light' })
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')

    await userEvent.click(btn)
    expect(useUIStore.getState().theme).toBe('dark')
    expect(screen.getByLabelText('Switch to system mode')).toBeInTheDocument()
  })
})
