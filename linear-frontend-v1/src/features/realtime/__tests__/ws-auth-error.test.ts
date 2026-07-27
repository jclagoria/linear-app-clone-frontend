import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createWSClient } from '../lib/ws-client'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { useAuthStore } from '@/entities/session/model/store'
import { setupEventRouter } from '../model/event-router'

class MockWebSocket {
  static instances: MockWebSocket[] = []
  
  url: string
  readyState = 0 // CONNECTING
  onopen: ((ev: Event) => void) | null = null
  onclose: ((ev: CloseEvent) => void) | null = null
  onerror: ((ev: Event) => void) | null = null
  onmessage: ((ev: MessageEvent) => void) | null = null
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

  simulateClose(code: number = 1000) {
    this.readyState = MockWebSocket.CLOSED
    this.onclose?.(new CloseEvent('close', { code }))
  }

  simulateError() {
    this.onerror?.(new Event('error'))
  }

  simulateMessage(data: unknown) {
    this.onmessage?.(new MessageEvent('message', { data: JSON.stringify(data) }))
  }

  simulateDisconnect() {
    this.readyState = MockWebSocket.CLOSED
    this.onclose?.(new CloseEvent('close'))
  }
}

describe('WebSocket auth error handling', () => {
  let mockNavigate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    MockWebSocket.instances = []
    vi.useFakeTimers()
    vi.stubGlobal('WebSocket', MockWebSocket)
    mockNavigate = vi.fn()
    vi.stubGlobal('useNavigate', () => mockNavigate)
    
    useWebSocketStore.setState({
      connectionStatus: 'disconnected',
      reconnectAttempts: 0,
      autoUpdateEnabled: true,
    })
    useAuthStore.setState({
      isAuthenticated: true,
      accessToken: 'valid-token',
      user: { id: 'u1', email: 'test@test.com', name: 'Test User' },
    })
    setupEventRouter()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('auth_failed error triggers logout and redirect', () => {
    const onError = vi.fn()
    const client = createWSClient({ url: 'wss://test', token: 'tok', onError })
    client.connect()

    const ws = MockWebSocket.instances[0]
    expect(ws).toBeDefined()

    ws.simulateOpen()
    ws.simulateMessage({ type: 'connection_ack' })

    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

    // Simulate auth_failed close code (4001)
    ws.simulateClose(4001)

    expect(onError).toHaveBeenCalledWith('auth_failed')
  })

  it('invalid token error triggers logout and redirect', () => {
    const onError = vi.fn()
    const client = createWSClient({ url: 'wss://test', token: 'tok', onError })
    client.connect()

    const ws = MockWebSocket.instances[0]
    expect(ws).toBeDefined()

    ws.simulateOpen()
    ws.simulateMessage({ type: 'connection_ack' })

    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

    // Simulate invalid token close code (4002)
    ws.simulateClose(4002)

    expect(onError).toHaveBeenCalledWith('auth_failed')
  })

  it('token expired error triggers logout and redirect', () => {
    const onError = vi.fn()
    const client = createWSClient({ url: 'wss://test', token: 'tok', onError })
    client.connect()

    const ws = MockWebSocket.instances[0]
    expect(ws).toBeDefined()

    ws.simulateOpen()
    ws.simulateMessage({ type: 'connection_ack' })

    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

    // Simulate token expired close code (4003)
    ws.simulateClose(4003)

    expect(onError).toHaveBeenCalledWith('auth_failed')
  })

  it('session revoked error triggers logout and redirect', () => {
    const onError = vi.fn()
    const client = createWSClient({ url: 'wss://test', token: 'tok', onError })
    client.connect()

    const ws = MockWebSocket.instances[0]
    expect(ws).toBeDefined()

    ws.simulateOpen()
    ws.simulateMessage({ type: 'connection_ack' })

    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

    // Simulate session revoked close code (4004)
    ws.simulateClose(4004)

    expect(onError).toHaveBeenCalledWith('session.revoked')
  })

  it('non-auth close codes do not trigger auth error handler', () => {
    const onError = vi.fn()
    const client = createWSClient({ url: 'wss://test', token: 'tok', onError })
    client.connect()

    const ws = MockWebSocket.instances[0]
    expect(ws).toBeDefined()

    ws.simulateOpen()
    ws.simulateMessage({ type: 'connection_ack' })

    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

    // Simulate normal close code (1000)
    ws.simulateClose(1000)

    expect(onError).not.toHaveBeenCalled()
  })

  it('ws_error triggers auth error handler', () => {
    const onError = vi.fn()
    const client = createWSClient({ url: 'wss://test', token: 'tok', onError })
    client.connect()

    const ws = MockWebSocket.instances[0]
    expect(ws).toBeDefined()

    ws.simulateOpen()
    ws.simulateMessage({ type: 'connection_ack' })

    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

    // Simulate WebSocket error
    ws.simulateError()

    expect(onError).toHaveBeenCalledWith('ws_error')
  })
})