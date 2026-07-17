import { RouterProvider } from 'react-router-dom'
import { useAuthStore } from '@/entities/session/model/store'
import { SplashPage } from '@/pages/SplashPage'
import { router } from '@/app/router'

export default function App() {
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) {
    return <SplashPage />
  }

  return <RouterProvider router={router} />
}
