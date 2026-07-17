import { AlertTriangle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface ErrorBannerProps {
  message: string
  className?: string
}

export function ErrorBanner({ message, className }: ErrorBannerProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-2 rounded-md bg-error-bg border border-error-border px-3 py-2.5 text-sm text-error-text',
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
