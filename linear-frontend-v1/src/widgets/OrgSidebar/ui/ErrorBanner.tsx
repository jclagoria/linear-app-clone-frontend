interface ErrorBannerProps {
  onRetry: () => void
}

export function ErrorBanner({ onRetry }: ErrorBannerProps) {
  return (
    <div
      className="mx-3 my-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-3 text-sm"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-[var(--text-primary)]">Could not load teams.</p>
      <button
        onClick={onRetry}
        className="mt-2 rounded-md bg-[var(--bg-tertiary)] px-3 py-1 text-xs font-medium text-[var(--accent-color)] transition-colors hover:bg-[var(--bg-tertiary)]/80"
        type="button"
      >
        Retry
      </button>
    </div>
  )
}
