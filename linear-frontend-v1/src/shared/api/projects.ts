import { apiClient } from '@/shared/lib/api-client'
import type { Project } from '@/features/realtime/lib/entity-types'

export interface ProjectListParams {
  teamId: string
  status?: 'planned' | 'in_progress' | 'completed' | 'canceled'
  cursor?: string
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { nextCursor: string | null; hasMore: boolean }
}

export interface CreateProjectPayload {
  teamId: string
  name: string
  description?: string
  startDate?: string
  targetDate?: string
}

export async function listProjects(
  params: ProjectListParams,
): Promise<PaginatedResponse<Project>> {
  const queryParams: Record<string, string> = {
    teamId: params.teamId,
  }
  if (params.status) queryParams.status = params.status
  if (params.cursor) queryParams.cursor = params.cursor
  if (params.limit !== undefined) queryParams.limit = String(params.limit)

  return apiClient.get<PaginatedResponse<Project>>('/projects', {
    params: queryParams,
  })
}

export async function createProject(
  payload: CreateProjectPayload,
): Promise<Project> {
  return apiClient.post<Project>('/projects', { body: payload })
}
