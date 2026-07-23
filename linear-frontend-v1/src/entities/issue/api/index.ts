import { apiClient } from '@/shared/lib/api-client'
import type { Issue, Comment, CreateIssueData, UpdateIssueData } from '../model/types'

export interface FetchIssuesParams {
  statusId?: string | null
  assigneeId?: string | null
  projectId?: string | null
  cycleId?: string | null
  labelIds?: string[]
  cursor?: string | null
}

export interface FetchIssuesResponse {
  data: Issue[]
  meta: { cursor: string | null; hasMore: boolean }
}

export async function fetchIssues(
  params: FetchIssuesParams = {},
): Promise<FetchIssuesResponse> {
  const queryParams: Record<string, string> = {}
  if (params.statusId) queryParams.statusId = params.statusId
  if (params.assigneeId) queryParams.assigneeId = params.assigneeId
  if (params.projectId) queryParams.projectId = params.projectId
  if (params.cycleId) queryParams.cycleId = params.cycleId
  if (params.labelIds && params.labelIds.length > 0)
    queryParams.labelIds = params.labelIds.join(',')
  if (params.cursor) queryParams.cursor = params.cursor

  return apiClient.get<FetchIssuesResponse>('/issues', {
    params: queryParams,
  })
}

export async function createIssue(
  data: CreateIssueData,
): Promise<{ data: Issue }> {
  return apiClient.post<{ data: Issue }>('/issues', { body: data })
}

export async function updateIssue(
  id: string,
  data: UpdateIssueData,
): Promise<{ data: Issue }> {
  return apiClient.patch<{ data: Issue }>(`/issues/${id}`, { body: data })
}

export async function deleteIssue(
  id: string,
): Promise<{ data: { success: boolean } }> {
  return apiClient.delete<{ data: { success: boolean } }>(`/issues/${id}`)
}

export async function fetchComments(
  issueId: string,
): Promise<{ data: Comment[] }> {
  return apiClient.get<{ data: Comment[] }>(`/issues/${issueId}/comments`)
}

export async function changeIssueStatus(
  id: string,
  statusId: string,
): Promise<{ data: Issue }> {
  return apiClient.patch<{ data: Issue }>(`/issues/${id}/status`, {
    body: { statusId },
  })
}

export async function assignIssue(
  id: string,
  assigneeId: string | null,
): Promise<{ data: Issue }> {
  return apiClient.patch<{ data: Issue }>(`/issues/${id}/assignee`, {
    body: { assigneeId },
  })
}

export async function createComment(
  issueId: string,
  body: string,
): Promise<{ data: Comment }> {
  return apiClient.post<{ data: Comment }>(`/issues/${issueId}/comments`, {
    body: { body },
  })
}

export async function updateComment(
  issueId: string,
  commentId: string,
  body: string,
): Promise<{ data: Comment }> {
  return apiClient.patch<{ data: Comment }>(
    `/issues/${issueId}/comments/${commentId}`,
    { body: { body } },
  )
}

export async function deleteComment(
  issueId: string,
  commentId: string,
): Promise<void> {
  await apiClient.delete<void>(`/issues/${issueId}/comments/${commentId}`)
}
