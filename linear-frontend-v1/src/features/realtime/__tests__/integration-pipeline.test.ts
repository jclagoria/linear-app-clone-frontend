import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { processEvent, routeEvent, clearDedupStore, clearEntityDedupStore } from '../model/event-processor'
import { setupEventRouter } from '../model/event-router'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useProjectsStore } from '../lib/project-store'
import { useNotificationsStore } from '@/shared/stores/notificationsStore'
import { useWebSocketStore } from '@/shared/stores/websocketStore'

describe('integration: SSE event triggers store mutation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearDedupStore()
    clearEntityDedupStore()
    setupEventRouter()

    useIssuesStore.setState({ issues: [], commentsByIssue: {} })
    useProjectsStore.setState({ projects: [] })
    useNotificationsStore.setState({ items: [] })
    useWebSocketStore.setState({ autoUpdateEnabled: true, connectionStatus: 'connected' })
  })

  afterEach(() => {
    vi.useRealTimers()
    clearDedupStore()
    clearEntityDedupStore()
  })

  it('issue.created adds issue to store', () => {
    const data = {
      eventId: `e-${Date.now()}-1`,
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: {
        id: 'i1',
        title: 'New Issue',
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
      },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    }

    const event = processEvent(data)
    expect(event).not.toBeNull()

    routeEvent(event!)

    const issues = useIssuesStore.getState().issues
    expect(issues).toHaveLength(1)
    expect(issues[0].id).toBe('i1')
    expect(issues[0].title).toBe('New Issue')
  })

  it('project.created adds project to store', () => {
    const data = {
      eventId: `e-${Date.now()}-2`,
      type: 'event',
      channel: 'team:t1',
      event: 'project.created',
      data: {
        projectId: 'p1',
        id: 'p1',
        name: 'New Project',
        description: '',
        icon: 'folder',
        status: 'planned',
        teamId: 't1',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    }

    const event = processEvent(data)
    expect(event).not.toBeNull()

    routeEvent(event!)

    const projects = useProjectsStore.getState().projects
    expect(projects).toHaveLength(1)
    expect(projects[0].id).toBe('p1')
  })

  it('notification.created adds notification to store', () => {
    const data = {
      eventId: `e-${Date.now()}-3`,
      type: 'event',
      channel: 'team:t1',
      event: 'notification.created',
      data: {
        notificationId: 'n1',
        type: 'issue_assigned',
        title: 'Assigned',
        message: 'You were assigned',
      },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    }

    const event = processEvent(data)
    expect(event).not.toBeNull()

    routeEvent(event!)

    const items = useNotificationsStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('n1')
    expect(items[0].title).toBe('Assigned')
  })

  it('events are ignored when autoUpdateEnabled is false', () => {
    useWebSocketStore.setState({ autoUpdateEnabled: false })

    const data = {
      eventId: `e-${Date.now()}-4`,
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i2', title: 'Ignored Issue' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    }

    const event = processEvent(data)
    expect(event).not.toBeNull()

    routeEvent(event!)

    const issues = useIssuesStore.getState().issues
    expect(issues).toHaveLength(0)
  })

  it('deduplication prevents duplicate store mutations', () => {
    const data1 = {
      eventId: `e-${Date.now()}-5`,
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: {
        id: 'i3',
        title: 'First',
        description: '',
        statusId: 'todo',
        priority: 3,
        assigneeId: null,
        projectId: null,
        cycleId: null,
        labels: [],
        identifier: 'T-3',
        teamId: 't1',
        parentId: null,
        sortOrder: 0,
        sequence: 3,
        completedAt: null,
        canceledAt: null,
        deletedAt: null,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    }

    const event1 = processEvent(data1)
    routeEvent(event1!)

    expect(useIssuesStore.getState().issues).toHaveLength(1)

    const data2 = {
      eventId: `e-${Date.now()}-6`,
      type: 'event',
      channel: 'team:t1',
      event: 'issue.updated',
      data: { issueId: 'i3', title: 'Updated' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    }

    const event2 = processEvent(data2)
    routeEvent(event2!)

    expect(useIssuesStore.getState().issues).toHaveLength(1)
    expect(useIssuesStore.getState().issues[0].title).toBe('Updated')
  })
})

describe('integration: reconnection restores event stream', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useWebSocketStore.setState({
      connectionStatus: 'disconnected',
      reconnectAttempts: 0,
      autoUpdateEnabled: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('setReconnecting increments reconnectAttempts', () => {
    useWebSocketStore.getState().setReconnecting()
    expect(useWebSocketStore.getState().reconnectAttempts).toBe(1)

    useWebSocketStore.getState().setReconnecting()
    expect(useWebSocketStore.getState().reconnectAttempts).toBe(2)
  })

  it('setConnected resets reconnectAttempts', () => {
    useWebSocketStore.getState().setReconnecting()
    useWebSocketStore.getState().setReconnecting()
    useWebSocketStore.getState().setConnected()

    expect(useWebSocketStore.getState().reconnectAttempts).toBe(0)
    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')
  })

  it('connection status transitions correctly', () => {
    const store = useWebSocketStore.getState()
    expect(store.connectionStatus).toBe('disconnected')

    store.setConnecting()
    expect(useWebSocketStore.getState().connectionStatus).toBe('connecting')

    useWebSocketStore.getState().setConnected()
    expect(useWebSocketStore.getState().connectionStatus).toBe('connected')

    useWebSocketStore.getState().setReconnecting()
    expect(useWebSocketStore.getState().connectionStatus).toBe('reconnecting')

    useWebSocketStore.getState().setDisconnected()
    expect(useWebSocketStore.getState().connectionStatus).toBe('disconnected')
  })
})
