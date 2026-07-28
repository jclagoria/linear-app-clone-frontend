import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { useIssuesStore } from '@/entities/issue/model/store'
import { createWSClient } from '../lib/ws-client'
import { ReconnectionToast } from '../ui/ReconnectionToast'
import { processEvent, routeEvent, clearDedupStore } from '../model/event-processor'
import { setupEventRouter } from '../model/event-router'

class MockWebSocket {
  static instances: MockWebSocket[] = []

  url: string
  readyState = 0 // CONNECTING
  onopen: ((ev: Event) => void) | null = null
  onclose: ((ev: CloseEvent) => void) | null = null
  onmessage: ((ev: MessageEvent) => void) | null = null
  onerror: ((ev: Event) => void) | null = null
  sent: string[] = []

  static OPEN = 1
  static CONNECTING = 0
  static CLOSED = 3

  constructor(url: string) {
    this.url = url
    MockWebSocket.instances.push(this)
  }

  send(data: string) {
    this.sent.push(data)
  }

  close() {
    this.readyState = MockWebSocket.CLOSED
    this.onclose?.(new CloseEvent('close'))
  }

  simulateOpen() {
    this.readyState = MockWebSocket.OPEN
    this.onopen?.(new Event('open'))
  }

  simulateMessage(data: unknown) {
    this.onmessage?.(new MessageEvent('message', { data: JSON.stringify(data) }))
  }

  simulateDisconnect() {
    this.readyState = MockWebSocket.CLOSED
    this.onclose?.(new CloseEvent('close'))
  }
}

describe('reconnection restores event stream after disconnect', () => {
  beforeEach(() => {
    MockWebSocket.instances = []
    vi.useFakeTimers()
    vi.stubGlobal('WebSocket', MockWebSocket)
    useWebSocketStore.setState({
      connectionStatus: 'disconnected',
      reconnectAttempts: 0,
      autoUpdateEnabled: true,
    })
    useIssuesStore.setState({ issues: [], commentsByIssue: {} })
    clearDedupStore()
    setupEventRouter()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('full lifecycle: connect → disconnect → reconnect → events flow again', () => {
    const client = createWSClient({ url: 'wss://test', token: 'tok' })
    client.connect()

    const ws1 = MockWebSocket.instances[0]
    expect(ws1).toBeDefined()
    expect(useWebSocketStore.getState().connectionStatus).toBe('connecting')

    ws1.simulateOpen()
      ws1.simulateMessage({ type: 'authenticated' })

    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')
    expect(useWebSocketStore.getState().reconnectAttempts).toBe(0)

    ws1.simulateMessage({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i1', title: 'Before disconnect', statusId: 'todo', teamId: 't1' },
      timestamp: '2026-01-01T00:00:00Z',
      eventId: 'e1',
      userId: 'u1',
    })

    expect(useIssuesStore.getState().issues).toHaveLength(1)
    expect(useIssuesStore.getState().issues[0].title).toBe('Before disconnect')

    ws1.simulateDisconnect()

    expect(useWebSocketStore.getState().connectionStatus).toBe('reconnecting')
    expect(useWebSocketStore.getState().reconnectAttempts).toBe(1)

    vi.advanceTimersByTime(1000)

    const ws2 = MockWebSocket.instances[1]
    expect(ws2).toBeDefined()
    expect(useWebSocketStore.getState().connectionStatus).toBe('connecting')

    ws2.simulateOpen()
    ws2.simulateMessage({ type: 'authenticated' })

    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')
    expect(useWebSocketStore.getState().reconnectAttempts).toBe(0)

    ws2.simulateMessage({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i2', title: 'After reconnect', statusId: 'in-progress', teamId: 't1' },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e2',
      userId: 'u1',
    })

    expect(useIssuesStore.getState().issues).toHaveLength(2)
    expect(useIssuesStore.getState().issues[0].title).toBe('After reconnect')
  })

  it('reconnection toast renders during reconnection', () => {
    const onDismiss = vi.fn()

    const { unmount } = render(
      <ReconnectionToast message="Connection lost. Reconnecting..." onDismiss={onDismiss} />,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Connection lost. Reconnecting...')).toBeInTheDocument()

    unmount()
  })

  it('reconnection toast auto-dismisses after timeout', async () => {
    render(
      <ReconnectionToast message="Reconnecting..." autoDismissMs={3000} />,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()

    vi.advanceTimersByTime(3000)

    await vi.waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('reconnection toast dismisses on button click', async () => {
    const onDismiss = vi.fn()

    render(
      <ReconnectionToast message="Reconnecting..." onDismiss={onDismiss} />,
    )

    screen.getByRole('button', { name: 'Dismiss' }).click()

    await vi.waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
    expect(onDismiss).toHaveBeenCalled()
  })

  it('reconnection toast retry button calls onRetry', () => {
    const onRetry = vi.fn()

    render(
      <ReconnectionToast message="Reconnecting..." onRetry={onRetry} />,
    )

    screen.getByText('Retry').click()

    expect(onRetry).toHaveBeenCalled()
  })

  it('events stop processing when autoUpdateEnabled is false during reconnection', () => {
    const client = createWSClient({ url: 'wss://test', token: 'tok' })
    client.connect()

    const ws1 = MockWebSocket.instances[0]
    ws1.simulateOpen()
      ws1.simulateMessage({ type: 'authenticated' })

    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

    ws1.simulateDisconnect()
    vi.advanceTimersByTime(1000)

    const ws2 = MockWebSocket.instances[1]
    ws2.simulateOpen()
    ws2.simulateMessage({ type: 'authenticated' })

    useWebSocketStore.getState().setAutoUpdateEnabled(false)

    ws2.simulateMessage({
      type: 'issue.created',
      payload: { issueId: 'i1', title: 'Should not appear', statusId: 'todo', teamId: 't1' },
      timestamp: '2026-01-01T00:00:00Z',
      eventId: 'e1',
    })

    expect(useIssuesStore.getState().issues).toHaveLength(0)
  })
})
