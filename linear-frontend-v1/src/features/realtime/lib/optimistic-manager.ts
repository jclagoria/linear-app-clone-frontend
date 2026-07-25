import type { OptimisticUpdate } from './event-schema'
import { useOptimisticStore } from './optimistic-store'

export interface ApplyOptimisticOptions {
  update: OptimisticUpdate
  onConfirm?: (id: string) => void
  onRevert?: (id: string, error: Error) => void
}

export function applyOptimistic({ update, onConfirm, onRevert }: ApplyOptimisticOptions): void {
  const store = useOptimisticStore.getState()

  if (store.isPending(update.target)) return

  store.addPending(update)

  fetch(update.request.url, {
    method: update.request.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: update.request.body ? JSON.stringify(update.request.body) : undefined,
  })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      useOptimisticStore.getState().confirmPending(update.id)
      onConfirm?.(update.id)
    })
    .catch((error) => {
      const reverted = useOptimisticStore.getState().revertPending(update.id)
      if (reverted) {
        onRevert?.(update.id, error instanceof Error ? error : new Error(String(error)))
      }
    })
}

export function checkStaleUpdates(maxAgeMs = 30000): void {
  const store = useOptimisticStore.getState()
  const stale = store.clearStale(maxAgeMs)

  for (const update of stale) {
    onStaleRevert(update)
  }
}

// Revert event pub/sub for triggering RevertToast
type RevertListener = (update: OptimisticUpdate) => void
const revertListeners = new Set<RevertListener>()

export function onRevertEvent(listener: RevertListener): () => void {
  revertListeners.add(listener)
  return () => revertListeners.delete(listener)
}

function onStaleRevert(update: OptimisticUpdate): void {
  revertListeners.forEach((listener) => listener(update))
}

export function createOptimisticUpdate(
  params: Omit<OptimisticUpdate, 'id' | 'timestamp'>,
): OptimisticUpdate {
  return {
    ...params,
    id: `opt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
  }
}
