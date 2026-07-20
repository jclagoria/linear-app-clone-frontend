import { cn } from '@/shared/lib/utils'
import { Spinner } from './Spinner'

interface LoadingOverlayProps {
  label?: string
  className?: string
}

export function LoadingOverlay({ label, className }: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label ?? 'Loading'}
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm',
        className,
      )}
    >
      <Spinner size="lg" />
      {label && (
        <p className="mt-4 text-sm text-text-muted">{label}</p>
      )}
    </div>
  )
}
