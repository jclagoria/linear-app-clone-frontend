import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  issueId?: string
}

interface WebSocketState {
  connectionStatus: ConnectionStatus
  reconnectAttempts: number
  notifications: Notification[]
  lastEvent: string | null
  lastHeartbeat: string | null

  setConnecting: () => void
  setConnected: () => void
  setReconnecting: () => void
  setDisconnected: () => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  setLastHeartbeat: (timestamp: string) => void
}

export const initialWebSocketState = {
  connectionStatus: 'disconnected' as ConnectionStatus,
  reconnectAttempts: 0,
  notifications: [] as Notification[],
  lastEvent: null as string | null,
  lastHeartbeat: null as string | null,
}

export const useWebSocketStore = create<WebSocketState>()(
  devtools(
    (set) => ({
      ...initialWebSocketState,

      setConnecting: () =>
        set({ connectionStatus: 'connecting', reconnectAttempts: 0 }),

      setConnected: () =>
        set({ connectionStatus: 'connected', reconnectAttempts: 0 }),

      setReconnecting: () =>
        set((state) => ({
          connectionStatus: 'reconnecting',
          reconnectAttempts: state.reconnectAttempts + 1,
        })),

      setDisconnected: () =>
        set({ connectionStatus: 'disconnected' }),

      addNotification: (notification: Notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          lastEvent: notification.type,
        })),

      markAsRead: (notificationId: string) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n,
          ),
        })),

      setLastHeartbeat: (timestamp: string) =>
        set({ lastHeartbeat: timestamp }),
    }),
    { name: 'websocket-store' },
  ),
)
