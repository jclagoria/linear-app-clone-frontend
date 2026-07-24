import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { useAuthStore } from '@/entities/session/model/store'
import { createWSClient } from '@/features/realtime/lib/ws-client'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3001/ws'

interface WebSocketContextValue {
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
  reconnect: () => void
  disconnect: () => void
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null)

export function useWebSocket(): WebSocketContextValue {
  const ctx = useContext(WebSocketContext)
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider')
  return ctx
}

interface WebSocketProviderProps {
  children: ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const clientRef = useRef<ReturnType<typeof createWSClient> | null>(null)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const accessToken = useAuthStore((s) => s.accessToken)
  const connectionStatus = useAuthStore((s) => s.isAuthenticated ? 'disconnected' as const : 'disconnected' as const)

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return

    const client = createWSClient({
      url: WS_URL,
      token: accessToken,
    })
    clientRef.current = client
    client.connect()

    return () => {
      client.disconnect()
      clientRef.current = null
    }
  }, [isAuthenticated, accessToken])

  const reconnect = () => {
    clientRef.current?.reconnect()
  }

  const disconnect = () => {
    clientRef.current?.disconnect()
  }

  const value: WebSocketContextValue = {
    isConnected: false,
    connectionStatus,
    reconnect,
    disconnect,
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}
