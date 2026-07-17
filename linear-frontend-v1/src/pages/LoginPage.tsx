import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()

  // If already authenticated, redirect to app
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />
  }

  // If hydrating, don't flash login
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="flex flex-col items-center gap-3"
          role="status"
          aria-live="polite"
        >
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
          <span className="text-sm text-text-muted">Checking session...</span>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-alt px-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
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
          <h1 className="text-2xl font-bold text-text">Welcome back</h1>
          <p className="mt-1 text-sm text-text-muted">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
