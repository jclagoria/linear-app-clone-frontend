import type { Issue, Comment } from '@/entities/issue/model/types'
import type { Label } from '@/entities/label/model/types'

// ============================================================
// Canonical Fixtures
// ============================================================

export const mockIssue: Issue = {
  id: '1',
  title: 'Test Issue',
  description: 'Test description',
  statusId: 'Todo',
  priority: 2,
  assigneeId: 'u1',
  assigneeName: 'User',
  projectId: null,
  cycleId: null,
  labels: [],
  identifier: 'TST-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  teamId: 't1',
  parentId: null,
  sortOrder: 0,
  sequence: 1,
  completedAt: null,
  canceledAt: null,
  deletedAt: null,
}

export const mockLabels: Label[] = [
  { id: 'l1', name: 'Bug', color: '#ef4444', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'l2', name: 'Feature', color: '#22c55e', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'l3', name: 'Enhancement', color: '#3b82f6', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
]

export const mockComments: Comment[] = [
  {
    id: 'c1',
    issueId: '1',
    body: 'Original comment body',
    authorId: 'u1',
    authorName: 'User',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
  },
  {
    id: 'c2',
    issueId: '1',
    body: 'Comment by another user',
    authorId: 'u2',
    authorName: 'Other User',
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-01-02T12:00:00Z',
  },
]

// ============================================================
// Factory Helpers
// ============================================================

interface IssueOverrides extends Partial<Issue> {}

/**
 * Creates an Issue fixture with optional overrides.
 * @example
 * ```tsx
 * const issue = createMockIssue({ title: 'Custom Title', statusId: 'Done' })
 * ```
 */
// ponytail: counter for unique IDs — Date.now() freezes under fake timers
let _id = 0
function uid(prefix: string) { return `${prefix}-${++_id}-${Math.random().toString(36).slice(2, 7)}` }

export function createMockIssue(overrides: IssueOverrides = {}): Issue {
  return {
    ...mockIssue,
    ...overrides,
    id: overrides.id ?? uid('issue'),
  }
}

interface LabelOverrides extends Partial<Label> {}

/**
 * Creates a Label fixture with optional overrides.
 * @example
 * ```tsx
 * const label = createMockLabel({ name: 'Urgent', color: '#ff0000' })
 * ```
 */
export function createMockLabel(overrides: LabelOverrides = {}): Label {
  return {
    ...mockLabels[0],
    ...overrides,
    id: overrides.id ?? uid('label'),
  }
}

interface CommentOverrides extends Partial<Comment> {}

/**
 * Creates a Comment fixture with optional overrides.
 * @example
 * ```tsx
 * const comment = createMockComment({ body: 'Custom body', authorId: 'u2' })
 * ```
 */
export function createMockComment(overrides: CommentOverrides = {}): Comment {
  return {
    ...mockComments[0],
    ...overrides,
    id: overrides.id ?? uid('comment'),
  }
}

/**
 * Creates multiple Issue fixtures.
 * @example
 * ```tsx
 * const issues = createMockIssues(5, { statusId: 'Done' })
 * ```
 */
export function createMockIssues(count: number, overrides: IssueOverrides = {}): Issue[] {
  return Array.from({ length: count }, (_, i) =>
    createMockIssue({ ...overrides, id: `issue-${i + 1}`, sequence: i + 1 }),
  )
}

/**
 * Creates multiple Label fixtures.
 * @example
 * ```tsx
 * const labels = createMockLabels(3)
 * ```
 */
export function createMockLabels(count: number, overrides: LabelOverrides = {}): Label[] {
  const defaultColors = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6']
  const defaultNames = ['Bug', 'Feature', 'Enhancement', 'Task', 'Question']

  return Array.from({ length: count }, (_, i) =>
    createMockLabel({
      ...overrides,
      id: overrides.id ?? `label-${i + 1}`,
      name: overrides.name ?? defaultNames[i % defaultNames.length],
      color: overrides.color ?? defaultColors[i % defaultColors.length],
    }),
  )
}

/**
 * Creates multiple Comment fixtures.
 * @example
 * ```tsx
 * const comments = createMockComments(3, { issueId: '123' })
 * ```
 */
export function createMockComments(count: number, overrides: CommentOverrides = {}): Comment[] {
  return Array.from({ length: count }, (_, i) =>
    createMockComment({
      ...overrides,
      id: overrides.id ?? `comment-${i + 1}`,
      body: overrides.body ?? `Comment ${i + 1}`,
    }),
  )
}
