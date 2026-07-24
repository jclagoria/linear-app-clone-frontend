import { useEffect, useState } from 'react'
import { X, RotateCcw } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface RevertToastProps {
  message?: string
  onRetry?: () => void
  onDismiss?: () => void
  autoDismissMs?: number
}

export function RevertToast({
  message = 'Update failed. Change reverted.',
  onRetry,
  onDismiss,
  autoDismissMs = 5000,
}: RevertToastProps) {
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
        'border-red-500/30 bg-red-50 dark:bg-red-950/30',
        'transition-all duration-300 animate-in slide-in-from-right-5',
      )}
    >
      <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      <p className="flex-1 text-sm text-[var(--text-primary)]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <RotateCcw className="h-3 w-3" />
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
