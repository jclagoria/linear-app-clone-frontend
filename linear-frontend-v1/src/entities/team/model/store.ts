import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface TeamState {
  currentTeamId: string | null
  currentTeamName: string | null
  setCurrentTeam: (id: string, name: string) => void
}

export const useTeamStore = create<TeamState>()(
  devtools(
    (set) => ({
      currentTeamId: null,
      currentTeamName: null,
      setCurrentTeam: (id: string, name: string) =>
        set({ currentTeamId: id, currentTeamName: name }),
    }),
    { name: 'team-store' },
  ),
)