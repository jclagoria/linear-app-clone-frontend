import { useEffect, useState, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface RateLimitToastProps {
  retryAfter: number
  onRetry?: () => void
  onDismiss: () => void
}

export function RateLimitToast({ retryAfter, onRetry, onDismiss }: RateLimitToastProps) {
  const [remaining, setRemaining] = useState(retryAfter)
  const timerRef = useRef<ReturnType<typeof setInterval>>()
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Auto-dismiss after retry window + 2s grace
    dismissTimerRef.current = setTimeout(() => {
      onDismiss()
    }, (retryAfter + 2) * 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    }
  }, [retryAfter, onDismiss])

  const handleDismiss = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    onDismiss()
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border-l-4 border-l-danger bg-surface px-4 py-3 text-sm shadow-lg',
        'animate-in slide-in-from-right-2 fade-in',
      )}
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text">Rate limit reached</p>
        <p className="mt-0.5 text-text-muted">
          {remaining > 0
            ? `Please wait ${remaining}s before trying again.`
            : 'You can try again now.'}
        </p>
        {onRetry && (
          <button
            onClick={() => {
              onRetry()
              handleDismiss()
            }}
            disabled={remaining > 0}
            className={cn(
              'mt-2 text-sm font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              remaining > 0
                ? 'text-text-muted cursor-not-allowed'
                : 'text-primary hover:text-primary-hover',
            )}
            aria-label="Retry"
          >
            Retry
          </button>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="shrink-0 rounded p-1 text-text-muted hover:text-text hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
