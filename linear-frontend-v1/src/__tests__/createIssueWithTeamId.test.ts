import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { server } from '@/mocks/server'
import { createIssue } from '@/entities/issue/api'
import { useTeamStore } from '@/entities/team/model/store'

describe('createIssue with teamId', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
  afterAll(() => server.close())
  afterEach(() => {
    server.resetHandlers()
    useTeamStore.setState({ currentTeamId: null, currentTeamName: null })
  })

  it('creates issue with teamId in POST body', async () => {
    useTeamStore.getState().setCurrentTeam('team-1', 'Team Alpha')

    const result = await createIssue({
      title: 'Test Issue',
      description: 'Test description',
      teamId: 'team-1',
    })

    expect(result.data).toBeDefined()
    expect(result.data.title).toBe('Test Issue')
    expect(result.data.teamId).toBe('team-1')
  })

  it('fails when teamId is missing', async () => {
    await expect(
      createIssue({
        title: 'Test Issue',
        description: 'Test description',
        teamId: '',
      }),
    ).rejects.toThrow()
  })
})