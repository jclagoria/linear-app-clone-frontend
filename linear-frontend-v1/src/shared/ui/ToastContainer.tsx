import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useToastStore, type Toast } from '@/shared/stores/toastStore'
import { cn } from '@/shared/lib/utils'

const variantStyles: Record<string, string> = {
  info: 'border-l-4 border-l-primary bg-surface shadow-lg',
  error: 'border-l-4 border-l-danger bg-surface shadow-lg',
  success: 'border-l-4 border-l-success bg-surface shadow-lg',
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const duration = toast.duration ?? 5000
    timerRef.current = setTimeout(() => {
      removeToast(toast.id)
    }, duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [toast.id, toast.duration, removeToast])

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    removeToast(toast.id)
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md px-4 py-3 text-sm',
        'animate-in slide-in-from-right-2 fade-in',
        variantStyles[toast.variant],
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text">{toast.title}</p>
        {toast.message && (
          <p className="mt-0.5 text-text-muted">{toast.message}</p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick()
              handleDismiss()
            }}
            className="mt-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            aria-label={toast.action.label}
          >
            {toast.action.label}
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

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <aside
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-end gap-2 p-4 sm:right-4 sm:left-auto sm:top-4 sm:p-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </aside>
  )
}
