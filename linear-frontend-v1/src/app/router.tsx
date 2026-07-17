import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { SplashPage } from '@/pages/SplashPage'
import { AuthGuard } from '@/features/auth/ui/AuthGuard'
import { AppLayout } from '@/app/AppLayout'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/splash',
    element: <SplashPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <div className="flex items-center justify-center min-h-[60vh] text-text-muted">
            <p>Dashboard — coming soon</p>
          </div>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])
