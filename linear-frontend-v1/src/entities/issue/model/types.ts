export interface Issue {
  id: string
  title: string
  description: string
  status: string
  priority: number
  assigneeId: string | null
  assigneeName?: string | null
  projectId: string | null
  cycleId: string | null
  labels: string[]
  identifier: string
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
  cursor: string | null
  hasMore: boolean
}

export interface CreateIssueData {
  title: string
  description?: string
  status?: string
  priority?: number
  assigneeId?: string | null
  projectId?: string | null
  cycleId?: string | null
  labels?: string[]
}

export interface UpdateIssueData {
  title?: string
  description?: string
  status?: string
  priority?: number
  assigneeId?: string | null
  projectId?: string | null
  cycleId?: string | null
  labels?: string[]
}
