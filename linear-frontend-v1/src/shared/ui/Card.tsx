import { type ReactNode, useCallback } from 'react'
import { cn } from '@/shared/lib/utils'

interface CardProps {
  title?: string
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function Card({ title, children, onClick, className }: CardProps) {
  const isClickable = !!onClick

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick?.()
      }
    },
    [onClick],
  )

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      className={cn(
        'rounded-lg border border-border bg-surface p-4',
        isClickable &&
          'cursor-pointer transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className,
      )}
    >
      {title && (
        <h3 className="mb-2 text-base font-semibold text-text">{title}</h3>
      )}
      <div className="text-sm text-text-muted">{children}</div>
    </div>
  )
}
