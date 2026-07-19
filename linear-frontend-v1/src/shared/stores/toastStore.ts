import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ToastVariant = 'info' | 'error' | 'success'

export interface Toast {
  id: string
  title: string
  message?: string
  variant: ToastVariant
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clear: () => void
}

let toastCounter = 0

export const useToastStore = create<ToastState>()(
  devtools(
    (set) => ({
      toasts: [],

      addToast: (toast) => {
        const id = `toast_${++toastCounter}`
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }))
        return id
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      },

      clear: () => {
        set({ toasts: [] })
      },
    }),
    { name: 'toast-store' },
  ),
)
