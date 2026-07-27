import { useEffect, useState, useCallback } from 'react'
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface Toast {
  id: string
  type: 'error' | 'warning' | 'success' | 'info'
  title: string
  message?: string
  duration?: number
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
}

const TOAST_STYLES: Record<Toast['type'], { icon: React.ReactNode; className: string }> = {
  error: {
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
    className: 'border-red-500/30 bg-red-50 dark:bg-red-950/30',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    className: 'border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/30',
  },
  success: {
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    className: 'border-green-500/30 bg-green-50 dark:bg-green-950/30',
  },
  info: {
    icon: <Info className="h-4 w-4 text-blue-500" />,
    className: 'border-blue-500/30 bg-blue-50 dark:bg-blue-950/30',
  },
}

const POSITION_STYLES: Record<string, string> = {
  'top-right': 'top-4 right-4',
  'bottom-right': 'bottom-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-left': 'bottom-4 left-4',
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(true)
  const style = TOAST_STYLES[toast.type]

  useEffect(() => {
    const duration = toast.duration ?? 5000
    if (duration <= 0) return
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [toast.duration, toast.id, onDismiss])

  if (!visible) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg',
        'transition-all duration-300 animate-in slide-in-from-right-5',
        style.className,
      )}
    >
      <div className="mt-0.5 shrink-0">{style.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)]">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-xs text-[var(--text-secondary)]">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onDismiss(toast.id), 300)
        }}
        className="shrink-0 rounded p-0.5 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer({
  toasts,
  onDismiss,
  position = 'bottom-right',
}: ToastContainerProps) {
  const handleDismiss = useCallback(
    (id: string) => {
      onDismiss(id)
    },
    [onDismiss],
  )

  if (toasts.length === 0) return null

  return (
    <div
      className={cn('fixed z-50 flex flex-col gap-2', POSITION_STYLES[position])}
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>
  )
}
