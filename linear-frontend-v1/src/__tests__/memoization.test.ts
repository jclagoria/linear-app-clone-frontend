import { describe, it, expect } from 'vitest'
import { createMemoizedSelector } from '@/shared/stores/selectors/memoize'

describe('createMemoizedSelector', () => {
  it('returns cached result for unchanged inputs', () => {
    let computeCount = 0
    const selector = createMemoizedSelector((a: number, b: number) => {
      computeCount++
      return a + b
    })

    expect(selector(1, 2)).toBe(3)
    expect(computeCount).toBe(1)

    expect(selector(1, 2)).toBe(3)
    expect(computeCount).toBe(1)
  })

  it('recomputes on input change', () => {
    let computeCount = 0
    const selector = createMemoizedSelector((a: number, b: number) => {
      computeCount++
      return a + b
    })

    selector(1, 2)
    expect(computeCount).toBe(1)

    selector(2, 3)
    expect(computeCount).toBe(2)
    expect(selector(2, 3)).toBe(5)
  })

  it('creates cache key from object arguments', () => {
    const selector = createMemoizedSelector((obj: { x: number }) => obj.x)

    expect(selector({ x: 1 })).toBe(1)
    expect(selector({ x: 1 })).toBe(1)
    expect(selector({ x: 2 })).toBe(2)
  })

  it('respects max cache size', () => {
    let computeCount = 0
    const selector = createMemoizedSelector((n: number) => {
      computeCount++
      return n * 2
    }, 2)

    selector(1)
    selector(2)
    expect(computeCount).toBe(2)

    selector(3)
    expect(computeCount).toBe(3)

    selector(1)
    expect(computeCount).toBe(4)
  })

  it('handles cross-store selector with multiple dependencies', () => {
    let computeCount = 0
    const selector = createMemoizedSelector(
      (issues: number[], _filter: string) => {
        computeCount++
        return issues.filter((i) => i > 0)
      },
    )

    const issues = [1, 2, 3]
    selector(issues, 'active')
    expect(computeCount).toBe(1)

    selector(issues, 'active')
    expect(computeCount).toBe(1)

    selector(issues, 'all')
    expect(computeCount).toBe(2)
  })
})
