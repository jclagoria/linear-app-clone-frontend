import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Spinner } from '@/shared/ui/Spinner'

export function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-text-muted">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    const redirectParam = location.pathname !== '/login'
      ? `?redirect=${encodeURIComponent(location.pathname + location.search)}`
      : ''
    return <Navigate to={`/login${redirectParam}`} replace />
  }

  return <Outlet />
}
