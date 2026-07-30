import { useEffect, useState } from 'react'

export function SkeletonLoader() {
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="flex flex-1 flex-col gap-3 px-3 py-4"
      role="status"
      aria-busy="true"
      aria-label="Loading teams"
    >
      {/* Org header skeleton */}
      <div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-tertiary)]" />
      {/* Team items skeleton */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 pl-4">
          <div className="h-3.5 w-3.5 animate-pulse rounded bg-[var(--bg-tertiary)]" />
          <div className="h-3.5 w-28 animate-pulse rounded bg-[var(--bg-tertiary)]" />
          <div className="ml-auto h-3.5 w-10 animate-pulse rounded bg-[var(--bg-tertiary)]" />
        </div>
      ))}
      {showMessage && (
        <p className="mt-2 text-center text-xs text-[var(--text-secondary)]">
          Loading your teams…
        </p>
      )}
    </div>
  )
}
