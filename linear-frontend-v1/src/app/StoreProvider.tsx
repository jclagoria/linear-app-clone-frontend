import { type ReactNode, useEffect, useState } from 'react'
import { useAuthStore } from '@/entities/session/model/store'

interface StoreProviderProps {
  children: ReactNode
  splash?: ReactNode
}

export function StoreProvider({ children, splash }: StoreProviderProps) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false

    useAuthStore.getState().hydrate().finally(() => {
      if (!cancelled) setHydrated(true)
    })

    return () => { cancelled = true }
  }, [])

  if (!hydrated) {
    if (splash) return <>{splash}</>
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
