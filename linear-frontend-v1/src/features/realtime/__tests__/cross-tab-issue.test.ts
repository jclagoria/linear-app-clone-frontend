import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { processEvent, routeEvent, clearDedupStore } from '../model/event-processor'
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
  static OPEN = 1; static CONNECTING = 0; static CLOSED = 3
  readyState = 0
  sent: string[] = []
  private listeners: Record<string, ((ev: any) => void) | null> = { open: null, message: null, close: null, error: null }

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

  send(data: string) { this.sent.push(data); mockServer.broadcast(data, this) }
  receive(data: string) { this.listeners.message?.(new MessageEvent('message', { data })) }
  close() { this.readyState = MockWSEndpoint.CLOSED; mockServer.removeClient(this); this.listeners.close?.(new CloseEvent('close')) }
}

describe('E2E: create issue in second tab → appears in first tab', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockServer = new MockWSServer()
    vi.stubGlobal('WebSocket', MockWSEndpoint)
    useWebSocketStore.setState({ connectionStatus: 'disconnected', reconnectAttempts: 0, autoUpdateEnabled: true })
    useIssuesStore.setState({ issues: [], commentsByIssue: {} })
    clearDedupStore()
    setupEventRouter()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('issue created by Tab 2 appears in Tab 1 store', async () => {
    const ws1 = new MockWSEndpoint('wss://test')
    const ws2 = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    expect(ws1.readyState).toBe(MockWSEndpoint.OPEN)
    expect(ws2.readyState).toBe(MockWSEndpoint.OPEN)

    mockServer.broadcast = (msg: string, exclude?: MockWSEndpoint) => {
      try {
        const data = JSON.parse(msg)
        const processed = processEvent(data)
        if (processed) routeEvent(processed)
      } catch {}
    }

    ws2.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i-tab2', title: 'From Tab 2', statusId: 'in-progress', teamId: 't1' },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e2',
      userId: 'u1',
    }))

    await vi.advanceTimersByTimeAsync(0)

    const issues = useIssuesStore.getState().issues
    expect(issues).toHaveLength(1)
    expect(issues[0].title).toBe('From Tab 2')
  })

  it('issue from Tab 2 is visible in Tab 1 issue list', async () => {
    const ws1 = new MockWSEndpoint('wss://test')
    const ws2 = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    mockServer.broadcast = (msg: string) => {
      try {
        const data = JSON.parse(msg)
        const processed = processEvent(data)
        if (processed) routeEvent(processed)
      } catch {}
    }

    ws2.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i-cross', title: 'Cross-Tab Issue', statusId: 'todo', teamId: 't1' },
      timestamp: '2026-01-01T00:00:00Z',
      eventId: 'e-cross-1',
      userId: 'u1',
    }))

    await vi.advanceTimersByTimeAsync(0)

    const issues = useIssuesStore.getState().issues
    expect(issues).toHaveLength(1)
    expect(issues[0].title).toBe('Cross-Tab Issue')
  })

  it('multiple issues from different tabs appear in correct order', async () => {
    const ws1 = new MockWSEndpoint('wss://test')
    const ws2 = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    mockServer.broadcast = (msg: string) => {
      try {
        const data = JSON.parse(msg)
        const processed = processEvent(data)
        if (processed) routeEvent(processed)
      } catch {}
    }

    ws1.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i1', title: 'Tab 1 Issue', statusId: 'todo', teamId: 't1' },
      timestamp: '2026-01-01T00:00:00Z', eventId: 'e1',
      userId: 'u1',
    }))
    await vi.advanceTimersByTimeAsync(0)

    ws2.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i2', title: 'Tab 2 Issue', statusId: 'todo', teamId: 't1' },
      timestamp: '2026-01-01T00:00:01Z', eventId: 'e2',
      userId: 'u1',
    }))
    await vi.advanceTimersByTimeAsync(0)

    ws1.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i3', title: 'Tab 1 Another', statusId: 'todo', teamId: 't1' },
      timestamp: '2026-01-01T00:00:02Z', eventId: 'e3',
      userId: 'u1',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const issues = useIssuesStore.getState().issues
    expect(issues).toHaveLength(3)
    expect(issues[0].title).toBe('Tab 1 Another')
    expect(issues[1].title).toBe('Tab 2 Issue')
    expect(issues[2].title).toBe('Tab 1 Issue')
  })

  it('Tab 1 does not see events when autoUpdateEnabled is false', async () => {
    const ws1 = new MockWSEndpoint('wss://test')
    const ws2 = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    mockServer.broadcast = (msg: string) => {
      try {
        const data = JSON.parse(msg)
        const processed = processEvent(data)
        if (processed) routeEvent(processed)
      } catch {}
    }

    useWebSocketStore.getState().setAutoUpdateEnabled(false)

    ws2.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i-hidden', title: 'Hidden Issue', statusId: 'todo', teamId: 't1' },
      timestamp: '2026-01-01T00:00:00Z', eventId: 'e-hidden',
    }))

    await vi.advanceTimersByTimeAsync(0)

    expect(useIssuesStore.getState().issues).toHaveLength(0)
  })
})
