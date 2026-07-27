import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { ToastContainer } from '@/shared/ui/ToastContainer'
import { useTheme } from '@/shared/lib/useTheme'
import { WebSocketProvider } from '@/app/providers/WebSocketProvider'
import { OptimisticProvider } from '@/app/providers/OptimisticProvider'

export default function App() {
  useTheme()

  return (
    <WebSocketProvider>
      <OptimisticProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </OptimisticProvider>
    </WebSocketProvider>
  )
}
