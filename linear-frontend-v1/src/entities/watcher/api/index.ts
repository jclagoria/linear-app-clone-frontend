import { apiClient } from '@/shared/lib/api-client'
import type { Watcher } from '../model/types'

export async function fetchWatchers(
  issueId: string,
): Promise<{ data: Watcher[] }> {
  return apiClient.get<{ data: Watcher[] }>(`/issues/${issueId}/watchers`)
}

export async function addWatcher(
  issueId: string,
): Promise<{ data: Watcher }> {
  return apiClient.post<{ data: Watcher }>(`/issues/${issueId}/watchers`)
}

export async function removeWatcher(
  issueId: string,
  userId: string,
): Promise<void> {
  return apiClient.delete<void>(`/issues/${issueId}/watchers/${userId}`)
}
