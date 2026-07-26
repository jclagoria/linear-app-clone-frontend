import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useIssuesStore, type Issue, type Comment } from '@/entities/issue/model/store'
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

function makeIssue(overrides: Partial<Issue> = {}): Issue {
  return {
    id: 'i-comment',
    title: 'Comment Issue',
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

function makeComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: 'c-existing',
    issueId: 'i-comment',
    body: 'Existing comment',
    authorId: 'u1',
    authorName: 'Author 1',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('E2E: add comment → thread appends without page load', () => {
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
      commentsByIssue: {
        'i-comment': [makeIssue().id ? makeComment() : makeComment()],
      },
    })

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

  it('new comment appears in the issue thread', async () => {
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    const before = useIssuesStore.getState().commentsByIssue['i-comment']
    expect(before).toHaveLength(1)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'comment.created',
      payload: {
        issueId: 'i-comment',
        commentId: 'c-new-1',
        body: 'Hello from WebSocket',
        authorId: 'u2',
        authorName: 'Author 2',
      },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-comment-1',
    }))

    await vi.advanceTimersByTimeAsync(0)

    const after = useIssuesStore.getState().commentsByIssue['i-comment']
    expect(after).toHaveLength(2)
    expect(after[1].body).toBe('Hello from WebSocket')
    expect(after[1].authorName).toBe('Author 2')
  })

  it('comment body and author are stored correctly', async () => {
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'comment.created',
      payload: {
        issueId: 'i-comment',
        commentId: 'c-detail',
        body: 'Detailed comment body',
        authorId: 'u3',
        authorName: 'Author 3',
      },
      timestamp: '2026-01-01T00:00:05Z',
      eventId: 'e-comment-2',
    }))

    await vi.advanceTimersByTimeAsync(0)

    const comments = useIssuesStore.getState().commentsByIssue['i-comment']
    const added = comments.find((c) => c.id === 'c-detail')
    expect(added).toBeDefined()
    expect(added!.body).toBe('Detailed comment body')
    expect(added!.authorId).toBe('u3')
    expect(added!.authorName).toBe('Author 3')
    expect(added!.createdAt).toBe('2026-01-01T00:00:05Z')
  })

  it('multiple comments append in order', async () => {
    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'comment.created',
      payload: {
        issueId: 'i-comment',
        commentId: 'c-order-1',
        body: 'First new comment',
        authorId: 'u2',
        authorName: 'Author 2',
      },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-comment-3a',
    }))
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'comment.created',
      payload: {
        issueId: 'i-comment',
        commentId: 'c-order-2',
        body: 'Second new comment',
        authorId: 'u3',
        authorName: 'Author 3',
      },
      timestamp: '2026-01-01T00:00:02Z',
      eventId: 'e-comment-3b',
    }))
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'comment.created',
      payload: {
        issueId: 'i-comment',
        commentId: 'c-order-3',
        body: 'Third new comment',
        authorId: 'u4',
        authorName: 'Author 4',
      },
      timestamp: '2026-01-01T00:00:03Z',
      eventId: 'e-comment-3c',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const comments = useIssuesStore.getState().commentsByIssue['i-comment']
    expect(comments).toHaveLength(4)
    expect(comments[0].id).toBe('c-existing')
    expect(comments[1].id).toBe('c-order-1')
    expect(comments[2].id).toBe('c-order-2')
    expect(comments[3].id).toBe('c-order-3')
  })

  it('comment on one issue does not affect other issues', async () => {
    useIssuesStore.setState({
      issues: [makeIssue(), makeIssue({ id: 'i-other', title: 'Other' })],
      commentsByIssue: {
        'i-comment': [makeComment()],
        'i-other': [makeComment({ id: 'c-other', issueId: 'i-other', body: 'Other issue comment' })],
      },
    })

    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'comment.created',
      payload: {
        issueId: 'i-comment',
        commentId: 'c-target',
        body: 'Targeted comment',
        authorId: 'u2',
        authorName: 'Author 2',
      },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-comment-4',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const target = useIssuesStore.getState().commentsByIssue['i-comment']
    const other = useIssuesStore.getState().commentsByIssue['i-other']
    expect(target).toHaveLength(2)
    expect(other).toHaveLength(1)
    expect(other[0].body).toBe('Other issue comment')
  })

  it('comment is ignored when autoUpdateEnabled is false', async () => {
    useWebSocketStore.getState().setAutoUpdateEnabled(false)

    const ws = new MockWSEndpoint('wss://test')
    await vi.advanceTimersByTimeAsync(0)

    clearEntityDedupStore()
    ws.send(JSON.stringify({
      type: 'comment.created',
      payload: {
        issueId: 'i-comment',
        commentId: 'c-blocked',
        body: 'Should not appear',
        authorId: 'u2',
        authorName: 'Author 2',
      },
      timestamp: '2026-01-01T00:00:01Z',
      eventId: 'e-comment-5',
    }))
    await vi.advanceTimersByTimeAsync(0)

    const comments = useIssuesStore.getState().commentsByIssue['i-comment']
    expect(comments).toHaveLength(1)
    expect(comments[0].id).toBe('c-existing')
  })
})
