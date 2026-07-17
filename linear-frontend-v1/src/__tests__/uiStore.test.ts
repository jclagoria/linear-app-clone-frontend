import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '@/shared/stores/uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarCollapsed: false })
    localStorage.removeItem('linear-ui-store')
  })

  it('starts with sidebar expanded', () => {
    expect(useUIStore.getState().sidebarCollapsed).toBe(false)
  })

  it('toggles sidebar state', () => {
    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarCollapsed).toBe(true)

    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarCollapsed).toBe(false)
  })

  it('sets sidebar state directly', () => {
    useUIStore.getState().setSidebarCollapsed(true)
    expect(useUIStore.getState().sidebarCollapsed).toBe(true)

    useUIStore.getState().setSidebarCollapsed(false)
    expect(useUIStore.getState().sidebarCollapsed).toBe(false)
  })
})
