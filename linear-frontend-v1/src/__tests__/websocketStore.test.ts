import { describe, it, expect, beforeEach } from 'vitest'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import type { Notification } from '@/shared/stores/websocketStore'

describe('websocketStore', () => {
  beforeEach(() => {
    useWebSocketStore.setState({
      connectionStatus: 'disconnected',
      reconnectAttempts: 0,
      notifications: [],
      lastEvent: null,
    })
  })

  it('starts disconnected', () => {
    expect(useWebSocketStore.getState().connectionStatus).toBe('disconnected')
  })

  it('transitions through connection statuses', () => {
    useWebSocketStore.getState().setConnecting()
    expect(useWebSocketStore.getState().connectionStatus).toBe('connecting')

    useWebSocketStore.getState().setConnected()
    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

    useWebSocketStore.getState().setReconnecting()
    expect(useWebSocketStore.getState().connectionStatus).toBe('reconnecting')
    expect(useWebSocketStore.getState().reconnectAttempts).toBe(1)

    useWebSocketStore.getState().setDisconnected()
    expect(useWebSocketStore.getState().connectionStatus).toBe('disconnected')
  })

  it('increments reconnect attempts on reconnection', () => {
    useWebSocketStore.getState().setReconnecting()
    useWebSocketStore.getState().setReconnecting()
    useWebSocketStore.getState().setReconnecting()
    expect(useWebSocketStore.getState().reconnectAttempts).toBe(3)
  })

  it('resets reconnect count on successful connection', () => {
    useWebSocketStore.getState().setReconnecting()
    useWebSocketStore.getState().setReconnecting()
    expect(useWebSocketStore.getState().reconnectAttempts).toBe(2)

    useWebSocketStore.getState().setConnected()
    expect(useWebSocketStore.getState().reconnectAttempts).toBe(0)
  })

  describe('notifications', () => {
    const notification: Notification = {
      id: 'n1',
      type: 'issue_assigned',
      title: 'New assignment',
      message: 'You were assigned to Issue 1',
      read: false,
      createdAt: '2024-01-01T00:00:00Z',
    }

    it('adds a notification', () => {
      useWebSocketStore.getState().addNotification(notification)
      expect(useWebSocketStore.getState().notifications).toHaveLength(1)
      expect(useWebSocketStore.getState().lastEvent).toBe('issue_assigned')
    })

    it('marks notification as read', () => {
      useWebSocketStore.getState().addNotification(notification)
      useWebSocketStore.getState().markAsRead('n1')
      expect(useWebSocketStore.getState().notifications[0].read).toBe(true)
    })
  })
})
