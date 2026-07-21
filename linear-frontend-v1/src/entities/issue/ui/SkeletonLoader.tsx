import { cn } from '@/shared/lib/utils'

interface SkeletonLoaderProps {
  count?: number
  className?: string
}

export function SkeletonLoader({ count = 5, className }: SkeletonLoaderProps) {
  return (
    <div className={cn('space-y-3', className)} role="status" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-border bg-surface p-4"
        >
          <div className="mb-2 h-4 w-3/4 rounded bg-border" />
          <div className="mb-1 h-3 w-1/4 rounded bg-border" />
          <div className="h-3 w-1/2 rounded bg-border" />
        </div>
      ))}
      <span className="sr-only">Loading issues...</span>
    </div>
  )
}
