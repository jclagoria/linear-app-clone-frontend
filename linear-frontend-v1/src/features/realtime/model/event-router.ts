import type { WSEvent, WSEventType } from '../lib/event-schema'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useProjectsStore } from '../lib/project-store'
import { useCyclesStore } from '../lib/cycle-store'
import { useNotificationsStore } from '@/shared/stores/notificationsStore'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { useLabelDefinitionsStore } from '@/entities/label/model/store'
import { useAuthStore } from '@/entities/session/model/store'
import { registerEventHandler } from './event-processor'

// Test-only override: when non-null, this value takes precedence over the websocket store
let testAutoUpdateOverride: boolean | null = null
export function setTestAutoUpdateOverride(value: boolean | null) {
  testAutoUpdateOverride = value
}

function isAutoUpdateEnabled(): boolean {
  return testAutoUpdateOverride !== null ? testAutoUpdateOverride : useWebSocketStore.getState().autoUpdateEnabled
}

function handleIssueEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  const store = useIssuesStore.getState()
  const { event: eventType, data } = event
  const issueId = (data as Record<string, unknown>).issueId as string

  switch (eventType) {
    case 'issue.created':
      store.addIssue(data as Parameters<typeof store.addIssue>[0])
      break
    case 'issue.updated':
    case 'issue.statusChanged':
    case 'issue.assigned':
    case 'issue.unassigned':
      if (issueId) {
        store.updateIssue(issueId, data as Parameters<typeof store.updateIssue>[1])
      }
      break
    case 'issue.deleted':
      if (issueId) {
        store.removeIssue(issueId)
      }
      break
  }
}

function handleCommentEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  const store = useIssuesStore.getState()
  const payload = event.data as Record<string, unknown>
  const issueId = payload.issueId as string
  const commentId = payload.commentId as string

  if (!issueId) return

  if (event.event === 'comment.created') {
    const existing = store.commentsByIssue[issueId] || []
    store.setCommentsForIssue(issueId, [
      ...existing,
      {
        id: commentId,
        issueId,
        body: (payload.body as string) || '',
        authorId: (payload.authorId as string) || '',
        authorName: (payload.authorName as string) || '',
        createdAt: event.timestamp,
        updatedAt: event.timestamp,
      },
    ])
  } else if (event.event === 'comment.updated') {
    const body = payload.body as string
    if (body && commentId) {
      store.updateCommentInStore(issueId, commentId, body)
    }
  }
}

function handleProjectEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  useProjectsStore.getState().applyEvent(event)
}

function handleCycleEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  useCyclesStore.getState().applyEvent(event)
}

function handleNotificationEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  const payload = event.data as Record<string, unknown>
  useNotificationsStore.getState().addNotification({
    id: (payload.notificationId as string) || event.eventId,
    type: (payload.type as string) || 'info',
    title: (payload.title as string) || 'New notification',
    message: (payload.message as string) || '',
    read: false,
    createdAt: event.timestamp,
    issueId: payload.issueId as string | undefined,
  })
}

function handleLabelEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  const payload = event.data as Record<string, unknown>
  const store = useLabelDefinitionsStore.getState()

  if (event.event === 'label.created') {
    // Add new label to the definitions store
    const newLabel = {
      id: (payload.labelId as string) || event.eventId,
      name: (payload.name as string) || 'Untitled',
      color: (payload.color as string) || '#6b7280',
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
    }
    store.labels = [newLabel, ...store.labels]
  }
}

function handleUserEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  // User online events are presence indicators
  // For now, we log them for future presence tracking
  const payload = event.data as Record<string, unknown>
  const userId = payload.userId as string
  if (userId) {
    useWebSocketStore.getState().setLastHeartbeat(event.timestamp)
  }
}

function handleSessionEvent(event: WSEvent): void {
  // Session events should always be processed (not gated by autoUpdateEnabled)
  if (event.event === 'session.revoked') {
    // Trigger logout and redirect to login
    useAuthStore.getState().logout()
    window.location.href = '/login'
  }
}

const ROUTES: { prefix: string; handler: (event: WSEvent) => void }[] = [
  { prefix: 'issue.', handler: handleIssueEvent },
  { prefix: 'comment.', handler: handleCommentEvent },
  { prefix: 'project.', handler: handleProjectEvent },
  { prefix: 'cycle.', handler: handleCycleEvent },
  { prefix: 'notification.', handler: handleNotificationEvent },
  { prefix: 'label.', handler: handleLabelEvent },
  { prefix: 'user.', handler: handleUserEvent },
  { prefix: 'session.', handler: handleSessionEvent },
]

export function setupEventRouter(): void {
  const types: WSEventType[] = [
    'issue.created', 'issue.updated', 'issue.statusChanged',
    'issue.assigned', 'issue.unassigned', 'issue.deleted',
    'comment.created', 'comment.updated',
    'project.created', 'project.updated',
    'cycle.created', 'cycle.updated', 'cycle.activated', 'cycle.completed',
    'notification.created',
    'label.created',
    'user.online',
    'session.revoked',
  ]

  for (const eventType of types) {
    const route = ROUTES.find((r) => eventType.startsWith(r.prefix))
    if (route) {
      registerEventHandler(eventType, route.handler)
    }
  }
}
