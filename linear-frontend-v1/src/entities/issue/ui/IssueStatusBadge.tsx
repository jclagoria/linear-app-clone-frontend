import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const STATUS_OPTIONS = [
  { label: 'Backlog', value: 'Backlog' },
  { label: 'Todo', value: 'Todo' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' },
  { label: 'Canceled', value: 'Canceled' },
]

const statusColorMap: Record<string, string> = {
  Backlog: 'bg-neutral text-text-muted',
  Todo: 'bg-neutral text-text-muted',
  'In Progress': 'bg-blue-100 text-blue-700',
  Done: 'bg-green-100 text-green-700',
  Canceled: 'bg-neutral text-text-muted',
}

interface IssueStatusBadgeProps {
  status: string
  loading?: boolean
  onStatusChange: (statusId: string) => void
}

export function IssueStatusBadge({ status, loading, onStatusChange }: IssueStatusBadgeProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, close])

  const colorClass = statusColorMap[status] ?? statusColorMap.Todo

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-busy={loading}
        aria-label={`Status: ${status}. Click to change`}
        disabled={loading}
        onClick={() => !loading && setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
          colorClass,
        )}
      >
        {status}
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Status options"
          className="absolute top-full left-0 z-50 mt-1 w-44 rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          {STATUS_OPTIONS.map((option) => {
            const isSelected = option.value === status
            const optionColor = statusColorMap[option.value] ?? ''
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  if (option.value !== status) {
                    onStatusChange(option.value)
                  }
                  close()
                }}
                className={cn(
                  'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors',
                  'hover:bg-surface-alt',
                  isSelected && 'font-medium',
                )}
              >
                <span className={cn('inline-block h-2 w-2 rounded-full', optionColor.split(' ')[0] || 'bg-neutral')} aria-hidden="true" />
                {option.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
