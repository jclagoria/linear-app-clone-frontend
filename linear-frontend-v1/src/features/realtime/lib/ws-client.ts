import { processEvent, routeEvent } from '../model/event-processor'
import { calculateBackoff, shouldReconnect } from '../model/reconnection'
import { createHeartbeat } from '../model/heartbeat'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { setupEventRouter } from '../model/event-router'

export interface WSClientConfig {
  url: string
  token: string
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
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

    ws.onopen = () => {
      reconnectAttempts = 0
      store.setConnected()
      heartbeat.start()

      ws?.send(JSON.stringify({ type: 'auth', token: config.token }))

      setupEventRouter()

      config.onOpen?.()
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const processed = processEvent(data)
        if (processed) {
          routeEvent(processed)
          useWebSocketStore.getState().addNotification({
            id: processed.eventId,
            type: processed.type,
            title: processed.type,
            message: JSON.stringify(processed.payload),
            read: false,
            createdAt: processed.timestamp,
          })
        }
      } catch {
        // Ignore non-JSON messages (ping/pong frames)
      }
    }

    ws.onclose = () => {
      heartbeat.stop()
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
      config.onError?.(error)
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

  return { connect, disconnect, reconnect }
}
