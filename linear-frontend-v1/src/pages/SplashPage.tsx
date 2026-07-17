import { Spinner } from '@/shared/ui/Spinner'

export function SplashPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      {/* App Logo */}
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            fill="white"
          />
        </svg>
      </div>
      <div className="flex items-center gap-3">
        <Spinner size="md" className="text-primary" />
        <span className="text-sm text-text-muted">Loading...</span>
      </div>
    </div>
  )
}
