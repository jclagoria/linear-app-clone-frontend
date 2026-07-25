import type { WSEvent, WSEventType } from '../lib/event-schema'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useProjectsStore } from '../lib/project-store'
import { useCyclesStore } from '../lib/cycle-store'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { registerEventHandler } from './event-processor'

function handleIssueEvent(event: WSEvent): void {
  const store = useIssuesStore.getState()
  const { type, payload } = event
  const issueId = (payload as Record<string, unknown>).issueId as string

  switch (type) {
    case 'issue.created':
      store.addIssue(payload as Parameters<typeof store.addIssue>[0])
      break
    case 'issue.updated':
    case 'issue.statusChanged':
    case 'issue.assigned':
    case 'issue.unassigned':
      if (issueId) {
        store.updateIssue(issueId, payload as Parameters<typeof store.updateIssue>[1])
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
  const store = useIssuesStore.getState()
  const payload = event.payload as Record<string, unknown>
  const issueId = payload.issueId as string
  const commentId = payload.commentId as string

  if (!issueId) return

  if (event.type === 'comment.created') {
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
  } else if (event.type === 'comment.updated') {
    const body = payload.body as string
    if (body && commentId) {
      store.updateCommentInStore(issueId, commentId, body)
    }
  }
}

function handleProjectEvent(event: WSEvent): void {
  useProjectsStore.getState().applyEvent(event)
}

function handleCycleEvent(event: WSEvent): void {
  useCyclesStore.getState().applyEvent(event)
}

function handleNotificationEvent(event: WSEvent): void {
  const payload = event.payload as Record<string, unknown>
  useWebSocketStore.getState().addNotification({
    id: (payload.notificationId as string) || event.eventId,
    type: (payload.type as string) || 'info',
    title: (payload.title as string) || 'New notification',
    message: (payload.message as string) || '',
    read: false,
    createdAt: event.timestamp,
    issueId: payload.issueId as string | undefined,
  })
}

const ROUTES: { prefix: string; handler: (event: WSEvent) => void }[] = [
  { prefix: 'issue.', handler: handleIssueEvent },
  { prefix: 'comment.', handler: handleCommentEvent },
  { prefix: 'project.', handler: handleProjectEvent },
  { prefix: 'cycle.', handler: handleCycleEvent },
  { prefix: 'notification.', handler: handleNotificationEvent },
]

export function setupEventRouter(): void {
  const types: WSEventType[] = [
    'issue.created', 'issue.updated', 'issue.statusChanged',
    'issue.assigned', 'issue.unassigned', 'issue.deleted',
    'comment.created', 'comment.updated',
    'project.created', 'project.updated',
    'cycle.created', 'cycle.updated', 'cycle.activated', 'cycle.completed',
    'notification.created',
  ]

  for (const eventType of types) {
    const route = ROUTES.find((r) => eventType.startsWith(r.prefix))
    if (route) {
      registerEventHandler(eventType, route.handler)
    }
  }
}
