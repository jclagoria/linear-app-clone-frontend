export type IssueEventType =
  | 'issue.created'
  | 'issue.updated'
  | 'issue.statusChanged'
  | 'issue.assigned'
  | 'issue.unassigned'
  | 'issue.deleted'

export type CommentEventType = 'comment.created' | 'comment.updated'

export type ProjectEventType = 'project.created' | 'project.updated'

export type CycleEventType =
  | 'cycle.created'
  | 'cycle.updated'
  | 'cycle.activated'
  | 'cycle.completed'

export type NotificationEventType = 'notification.created'

export type WSEventType =
  | IssueEventType
  | CommentEventType
  | ProjectEventType
  | CycleEventType
  | NotificationEventType

export interface IssueEventPayload {
  issueId: string
  title?: string
  statusId?: string
  priority?: number
  assigneeId?: string | null
  assigneeName?: string | null
  projectId?: string | null
  cycleId?: string | null
  labels?: string[]
  description?: string
}

export interface CommentEventPayload {
  commentId: string
  issueId: string
  body?: string
  authorId?: string
  authorName?: string
}

export interface ProjectEventPayload {
  projectId: string
  name?: string
  description?: string
  icon?: string
}

export interface CycleEventPayload {
  cycleId: string
  name?: string
  startsAt?: string
  endsAt?: string
  status?: string
}

export interface NotificationEventPayload {
  notificationId: string
  type: string
  title: string
  message: string
  issueId?: string
}

export type WSEventPayload =
  | IssueEventPayload
  | CommentEventPayload
  | ProjectEventPayload
  | CycleEventPayload
  | NotificationEventPayload

export interface WSEvent {
  eventId: string
  type: WSEventType
  payload: WSEventPayload
  timestamp: string
  teamId: string
}

export type OptimisticAction = 'update' | 'add' | 'remove'

export interface OptimisticRevert {
  action: OptimisticAction
  target: string
  data: unknown
}

export interface OptimisticRequest {
  method: 'POST' | 'PATCH' | 'DELETE'
  url: string
  body?: unknown
}

export interface OptimisticUpdate {
  id: string
  action: OptimisticAction
  target: string
  data: unknown
  revert: OptimisticRevert
  request: OptimisticRequest
  timestamp: number
}

export const REGISTERED_EVENT_TYPES: WSEventType[] = [
  'issue.created',
  'issue.updated',
  'issue.statusChanged',
  'issue.assigned',
  'issue.unassigned',
  'issue.deleted',
  'comment.created',
  'comment.updated',
  'project.created',
  'project.updated',
  'cycle.created',
  'cycle.updated',
  'cycle.activated',
  'cycle.completed',
  'notification.created',
]

export function isValidEventType(type: string): type is WSEventType {
  return (REGISTERED_EVENT_TYPES as string[]).includes(type)
}

export function validateWSEvent(data: unknown): data is WSEvent {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  if (typeof obj.eventId !== 'string' || obj.eventId.length === 0) return false
  if (typeof obj.type !== 'string' || !isValidEventType(obj.type)) return false
  if (typeof obj.timestamp !== 'string') return false
  if (typeof obj.teamId !== 'string') return false
  if (typeof obj.payload !== 'object' || obj.payload === null) return false
  return true
}
