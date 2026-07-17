import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useActiveRoute } from '@/widgets/Sidebar/model/useActiveRoute'

function renderUseActiveRoute(initialEntries: string[]) {
  return renderHook(() => useActiveRoute(), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    ),
  })
}

describe('useActiveRoute', () => {
  it('returns true for exact match', () => {
    const { result } = renderUseActiveRoute(['/issues'])
    expect(result.current.isActive('/issues')).toBe(true)
  })

  it('returns true for parent route match', () => {
    const { result } = renderUseActiveRoute(['/issues/abc-123'])
    expect(result.current.isActive('/issues')).toBe(true)
  })

  it('returns false for non-matching route', () => {
    const { result } = renderUseActiveRoute(['/issues'])
    expect(result.current.isActive('/projects')).toBe(false)
  })

  it('returns current path', () => {
    const { result } = renderUseActiveRoute(['/projects/p1'])
    expect(result.current.currentPath).toBe('/projects/p1')
  })

  it('handles root path', () => {
    const { result } = renderUseActiveRoute(['/'])
    expect(result.current.isActive('/')).toBe(true)
  })
})
