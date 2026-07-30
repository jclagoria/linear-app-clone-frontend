import { apiClient } from '@/shared/lib/api-client'
import type { Team } from '../model/types'

export async function fetchMyTeams(): Promise<Team[]> {
  const response = await apiClient.get<{ data: { teams: Team[] } }>('/me/teams')
  return response.data.teams
}
