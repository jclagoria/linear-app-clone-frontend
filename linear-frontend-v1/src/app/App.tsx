import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { ToastContainer } from '@/shared/ui/ToastContainer'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}
