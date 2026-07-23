export interface Issue {
  id: string
  title: string
  description: string
  statusId: string
  priority: number
  assigneeId: string | null
  assigneeName?: string | null
  projectId: string | null
  cycleId: string | null
  labels: string[]
  identifier: string
  teamId: string
  parentId: string | null
  sortOrder: number
  sequence: number
  completedAt: string | null
  canceledAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  issueId: string
  body: string
  authorId: string
  authorName: string
  authorAvatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface IssueFilters {
  statusId: string | null
  assigneeId: string | null
  projectId: string | null
  cycleId: string | null
  labelIds: string[]
}

export interface PaginationCursor {
  nextCursor: string | null
  hasMore: boolean
}

export interface CreateIssueData {
  title: string
  description?: string
  statusId?: string
  priority?: number
  assigneeId?: string | null
  projectId?: string | null
  cycleId?: string | null
  labels?: string[]
  teamId: string
}

export interface UpdateIssueData {
  title?: string
  description?: string
  statusId?: string
  priority?: number
  assigneeId?: string | null
  projectId?: string | null
  cycleId?: string | null
  labels?: string[]
}
