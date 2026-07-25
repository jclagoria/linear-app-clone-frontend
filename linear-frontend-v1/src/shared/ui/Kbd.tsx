import { cn } from '@/shared/lib/utils'

interface KbdProps {
  children: React.ReactNode
  className?: string
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center',
        'min-w-[24px] h-[24px] px-1.5',
        'rounded bg-surface-alt border border-border',
        'text-xs font-mono text-text-muted',
        'shadow-[0_1px_0_0_var(--color-border)]',
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </kbd>
  )
}
