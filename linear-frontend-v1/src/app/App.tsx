import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { ToastContainer } from '@/shared/ui/ToastContainer'
import { useTheme } from '@/shared/lib/useTheme'
import { WebSocketProvider } from '@/app/providers/WebSocketProvider'
import { OptimisticProvider } from '@/app/providers/OptimisticProvider'
import { KeyboardProvider } from '@/app/providers/KeyboardProvider'
import { ToastContainer as KeyboardToastContainer } from '@/features/keyboard/ui/ToastContainer'

export default function App() {
  useTheme()

  return (
    <WebSocketProvider>
      <OptimisticProvider>
        <KeyboardProvider>
          <KeyboardToastContainer>
            <RouterProvider router={router} />
          </KeyboardToastContainer>
          <ToastContainer />
        </KeyboardProvider>
      </OptimisticProvider>
    </WebSocketProvider>
  )
}
