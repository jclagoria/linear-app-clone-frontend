import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
      role="alert"
    >
      <h1 className="text-2xl font-semibold text-text">Page not found</h1>
      <p className="text-sm text-text-muted">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="text-sm font-medium text-primary hover:text-primary-hover underline"
      >
        Go to Dashboard
      </Link>
    </main>
  )
}
