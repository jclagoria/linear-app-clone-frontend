import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ThemeToggle } from '@/widgets/Header/ui/ThemeToggle'
import { useUIStore } from '@/shared/stores/uiStore'
import { renderWithRouter, resetStores } from './test-utils'

describe('ThemeToggle', () => {
  beforeEach(() => {
    resetStores()
    useUIStore.setState({ theme: 'light' })
  })

  it('renders with light theme initially', () => {
    renderWithRouter(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
  })

  it('has correct aria-label for switching to dark mode', () => {
    useUIStore.setState({ theme: 'light' })
    renderWithRouter(<ThemeToggle />)
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })

  it('cycles from light → dark → system → light', async () => {
    const { user } = renderWithRouter(<ThemeToggle />)
    const btn = screen.getByRole('button')

    await user.click(btn)
    expect(useUIStore.getState().theme).toBe('dark')

    await user.click(btn)
    expect(useUIStore.getState().theme).toBe('system')

    await user.click(btn)
    expect(useUIStore.getState().theme).toBe('light')
  })

  it('updates aria-label after cycling to dark', async () => {
    useUIStore.setState({ theme: 'light' })
    const { user } = renderWithRouter(<ThemeToggle />)
    const btn = screen.getByRole('button')

    await user.click(btn)
    expect(useUIStore.getState().theme).toBe('dark')
    expect(screen.getByLabelText('Switch to system mode')).toBeInTheDocument()
  })
})
