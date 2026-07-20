import { cn } from '@/shared/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
}

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        sizeMap[size],
        className,
      )}
      role="status"
      aria-busy="true"
      aria-label={label ?? 'Loading'}
    >
      <span className="sr-only">{label ?? 'Loading'}</span>
    </span>
  )
}
