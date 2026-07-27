import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useIssuesStore, type Issue } from '@/entities/issue/model/store'
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

  set onopen(fn: ((ev: Event) => void) | null) {
    this.listeners.open = fn
  }
  set onmessage(fn: ((ev: MessageEvent) => void) | null) {
    this.listeners.message = fn
  }
  set onclose(fn: ((ev: CloseEvent) => void) | null) {
    this.listeners.close = fn
  }

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

function makeIssue(overrides: Partial<Issue> = {}): Issue {
  return {
    id: 'i-status',
    title: 'Status Issue',
    description: '',
    statusId: 'todo',
    priority: 3,
    assigneeId: null,
    projectId: null,
    cycleId: null,
    labels: [],
    identifier: 'T-1',
    teamId: 't1',
    parentId: null,
    sortOrder: 0,
    sequence: 1,
    completedAt: null,
    canceledAt: null,
    deletedAt: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('E2E: change issue status → badge updates in real-time', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockServer = new MockWSServer()
    vi.stubGlobal('WebSocket', MockWSEndpoint)

    useWebSocketStore.setState({
      connectionStatus: 'disconnected',
      reconnectAttempts: 0,
      autoUpdateEnabled: true,
    })

    useIssuesStore.setState({
      issues: [makeIssue()],
      commentsByIssue: {},
    })

    clearDedupStore()
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

  it('statusId updates when issue.statusChanged event arrives', async () => {
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    expect(useIssuesStore.getState().issues[0].statusId).toBe('todo')

    ws.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.statusChanged',
      data: { issueId: 'i-status', statusId: 'in-progress' },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-status-1',
      userId: 'u1',
    }))

    await vi.advanceTimersByTimeAsync(0)

    const issue = useIssuesStore.getState().issues.find((i) => i.id === 'i-status')
    expect(issue).toBeDefined()
    expect(issue!.statusId).toBe('in-progress')
  })

  it('badge reflects the new status after status change', async () => {
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.statusChanged',
      data: { issueId: 'i-status', statusId: 'done' },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-status-2',
      userId: 'u1',
    }))

    await vi.advanceTimersByTimeAsync(0)

    const issue = useIssuesStore.getState().issues.find((i) => i.id === 'i-status')
    expect(issue!.statusId).toBe('done')
  })

  it('multiple status changes are reflected sequentially', async () => {
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.statusChanged',
      data: { issueId: 'i-status', statusId: 'in-progress' },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-status-3a',
      userId: 'u1',
    }))
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.statusChanged',
      data: { issueId: 'i-status', statusId: 'done' },
      timestamp: '2026-01-01T00:00:02Z',
      eventId: 'e-status-3b',
      userId: 'u1',
    }))
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.statusChanged',
      data: { issueId: 'i-status', statusId: 'todo' },
      timestamp: '2026-01-01T00:00:03Z',
      eventId: 'e-status-3c',
      userId: 'u1',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const issue = useIssuesStore.getState().issues.find((i) => i.id === 'i-status')
    expect(issue!.statusId).toBe('todo')
  })

  it('status change on one issue does not affect other issues', async () => {
    useIssuesStore.setState({
      issues: [
        makeIssue({ id: 'i-other', title: 'Other', statusId: 'in-progress' }),
        makeIssue(),
      ],
      commentsByIssue: {},
    })

    clearEntityDedupStore()
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    ws.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.statusChanged',
      data: { issueId: 'i-status', statusId: 'done' },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-status-4',
      userId: 'u1',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const target = useIssuesStore.getState().issues.find((i) => i.id === 'i-status')
    const other = useIssuesStore.getState().issues.find((i) => i.id === 'i-other')
    expect(target!.statusId).toBe('done')
    expect(other!.statusId).toBe('in-progress')
  })

  it('status change is ignored when autoUpdateEnabled is false', async () => {
    useWebSocketStore.getState().setAutoUpdateEnabled(false)

    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    ws.send(JSON.stringify({
      type: 'event',
      channel: 'team:t1',
      event: 'issue.statusChanged',
      data: { issueId: 'i-status', statusId: 'done' },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-status-5',
      userId: 'u1',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const issue = useIssuesStore.getState().issues.find((i) => i.id === 'i-status')
    expect(issue!.statusId).toBe('todo')
  })
})
