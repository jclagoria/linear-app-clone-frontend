import { describe, it, expect, beforeEach } from 'vitest'
import { useCacheStore } from '@/shared/stores/cacheStore'

describe('cacheStore', () => {
  beforeEach(() => {
    useCacheStore.setState({
      entries: new Map(),
      accessOrder: [],
      maxSize: 100,
    })
  })

  it('returns null for cache miss', () => {
    const result = useCacheStore.getState().get('nonexistent')
    expect(result).toBeNull()
  })

  it('returns cached data within TTL', () => {
    useCacheStore.getState().set('issues:1', { id: '1', title: 'Test' }, 60_000)
    const result = useCacheStore.getState().get<{ id: string; title: string }>('issues:1')
    expect(result).not.toBeNull()
    expect(result!.data.title).toBe('Test')
    expect(result!.stale).toBe(false)
  })

  it('returns stale data past TTL', () => {
    useCacheStore.getState().set('issues:1', { id: '1' }, -1000)
    const result = useCacheStore.getState().get('issues:1')
    expect(result).not.toBeNull()
    expect(result!.stale).toBe(true)
  })

  it('invalidates specific key', () => {
    useCacheStore.getState().set('issues:1', { id: '1' })
    useCacheStore.getState().invalidate('issues:1')
    expect(useCacheStore.getState().get('issues:1')).toBeNull()
  })

  it('invalidates by prefix', () => {
    useCacheStore.getState().set('issues:1', { id: '1' })
    useCacheStore.getState().set('issues:2', { id: '2' })
    useCacheStore.getState().set('projects:1', { id: 'p1' })
    useCacheStore.getState().invalidateByPrefix('issues')
    expect(useCacheStore.getState().get('issues:1')).toBeNull()
    expect(useCacheStore.getState().get('issues:2')).toBeNull()
    expect(useCacheStore.getState().get('projects:1')).not.toBeNull()
  })

  it('clears all entries', () => {
    useCacheStore.getState().set('issues:1', { id: '1' })
    useCacheStore.getState().set('projects:1', { id: 'p1' })
    useCacheStore.getState().clear()
    expect(useCacheStore.getState().get('issues:1')).toBeNull()
    expect(useCacheStore.getState().get('projects:1')).toBeNull()
  })

  it('evicts LRU entries when exceeding maxSize', () => {
    useCacheStore.setState({ maxSize: 2 })
    useCacheStore.getState().set('a', 1)
    useCacheStore.getState().set('b', 2)
    useCacheStore.getState().set('c', 3)

    expect(useCacheStore.getState().get('a')).toBeNull()
    expect(useCacheStore.getState().get('b')).not.toBeNull()
    expect(useCacheStore.getState().get('c')).not.toBeNull()
  })

  it('promotes accessed keys (LRU refresh)', () => {
    useCacheStore.setState({ maxSize: 2 })
    useCacheStore.getState().set('a', 1)
    useCacheStore.getState().set('b', 2)
    useCacheStore.getState().get('a')
    useCacheStore.getState().set('c', 3)

    expect(useCacheStore.getState().get('a')).not.toBeNull()
    expect(useCacheStore.getState().get('b')).toBeNull()
    expect(useCacheStore.getState().get('c')).not.toBeNull()
  })

  it('uses default TTL based on key prefix', () => {
    useCacheStore.getState().set('issues:list', { data: 'test' })
    const entry = useCacheStore.getState().entries.get('issues:list')
    expect(entry?.ttl).toBe(30_000)
  })
})
