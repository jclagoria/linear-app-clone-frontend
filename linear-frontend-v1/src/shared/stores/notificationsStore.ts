import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  issueId?: string
}

interface NotificationsState {
  items: NotificationItem[]

  addNotification: (notification: NotificationItem) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clearAll: () => void
  getUnreadCount: () => number
}

export const initialNotificationsState = {
  items: [] as NotificationItem[],
}

export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    (set, get) => ({
      ...initialNotificationsState,

      addNotification: (notification) =>
        set((state) => ({
          items: [notification, ...state.items],
        })),

      markRead: (id) =>
        set((state) => ({
          items: state.items.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          items: state.items.map((n) => ({ ...n, read: true })),
        })),

      clearAll: () => set({ items: [] }),

      getUnreadCount: () => get().items.filter((n) => !n.read).length,
    }),
    { name: 'notifications-store' },
  ),
)
