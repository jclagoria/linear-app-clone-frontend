import { createContext, useContext, type ReactNode } from 'react'

interface OptimisticContextValue {
  applyOptimistic: (update: unknown) => void
  isPending: (target: string) => boolean
  pendingCount: number
}

const OptimisticContext = createContext<OptimisticContextValue | null>(null)

export function useOptimistic(): OptimisticContextValue {
  const ctx = useContext(OptimisticContext)
  if (!ctx) throw new Error('useOptimistic must be used within OptimisticProvider')
  return ctx
}

interface OptimisticProviderProps {
  children: ReactNode
}

export function OptimisticProvider({ children }: OptimisticProviderProps) {
  // TODO: Implement optimistic update context (Phase 3)
  const value: OptimisticContextValue = {
    applyOptimistic: () => {},
    isPending: () => false,
    pendingCount: 0,
  }

  return (
    <OptimisticContext.Provider value={value}>
      {children}
    </OptimisticContext.Provider>
  )
}
