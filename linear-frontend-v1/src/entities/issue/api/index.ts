import { apiClient } from '@/shared/lib/api-client'
import type { Issue, Comment, CreateIssueData, UpdateIssueData } from '../model/types'

export interface FetchIssuesParams {
  status?: string | null
  assigneeId?: string | null
  priority?: number | null
  projectId?: string | null
  cycleId?: string | null
  labelIds?: string[]
  search?: string | null
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
  if (params.status) queryParams.status = params.status
  if (params.assigneeId) queryParams.assigneeId = params.assigneeId
  if (params.priority !== null && params.priority !== undefined)
    queryParams.priority = String(params.priority)
  if (params.projectId) queryParams.projectId = params.projectId
  if (params.cycleId) queryParams.cycleId = params.cycleId
  if (params.search) queryParams.search = params.search
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

export async function createComment(
  issueId: string,
  body: string,
): Promise<{ data: Comment }> {
  return apiClient.post<{ data: Comment }>(`/issues/${issueId}/comments`, {
    body: { body },
  })
}
