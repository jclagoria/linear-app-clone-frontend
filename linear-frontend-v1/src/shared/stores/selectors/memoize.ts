type SelectorFn<TReturn> = (...args: unknown[]) => TReturn

interface MemoizedSelector<TReturn> extends SelectorFn<TReturn> {
  cache: Map<string, TReturn>
}

function createKey(args: unknown[]): string {
  return args.map((arg) => {
    if (typeof arg === 'object' && arg !== null) {
      return JSON.stringify(arg, Object.keys(arg as Record<string, unknown>).sort())
    }
    return String(arg)
  }).join('::')
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

  selector.cache = cache
  return selector
}
