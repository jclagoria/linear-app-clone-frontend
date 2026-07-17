import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle'

describe('useDocumentTitle', () => {
  it('sets document title with app suffix', () => {
    renderHook(() => useDocumentTitle('Issues'))
    expect(document.title).toBe('Issues — Linear Clone')
  })

  it('sets default title when empty', () => {
    renderHook(() => useDocumentTitle(''))
    expect(document.title).toBe('Linear Clone')
  })

  it('updates title on change', () => {
    const { rerender } = renderHook(
      (title: string) => useDocumentTitle(title),
      { initialProps: 'Issues' },
    )
    expect(document.title).toBe('Issues — Linear Clone')

    rerender('Projects')
    expect(document.title).toBe('Projects — Linear Clone')
  })
})
