import { AlertTriangle, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

type ErrorBannerType = 'validation' | 'server'

interface ErrorBannerProps {
  message: string
  type?: ErrorBannerType
  onDismiss?: () => void
  className?: string
}

const typeStyles: Record<ErrorBannerType, string> = {
  validation: 'bg-error-bg border-error-border text-error-text',
  server: 'bg-error-bg border-error-border text-error-text',
}

export function ErrorBanner({ message, type = 'validation', onDismiss, className }: ErrorBannerProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm',
        typeStyles[type],
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 text-current opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
