import { processEvent, routeEvent } from '../model/event-processor'
import { calculateBackoff, shouldReconnect } from '../model/reconnection'
import { createHeartbeat } from '../model/heartbeat'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { setupEventRouter } from '../model/event-router'

export interface WSClientConfig {
  url: string
  token: string
  teamId?: string
  onOpen?: () => void
  onClose?: () => void
  onError?: (errorType: string) => void
}

export function createWSClient(config: WSClientConfig) {
  let ws: WebSocket | null = null
  let reconnectAttempts = 0
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let isManualClose = false

  const store = useWebSocketStore.getState()

  const heartbeat = createHeartbeat(
    () => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
      }
    },
    () => {
      ws?.close()
    },
  )

  const connect = () => {
    if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) return

    isManualClose = false
    store.setConnecting()

    ws = new WebSocket(config.url)

    const connectTimeout = setTimeout(() => {
      if (ws?.readyState === WebSocket.CONNECTING) {
        ws.close()
        store.setDisconnected()
        config.onClose?.()
      }
    }, 5000)

    ws.onopen = () => {
      clearTimeout(connectTimeout)
      reconnectAttempts = 0
      store.setConnecting()
      setupEventRouter()
      config.onOpen?.()

      const ackTimeout = setTimeout(() => {
        if (store.connectionStatus === 'connecting') {
          ws?.close()
          store.setDisconnected()
          config.onClose?.()
        }
      }, 5000)

      const defaultHandler = ws.onmessage
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'connection_ack') {
            clearTimeout(ackTimeout)
            store.setConnected()
            heartbeat.start()
            ws?.send(JSON.stringify({ type: 'authenticate', token: config.token }))
            if (config.teamId) {
              ws?.send(JSON.stringify({ type: 'subscribe', teamId: config.teamId }))
            }
            ws.onmessage = defaultHandler
            return
          }
        } catch {}
        defaultHandler?.call(ws, event)
      }
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const processed = processEvent(data)
        if (processed) {
          routeEvent(processed)
        }
      } catch {
        // Ignore non-JSON messages (ping/pong frames)
      }
    }

    ws.onclose = (event) => {
      clearTimeout(connectTimeout)
      heartbeat.stop()
      
      // Detect auth-related close codes and trigger auth error handler
      // 4001: Authentication failed
      // 4002: Invalid token
      // 4003: Token expired
      // 4004: Session revoked
      const authCloseCodes = [4001, 4002, 4003, 4004]
      if (authCloseCodes.includes(event.code)) {
        const errorType = event.code === 4004 ? 'session.revoked' : 'auth_failed'
        config.onError?.(errorType)
      }
      
      if (isManualClose) {
        store.setDisconnected()
        config.onClose?.()
        return
      }

      if (shouldReconnect(reconnectAttempts)) {
        store.setReconnecting()
        const delay = calculateBackoff(reconnectAttempts)
        reconnectAttempts++
        reconnectTimer = setTimeout(connect, delay)
      } else {
        store.setDisconnected()
        config.onClose?.()
      }
    }

    ws.onerror = (error) => {
      config.onError?.('ws_error')
    }
  }

  const disconnect = () => {
    isManualClose = true
    heartbeat.stop()
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    ws?.close()
    ws = null
    store.setDisconnected()
  }

  const reconnect = () => {
    disconnect()
    isManualClose = false
    reconnectAttempts = 0
    connect()
  }

  const subscribeToTeam = (teamId: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'subscribe', teamId }))
    }
  }

  return { connect, disconnect, reconnect, subscribeToTeam }
}
