import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { ToastContainer } from '@/shared/ui/ToastContainer'
import { useTheme } from '@/shared/lib/useTheme'

export default function App() {
  useTheme()

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}
