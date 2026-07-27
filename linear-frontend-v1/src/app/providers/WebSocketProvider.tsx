import { createContext, useContext, useEffect, useRef, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/entities/session/model/store'
import { useTeamStore } from '@/entities/team/model/store'
import { createWSClient } from '@/features/realtime/lib/ws-client'
import { useWebSocketStore } from '@/shared/stores/websocketStore'

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
  const currentTeamId = useTeamStore((s) => s.currentTeamId)
  const connectionStatus = useWebSocketStore((s) => s.connectionStatus)
  const navigate = useNavigate()

  const handleAuthError = useCallback((errorType: string) => {
    if (errorType === 'auth_failed' || errorType === 'session.revoked') {
      useAuthStore.getState().logout()
      navigate('/login', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return

    const teamId = useTeamStore.getState().currentTeamId ?? undefined
    const client = createWSClient({
      url: WS_URL,
      token: accessToken,
      teamId,
      onError: (errorType) => {
        // Handle auth errors from WebSocket close codes
        handleAuthError(errorType)
      },
    })
    clientRef.current = client
    client.connect()

    const handleBeforeUnload = () => client.disconnect()
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      client.disconnect()
      clientRef.current = null
    }
  }, [isAuthenticated, accessToken, handleAuthError])

  useEffect(() => {
    if (connectionStatus === 'connected' && currentTeamId && clientRef.current) {
      clientRef.current.subscribeToTeam(currentTeamId)
    }
  }, [currentTeamId, connectionStatus])

  const reconnect = () => {
    clientRef.current?.reconnect()
  }

  const disconnect = () => {
    clientRef.current?.disconnect()
  }

  const value: WebSocketContextValue = {
    isConnected: connectionStatus === 'connected',
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
