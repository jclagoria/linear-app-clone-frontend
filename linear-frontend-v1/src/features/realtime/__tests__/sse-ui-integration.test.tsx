import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { processEvent, routeEvent, clearDedupStore, clearEntityDedupStore } from '../model/event-processor'
import { setupEventRouter } from '../model/event-router'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useNotificationsStore } from '@/shared/stores/notificationsStore'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { NotificationBadge } from '../ui/NotificationBadge'
import { IssueCard } from '../ui/IssueCard'

function fireSSE(eventData: Record<string, unknown>) {
  act(() => {
    const event = processEvent(eventData)
    if (event) routeEvent(event)
  })
}

describe('integration: SSE event triggers UI re-render', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearDedupStore()
    clearEntityDedupStore()
    setupEventRouter()

    useIssuesStore.setState({ issues: [], commentsByIssue: {} })
    useNotificationsStore.setState({ items: [] })
    useWebSocketStore.setState({ autoUpdateEnabled: true, connectionStatus: 'connected' })
  })

  afterEach(() => {
    vi.useRealTimers()
    clearDedupStore()
    clearEntityDedupStore()
  })

  it('notification.created renders in NotificationBadge', () => {
    render(<NotificationBadge />)

    expect(screen.queryByLabelText(/unread/)).not.toBeInTheDocument()

    fireSSE({
      eventId: `e-${Date.now()}-1`,
      type: 'notification.created',
      payload: {
        notificationId: 'n1',
        type: 'issue_assigned',
        title: 'Assigned',
        message: 'You were assigned',
      },
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    })

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByLabelText('1 unread notifications')).toBeInTheDocument()
  })

  it('multiple notification.created events update badge count', () => {
    render(<NotificationBadge />)

    fireSSE({
      eventId: `e-${Date.now()}-10`,
      type: 'notification.created',
      payload: { notificationId: 'n1', type: 'info', title: 'One', message: '' },
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    })

    fireSSE({
      eventId: `e-${Date.now()}-11`,
      type: 'notification.created',
      payload: { notificationId: 'n2', type: 'info', title: 'Two', message: '' },
      timestamp: '2026-01-01T00:00:01Z',
      teamId: 't1',
    })

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('issue.created renders in IssueCard via store', () => {
    fireSSE({
      eventId: `e-${Date.now()}-20`,
      type: 'issue.created',
      payload: { issueId: 'i1', title: 'New Issue', statusId: 'todo' },
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    })

    const issues = useIssuesStore.getState().issues
    expect(issues).toHaveLength(1)

    render(<IssueCard issueId="i1" title="New Issue" statusId="todo" statusLabel="To Do" />)
    expect(screen.getByText('New Issue')).toBeInTheDocument()
  })

  it('issue.updated reflects in store and can be re-rendered', () => {
    useIssuesStore.getState().addIssue({
      id: 'i2',
      title: 'Original',
      description: '',
      statusId: 'todo',
      priority: 0,
      assigneeId: null,
      projectId: null,
      cycleId: null,
      labels: [],
      identifier: 'PROJ-2',
      teamId: 't1',
      parentId: null,
      sortOrder: 0,
      sequence: 1,
      completedAt: null,
      canceledAt: null,
      deletedAt: null,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    })

    render(<IssueCard issueId="i2" title="Original" statusId="todo" statusLabel="To Do" />)
    expect(screen.getByText('Original')).toBeInTheDocument()

    fireSSE({
      eventId: `e-${Date.now()}-31`,
      type: 'issue.updated',
      payload: { issueId: 'i2', title: 'Updated Title', statusId: 'in-progress' },
      timestamp: '2026-01-01T00:00:01Z',
      teamId: 't1',
    })

    expect(useIssuesStore.getState().issues[0].title).toBe('Updated Title')

    render(<IssueCard issueId="i2" title="Updated Title" statusId="in-progress" statusLabel="In Progress" />)
    expect(screen.getByText('Updated Title')).toBeInTheDocument()
  })

  it('events ignored when autoUpdateEnabled is false do not affect UI', () => {
    useWebSocketStore.setState({ autoUpdateEnabled: false })

    render(<NotificationBadge />)

    fireSSE({
      eventId: `e-${Date.now()}-40`,
      type: 'notification.created',
      payload: { notificationId: 'n1', type: 'info', title: 'Ignored', message: '' },
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    })

    expect(screen.queryByLabelText(/unread/)).not.toBeInTheDocument()
    expect(useNotificationsStore.getState().items).toHaveLength(0)
  })

  it('duplicate SSE events do not cause double render', () => {
    render(<NotificationBadge />)

    const data = {
      eventId: `e-${Date.now()}-50`,
      type: 'notification.created',
      payload: { notificationId: 'n1', type: 'info', title: 'Unique', message: '' },
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    }

    fireSSE(data)
    fireSSE({ ...data, eventId: `e-${Date.now()}-51` })

    expect(useNotificationsStore.getState().items).toHaveLength(1)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
