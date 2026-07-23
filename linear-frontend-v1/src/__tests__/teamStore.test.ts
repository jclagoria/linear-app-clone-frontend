import { describe, it, expect, beforeEach } from 'vitest'
import { useTeamStore } from '@/entities/team/model/store'

describe('teamStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTeamStore.setState({
      currentTeamId: null,
      currentTeamName: null,
    })
  })

  it('has initial state with null values', () => {
    const { currentTeamId, currentTeamName } = useTeamStore.getState()
    expect(currentTeamId).toBeNull()
    expect(currentTeamName).toBeNull()
  })

  it('sets current team', () => {
    const { setCurrentTeamId } = useTeamStore.getState()
    setCurrentTeamId('team-1', 'Team Alpha')

    const { currentTeamId, currentTeamName } = useTeamStore.getState()
    expect(currentTeamId).toBe('team-1')
    expect(currentTeamName).toBe('Team Alpha')
  })

  it('updates current team when called again', () => {
    const { setCurrentTeamId } = useTeamStore.getState()

    setCurrentTeamId('team-1', 'Team Alpha')
    expect(useTeamStore.getState().currentTeamId).toBe('team-1')

    setCurrentTeamId('team-2', 'Team Beta')
    const { currentTeamId, currentTeamName } = useTeamStore.getState()
    expect(currentTeamId).toBe('team-2')
    expect(currentTeamName).toBe('Team Beta')
  })
})