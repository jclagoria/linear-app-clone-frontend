import { useEffect, useRef, useCallback } from 'react'
import { AlertTriangle, LogOut } from 'lucide-react'

interface ConnectionErrorModalProps {
  isVisible: boolean
  onReconnect?: () => void
  onLogout?: () => void
  onDismiss?: () => void
  maxAttempts?: number
}

export function ConnectionErrorModal({
  isVisible,
  onReconnect,
  onLogout,
  onDismiss,
  maxAttempts = 10,
}: ConnectionErrorModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isVisible) {
      previousFocusRef.current = document.activeElement as HTMLElement
      dialogRef.current?.focus()
    } else {
      previousFocusRef.current?.focus()
    }
  }, [isVisible])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss?.()
        return
      }
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusable?.length) return
        const first = focusable[0] as HTMLElement
        const last = focusable[focusable.length - 1] as HTMLElement
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onDismiss],
  )

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onDismiss}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="connection-error-title"
        aria-describedby="connection-error-desc"
        className="w-full max-w-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 id="connection-error-title" className="text-lg font-semibold text-[var(--text-primary)]">
            Connection Lost
          </h2>
        </div>

        <p id="connection-error-desc" className="mb-6 text-sm text-[var(--text-secondary)]">
          Unable to establish a connection after {maxAttempts} attempts.
          Please check your network and try again.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onReconnect}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Reconnect
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-md border border-[var(--border-color)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
