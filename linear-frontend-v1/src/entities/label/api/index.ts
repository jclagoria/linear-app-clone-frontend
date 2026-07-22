import { apiClient } from '@/shared/lib/api-client'
import type { Label } from '../model/types'

export async function fetchIssueLabels(issueId: string): Promise<{ data: Label[] }> {
  return apiClient.get<{ data: Label[] }>(`/issues/${issueId}/labels`)
}

export async function attachLabel(issueId: string, labelId: string): Promise<{ data: Label }> {
  return apiClient.post<{ data: Label }>(`/issues/${issueId}/labels`, {
    body: { labelId },
  })
}

export async function detachLabel(issueId: string, labelId: string): Promise<void> {
  return apiClient.delete<void>(`/issues/${issueId}/labels/${labelId}`)
}

export async function fetchLabelDefinitions(): Promise<{ data: Label[] }> {
  return apiClient.get<{ data: Label[] }>('/labels')
}
