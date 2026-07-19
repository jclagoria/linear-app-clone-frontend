type SelectorFn<TReturn> = (...args: unknown[]) => TReturn

interface MemoizedSelector<TReturn> extends SelectorFn<TReturn> {
  cache: Map<string, TReturn>
}

function stableStringify(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const keys = Object.keys(value as Record<string, unknown>).sort()
  return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`).join(',')}}`
}

function createKey(args: unknown[]): string {
  return args.map(stableStringify).join('::')
}

export function createMemoizedSelector<TReturn>(
  fn: (...args: unknown[]) => TReturn,
  maxCacheSize = 50,
): MemoizedSelector<TReturn> {
  const cache = new Map<string, TReturn>()
  const keyOrder: string[] = []

  const selector = ((...args: unknown[]): TReturn => {
    const key = createKey(args)
    const cached = cache.get(key)
    if (cached !== undefined) {
      return cached
    }

    const result = fn(...args)

    if (cache.size >= maxCacheSize) {
      const oldest = keyOrder.shift()
      if (oldest !== undefined) cache.delete(oldest)
    }

    cache.set(key, result)
    keyOrder.push(key)

    return result
  }) as MemoizedSelector<TReturn>

  return selector
}
