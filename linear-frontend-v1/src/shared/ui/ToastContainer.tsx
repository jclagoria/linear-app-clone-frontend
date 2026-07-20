import { useToastStore } from '@/shared/stores/toastStore'
import { Toast } from './Toast'

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <aside
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-end gap-2 p-4 sm:right-4 sm:left-auto sm:top-4 sm:p-0"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </aside>
  )
}
