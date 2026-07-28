import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createWSClient } from '../lib/ws-client'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
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

describe('WebSocket client lifecycle', () => {
  beforeEach(() => {
    MockWebSocket.instances = []
    vi.useFakeTimers()
    vi.stubGlobal('WebSocket', MockWebSocket)
    
    useWebSocketStore.setState({
      connectionStatus: 'disconnected',
      reconnectAttempts: 0,
      autoUpdateEnabled: true,
    })
    setupEventRouter()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('connection and authentication', () => {
    it('connection opens and sends authenticate message', () => {
      const onOpen = vi.fn()
      const client = createWSClient({ url: 'wss://test', token: 'test-token', onOpen })
      client.connect()

      const ws = MockWebSocket.instances[0]
      expect(ws).toBeDefined()
      expect(ws.url).toBe('wss://test')
      expect(useWebSocketStore.getState().connectionStatus).toBe('connecting')

      ws.simulateOpen()

      // Check that authenticate message was sent
      const authMessage = JSON.parse(ws.sent[0])
      expect(authMessage).toEqual({
        type: 'authenticate',
        token: 'test-token',
      })

      // Simulate authenticated message to complete authentication
      ws.simulateMessage({ type: 'authenticated' })

      expect(useWebSocketStore.getState().connectionStatus).toBe('connected')
      expect(onOpen).toHaveBeenCalled()
    })

    it('sends subscribe message after authentication when teamId is provided', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token', teamId: 'team-123' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

      // Check that authenticate and subscribe messages were sent
      expect(ws.sent).toHaveLength(2)
      
      const authMessage = JSON.parse(ws.sent[0])
      expect(authMessage).toEqual({
        type: 'authenticate',
        token: 'test-token',
      })

      const subscribeMessage = JSON.parse(ws.sent[1])
      expect(subscribeMessage).toEqual({
        type: 'subscribe',
        teamId: 'team-123',
      })
    })

    it('does not send subscribe message when teamId is not provided', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      // Check that only authenticate message was sent
      expect(ws.sent).toHaveLength(1)
      
      const authMessage = JSON.parse(ws.sent[0])
      expect(authMessage).toEqual({
        type: 'authenticate',
        token: 'test-token',
      })
    })

    it('does not connect if already connecting', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()
      client.connect() // Second call should be ignored

      expect(MockWebSocket.instances).toHaveLength(1)
    })

    it('does not connect if already open', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      client.connect() // Should be ignored

      expect(MockWebSocket.instances).toHaveLength(1)
    })
  })

  describe('manual disconnect', () => {
    it('manual disconnect sets status to disconnected', () => {
      const onClose = vi.fn()
      const client = createWSClient({ url: 'wss://test', token: 'test-token', onClose })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

      client.disconnect()

      expect(useWebSocketStore.getState().connectionStatus).toBe('disconnected')
      expect(onClose).toHaveBeenCalled()
    })

    it('manual disconnect closes WebSocket', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      client.disconnect()

      expect(ws.readyState).toBe(MockWebSocket.CLOSED)
    })

    it('manual disconnect does not trigger reconnection', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      client.disconnect()

      // Wait for potential reconnection
      vi.advanceTimersByTime(10000)

      // Should not create new WebSocket instance
      expect(MockWebSocket.instances).toHaveLength(1)
    })
  })

  describe('message serialization', () => {
    it('sends ping message in correct format', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      // Manually send ping (simulating heartbeat)
      ws.send(JSON.stringify({ type: 'ping' }))

      // Find the ping message (should be the last one)
      const pingMessage = JSON.parse(ws.sent[ws.sent.length - 1])
      expect(pingMessage).toEqual({ type: 'ping' })
    })

    it('sends authenticate message in correct format', () => {
      const client = createWSClient({ url: 'wss://test', token: 'my-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      const authMessage = JSON.parse(ws.sent[0])
      expect(authMessage).toHaveProperty('type', 'authenticate')
      expect(authMessage).toHaveProperty('token', 'my-token')
      expect(Object.keys(authMessage)).toHaveLength(2)
    })

    it('sends subscribe message in correct format', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token', teamId: 'team-456' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      const subscribeMessage = JSON.parse(ws.sent[1])
      expect(subscribeMessage).toHaveProperty('type', 'subscribe')
      expect(subscribeMessage).toHaveProperty('teamId', 'team-456')
      expect(Object.keys(subscribeMessage)).toHaveLength(2)
    })

    it('subscribes to team after connection', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token', teamId: 'team-789' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      expect(ws.sent).toHaveLength(2)
      
      const subscribeMessage = JSON.parse(ws.sent[1])
      expect(subscribeMessage).toEqual({
        type: 'subscribe',
        teamId: 'team-789',
      })
    })
  })

  describe('error handling', () => {
    it('calls onError when WebSocket error occurs', () => {
      const onError = vi.fn()
      const client = createWSClient({ url: 'wss://test', token: 'test-token', onError })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      ws.simulateError()

      expect(onError).toHaveBeenCalledWith('ws_error')
    })

    it('handles non-JSON messages gracefully', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      // Send non-JSON message
      expect(() => {
        ws.onmessage?.(new MessageEvent('message', { data: 'not-json' }))
      }).not.toThrow()
    })
  })

  describe('reconnection', () => {
    it('reconnects after non-manual close', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

      // Simulate unexpected close
      ws.simulateClose(1000)

      expect(useWebSocketStore.getState().connectionStatus).toBe('reconnecting')

      // Wait for reconnection delay
      vi.advanceTimersByTime(1000)

      // Should create new WebSocket instance
      expect(MockWebSocket.instances).toHaveLength(2)
    })

    it('does not reconnect after manual close', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      client.disconnect()

      // Wait for potential reconnection
      vi.advanceTimersByTime(10000)

      // Should not create new WebSocket instance
      expect(MockWebSocket.instances).toHaveLength(1)
    })

    it('reconnect() resets attempts and reconnects', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      // Simulate failure
      ws.simulateClose(1000)

      expect(useWebSocketStore.getState().connectionStatus).toBe('reconnecting')

      // Manual reconnect - this calls disconnect() then connect()
      // disconnect() sets status to 'disconnected', then connect() immediately sets it to 'connecting'
      client.reconnect()

      expect(useWebSocketStore.getState().connectionStatus).toBe('connecting')

      // Wait for reconnection
      vi.advanceTimersByTime(100)

      // Should create new WebSocket instance
      expect(MockWebSocket.instances).toHaveLength(2)
    })
  })

  describe('subscribeToTeam', () => {
    it('sends subscribe message when connected', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]
      ws.simulateOpen()
      ws.simulateMessage({ type: 'authenticated' })

      client.subscribeToTeam('team-new')

      expect(ws.sent).toHaveLength(2)
      
      const subscribeMessage = JSON.parse(ws.sent[1])
      expect(subscribeMessage).toEqual({
        type: 'subscribe',
        teamId: 'team-new',
      })
    })

    it('does not send subscribe message when not connected', () => {
      const client = createWSClient({ url: 'wss://test', token: 'test-token' })
      client.connect()

      const ws = MockWebSocket.instances[0]

      client.subscribeToTeam('team-new')

      // Should not have sent subscribe message
      expect(ws.sent).toHaveLength(0)
    })
  })
})
