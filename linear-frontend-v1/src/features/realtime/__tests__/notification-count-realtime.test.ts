import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useNotificationsStore } from '@/shared/stores/notificationsStore'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { processEvent, routeEvent, clearDedupStore, clearEntityDedupStore } from '../model/event-processor'
import { setupEventRouter } from '../model/event-router'

let mockServer: MockWSServer

class MockWSServer {
  private clients = new Set<MockWSEndpoint>()

  addClient(client: MockWSEndpoint) { this.clients.add(client) }
  removeClient(client: MockWSEndpoint) { this.clients.delete(client) }

  broadcast(msg: string, exclude?: MockWSEndpoint) {
    for (const c of this.clients) {
      if (c !== exclude) c.receive(msg)
    }
  }
}

class MockWSEndpoint {
  static OPEN = 1
  static CONNECTING = 0
  static CLOSED = 3
  readyState = 0
  sent: string[] = []
  private listeners: Record<string, ((ev: any) => void) | null> = {
    open: null,
    message: null,
    close: null,
    error: null,
  }

  constructor(url: string) {
    mockServer.addClient(this)
    setTimeout(() => {
      this.readyState = MockWSEndpoint.OPEN
      this.listeners.open?.(new Event('open'))
    }, 0)
  }

  set onopen(fn: ((ev: Event) => void) | null) { this.listeners.open = fn }
  set onmessage(fn: ((ev: MessageEvent) => void) | null) { this.listeners.message = fn }
  set onclose(fn: ((ev: CloseEvent) => void) | null) { this.listeners.close = fn }

  send(data: string) {
    this.sent.push(data)
    mockServer.broadcast(data, this)
  }

  receive(data: string) {
    this.listeners.message?.(new MessageEvent('message', { data }))
  }

  close() {
    this.readyState = MockWSEndpoint.CLOSED
    mockServer.removeClient(this)
    this.listeners.close?.(new CloseEvent('close'))
  }
}

describe('E2E: notification count increments on new notification', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockServer = new MockWSServer()
    vi.stubGlobal('WebSocket', MockWSEndpoint)

    useWebSocketStore.setState({
      connectionStatus: 'disconnected',
      reconnectAttempts: 0,
      autoUpdateEnabled: true,
    })

    useNotificationsStore.setState({ items: [] })

    clearDedupStore()
    clearEntityDedupStore()
    setupEventRouter()

    mockServer.broadcast = (msg: string) => {
      try {
        const data = JSON.parse(msg)
        const processed = processEvent(data)
        if (processed) routeEvent(processed)
      } catch {}
    }
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('single notification appears in store', async () => {
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'notification.created',
      payload: {
        notificationId: 'n-1',
        type: 'mention',
        title: 'You were mentioned',
        message: '@you check this',
        issueId: 'i-1',
      },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-notif-1',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const items = useNotificationsStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('n-1')
    expect(items[0].title).toBe('You were mentioned')
    expect(items[0].read).toBe(false)
  })

  it('unread count increments on each notification', async () => {
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    const before = useNotificationsStore.getState().getUnreadCount()
    expect(before).toBe(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'notification.created',
      payload: { notificationId: 'n-1', type: 'mention', title: 'First', message: '' },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-notif-2a',
    }))
    await vi.advanceTimersByTimeAsync(0)

    expect(useNotificationsStore.getState().getUnreadCount()).toBe(1)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'notification.created',
      payload: { notificationId: 'n-2', type: 'assignment', title: 'Second', message: '' },
      timestamp: '2026-01-01T00:00:02Z',
      eventId: 'e-notif-2b',
    }))
    await vi.advanceTimersByTimeAsync(0)

    expect(useNotificationsStore.getState().getUnreadCount()).toBe(2)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'notification.created',
      payload: { notificationId: 'n-3', type: 'comment', title: 'Third', message: '' },
      timestamp: '2026-01-01T00:00:03Z',
      eventId: 'e-notif-2c',
    }))
    await vi.advanceTimersByTimeAsync(0)

    expect(useNotificationsStore.getState().getUnreadCount()).toBe(3)
  })

  it('notification fields are stored correctly', async () => {
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'notification.created',
      payload: {
        notificationId: 'n-detail',
        type: 'status_change',
        title: 'Status changed',
        message: 'Issue moved to Done',
        issueId: 'i-42',
      },
      timestamp: '2026-01-01T00:00:10Z',
      eventId: 'e-notif-3',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const item = useNotificationsStore.getState().items[0]
    expect(item.id).toBe('n-detail')
    expect(item.type).toBe('status_change')
    expect(item.title).toBe('Status changed')
    expect(item.message).toBe('Issue moved to Done')
    expect(item.issueId).toBe('i-42')
    expect(item.createdAt).toBe('2026-01-01T00:00:10Z')
    expect(item.read).toBe(false)
  })

  it('notifications prepend to list (newest first)', async () => {
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'notification.created',
      payload: { notificationId: 'n-first', type: 'mention', title: 'First', message: '' },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-notif-4a',
    }))
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'notification.created',
      payload: { notificationId: 'n-second', type: 'assignment', title: 'Second', message: '' },
      timestamp: '2026-01-01T00:00:02Z',
      eventId: 'e-notif-4b',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const items = useNotificationsStore.getState().items
    expect(items).toHaveLength(2)
    expect(items[0].id).toBe('n-second')
    expect(items[1].id).toBe('n-first')
  })

  it('notification is ignored when autoUpdateEnabled is false', async () => {
    useWebSocketStore.getState().setAutoUpdateEnabled(false)

    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'notification.created',
      payload: { notificationId: 'n-blocked', type: 'mention', title: 'Blocked', message: '' },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-notif-5',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const items = useNotificationsStore.getState().items
    expect(items).toHaveLength(0)
    expect(useNotificationsStore.getState().getUnreadCount()).toBe(0)
  })
})
