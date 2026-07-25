import { useEffect, useState } from 'react'
import { X, RotateCcw } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { onRevertEvent } from '../lib/optimistic-manager'

export function RevertToast() {
  const [message, setMessage] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    return onRevertEvent((update) => {
      setMessage(`Reverted: ${update.target}`)
      setVisible(true)
    })
  }, [])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [visible])

  if (!visible || !message) return null

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
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 rounded p-0.5 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
