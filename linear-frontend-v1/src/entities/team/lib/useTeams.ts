import { useEffect, useCallback } from 'react'
import { useTeamStore } from '../model/store'
import { groupTeamsByOrg, type OrgGroup } from '../model/types'
import { fetchMyTeams } from '../api/teams'
interface UseTeamsResult {
  orgGroups: OrgGroup[]
  loading: boolean
  error: string | null
  retry: () => void
}

export function useTeams(): UseTeamsResult {
  const teams = useTeamStore((s) => s.teams)
  const loading = useTeamStore((s) => s.loading)
  const error = useTeamStore((s) => s.error)
  const setTeams = useTeamStore((s) => s.setTeams)
  const setLoading = useTeamStore((s) => s.setLoading)
  const setError = useTeamStore((s) => s.setError)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      const result = await fetchMyTeams()
      clearTimeout(timeout)
      setTeams(result)
    } catch {
      setError('Could not load teams.')
    } finally {
      setLoading(false)
    }
  }, [setTeams, setLoading, setError])

  useEffect(() => {
    load()
  }, [load])

  return {
    orgGroups: groupTeamsByOrg(teams),
    loading,
    error,
    retry: load,
  }
}
