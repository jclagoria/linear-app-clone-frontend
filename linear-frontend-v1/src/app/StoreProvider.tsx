import { type ReactNode, useEffect, useState } from 'react'
import { useAuthStore } from '@/entities/session/model/store'

type ProviderState = 'initialising' | 'ready' | 'error'

interface StoreProviderProps {
  children: ReactNode
  splash?: ReactNode
}

export function StoreProvider({ children, splash }: StoreProviderProps) {
  const [state, setState] = useState<ProviderState>('initialising')

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        await useAuthStore.getState().hydrate()
        if (!cancelled) setState('ready')
      } catch {
        if (!cancelled) setState('error')
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  if (state === 'error') {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 p-8"
        role="alert"
      >
        <p className="text-lg font-semibold text-text">Failed to initialise</p>
        <p className="text-sm text-text-muted">
          Something went wrong while loading the application.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  if (state === 'initialising') {
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
