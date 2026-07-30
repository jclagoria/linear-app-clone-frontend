import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Team } from './types'

const STORAGE_KEY = 'activeTeamId'

interface TeamState {
  currentTeamId: string | null
  currentTeamName: string | null
  setCurrentTeamId: (id: string, name: string) => void

  teams: Team[]
  loading: boolean
  error: string | null
  activeTeamId: string | null
  setTeams: (teams: Team[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setActiveTeamId: (id: string | null) => void
}

export const useTeamStore = create<TeamState>()(
  devtools(
    (set) => {
      const storedId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      return {
        currentTeamId: storedId,
        currentTeamName: null,
        setCurrentTeamId: (id: string, name: string) =>
          set({ currentTeamId: id, currentTeamName: name, activeTeamId: id }),

        teams: [],
        loading: false,
        error: null,
        activeTeamId: storedId,
        setTeams: (teams: Team[]) => set({ teams }),
        setLoading: (loading: boolean) => set({ loading }),
        setError: (error: string | null) => set({ error }),
        setActiveTeamId: (id: string | null) => {
          if (typeof window !== 'undefined') {
            if (id) {
              localStorage.setItem(STORAGE_KEY, id)
            } else {
              localStorage.removeItem(STORAGE_KEY)
            }
          }
          set({ activeTeamId: id, currentTeamId: id })
        },
      }
    },
    { name: 'team-store' },
  ),
)
