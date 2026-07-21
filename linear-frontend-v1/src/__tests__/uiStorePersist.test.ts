import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '@/shared/stores/uiStore'

describe('uiStore persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    useUIStore.setState({ sidebarCollapsed: false, theme: 'system' })
  })

  it('persists theme to localStorage on change', () => {
    useUIStore.getState().setTheme('dark')

    const stored = localStorage.getItem('linear-ui-store')
    expect(stored).not.toBeNull()

    const parsed = JSON.parse(stored!)
    expect(parsed.state.theme).toBe('dark')
  })

  it('persists sidebarCollapsed to localStorage on change', () => {
    useUIStore.getState().toggleSidebar()

    const stored = localStorage.getItem('linear-ui-store')
    expect(stored).not.toBeNull()

    const parsed = JSON.parse(stored!)
    expect(parsed.state.sidebarCollapsed).toBe(true)
  })

  it('writes persisted state to localStorage matching store values', () => {
    useUIStore.getState().setTheme('dark')
    useUIStore.getState().setSidebarCollapsed(true)

    const stored = localStorage.getItem('linear-ui-store')
    const parsed = JSON.parse(stored!)

    expect(parsed.state.sidebarCollapsed).toBe(true)
    expect(parsed.state.theme).toBe('dark')
  })

  it('partialize only includes sidebarCollapsed and theme in localStorage', () => {
    useUIStore.getState().setTheme('dark')
    useUIStore.getState().toggleSidebar()
    useUIStore.getState().openModal('test-modal')

    const stored = localStorage.getItem('linear-ui-store')
    const parsed = JSON.parse(stored!)

    // Should only have sidebarCollapsed and theme
    expect(parsed.state).toHaveProperty('sidebarCollapsed')
    expect(parsed.state).toHaveProperty('theme')
    expect(parsed.state).not.toHaveProperty('activeModal')
    expect(parsed.state).not.toHaveProperty('keyboardContext')
  })
})
