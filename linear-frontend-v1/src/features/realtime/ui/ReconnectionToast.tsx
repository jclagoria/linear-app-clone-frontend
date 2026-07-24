import { useEffect, useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface ReconnectionToastProps {
  variant?: 'warning' | 'error' | 'network'
  message?: string
  onRetry?: () => void
  onDismiss?: () => void
  autoDismissMs?: number
}

const VARIANT_STYLES = {
  warning: 'border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/30',
  error: 'border-red-500/30 bg-red-50 dark:bg-red-950/30',
  network: 'border-orange-500/30 bg-orange-50 dark:bg-orange-950/30',
}

export function ReconnectionToast({
  variant = 'warning',
  message = 'Connection lost. Reconnecting...',
  onRetry,
  onDismiss,
  autoDismissMs = 5000,
}: ReconnectionToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (autoDismissMs <= 0) return
    const timer = setTimeout(() => {
      setVisible(false)
      onDismiss?.()
    }, autoDismissMs)
    return () => clearTimeout(timer)
  }, [autoDismissMs, onDismiss])

  if (!visible) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-start gap-3 rounded-lg border p-4 shadow-lg',
        'transition-all duration-300 animate-in slide-in-from-right-5',
        VARIANT_STYLES[variant],
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
      <p className="flex-1 text-sm text-[var(--text-primary)]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Retry
        </button>
      )}
      <button
        onClick={() => {
          setVisible(false)
          onDismiss?.()
        }}
        className="shrink-0 rounded p-0.5 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
