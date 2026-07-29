import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCacheStore } from '@/shared/stores/cacheStore'

vi.mock('@/shared/api/projects', () => ({
  listProjects: vi.fn(),
}))

const mockProjects = [
  { id: 'p1', name: 'Project A', description: 'Desc A', icon: '📁', status: 'active', teamId: 't1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'p2', name: 'Project B', description: 'Desc B', icon: '📊', status: 'planned', teamId: 't1', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
]

describe('projectsStore', () => {
  beforeEach(async () => {
    const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
    useProjectsStore.setState({
      projects: [],
      isLoading: false,
      error: null,
      cursor: null,
      hasMore: true,
      teamId: null,
      statusFilter: null,
    })
    useCacheStore.getState().clear()
    vi.clearAllMocks()
  })

  describe('fetchProjects', () => {
    it('sets loading then populates projects on success', async () => {
      const { listProjects } = await import('@/shared/api/projects')
      vi.mocked(listProjects).mockResolvedValue({
        data: mockProjects,
        pagination: { nextCursor: 'cursor-2', hasMore: true },
      })

      const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
      const promise = useProjectsStore.getState().fetchProjects('t1')

      expect(useProjectsStore.getState().isLoading).toBe(true)
      expect(useProjectsStore.getState().projects).toEqual([])

      await promise

      const state = useProjectsStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.projects).toHaveLength(2)
      expect(state.cursor).toBe('cursor-2')
      expect(state.hasMore).toBe(true)
      expect(state.teamId).toBe('t1')
    })

    it('stores status filter when provided', async () => {
      const { listProjects } = await import('@/shared/api/projects')
      vi.mocked(listProjects).mockResolvedValue({
        data: mockProjects,
        pagination: { nextCursor: null, hasMore: false },
      })

      const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
      await useProjectsStore.getState().fetchProjects('t1', { status: 'planned' })

      expect(useProjectsStore.getState().statusFilter).toBe('planned')
    })

    it('sets error on failure', async () => {
      const { listProjects } = await import('@/shared/api/projects')
      vi.mocked(listProjects).mockRejectedValue(new Error('API error'))

      const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
      await useProjectsStore.getState().fetchProjects('t1')

      const state = useProjectsStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('API error')
      expect(state.projects).toEqual([])
    })

    it('replaces projects on refetch (filter change)', async () => {
      const { listProjects } = await import('@/shared/api/projects')
      vi.mocked(listProjects).mockResolvedValue({
        data: mockProjects,
        pagination: { nextCursor: null, hasMore: false },
      })

      const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
      await useProjectsStore.getState().fetchProjects('t1', { status: 'active' })

      expect(useProjectsStore.getState().projects).toHaveLength(2)

      const newProject = { id: 'p3', name: 'Project C', description: 'Desc C', icon: '📈', status: 'planned', teamId: 't1', createdAt: '2024-01-03', updatedAt: '2024-01-03' }
      vi.mocked(listProjects).mockResolvedValue({
        data: [newProject],
        pagination: { nextCursor: null, hasMore: false },
      })

      await useProjectsStore.getState().fetchProjects('t1', { status: 'planned' })

      expect(useProjectsStore.getState().projects).toHaveLength(1)
      expect(useProjectsStore.getState().projects[0].id).toBe('p3')
    })
  })

  describe('fetchMore', () => {
    it('appends projects on next page', async () => {
      const { listProjects } = await import('@/shared/api/projects')
      vi.mocked(listProjects).mockResolvedValue({
        data: mockProjects,
        pagination: { nextCursor: 'cursor-2', hasMore: true },
      })

      const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
      await useProjectsStore.getState().fetchProjects('t1')

      const moreProjects = [{ id: 'p3', name: 'Project C', description: 'Desc C', icon: '📈', status: 'planned', teamId: 't1', createdAt: '2024-01-03', updatedAt: '2024-01-03' }]
      vi.mocked(listProjects).mockResolvedValue({
        data: moreProjects,
        pagination: { nextCursor: null, hasMore: false },
      })

      await useProjectsStore.getState().fetchMore()

      const state = useProjectsStore.getState()
      expect(state.projects).toHaveLength(3)
      expect(state.cursor).toBeNull()
      expect(state.hasMore).toBe(false)
    })

    it('does nothing if hasMore is false', async () => {
      const { listProjects } = await import('@/shared/api/projects')

      const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
      useProjectsStore.setState({ hasMore: false, teamId: 't1' })

      await useProjectsStore.getState().fetchMore()

      expect(listProjects).not.toHaveBeenCalled()
    })

    it('does nothing if no cursor', async () => {
      const { listProjects } = await import('@/shared/api/projects')

      const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
      useProjectsStore.setState({ cursor: null, teamId: 't1' })

      await useProjectsStore.getState().fetchMore()

      expect(listProjects).not.toHaveBeenCalled()
    })
  })

  describe('CRUD', () => {
    it('adds a project', async () => {
      const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
      useProjectsStore.getState().addProject(mockProjects[0])
      expect(useProjectsStore.getState().projects).toHaveLength(1)
    })

    it('updates a project', async () => {
      const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
      useProjectsStore.setState({ projects: mockProjects })
      useProjectsStore.getState().updateProject('p1', { name: 'Updated A' })
      expect(useProjectsStore.getState().projects[0].name).toBe('Updated A')
    })

    it('removes a project', async () => {
      const { useProjectsStore } = await import('@/features/realtime/lib/project-store')
      useProjectsStore.setState({ projects: mockProjects })
      useProjectsStore.getState().removeProject('p1')
      expect(useProjectsStore.getState().projects).toHaveLength(1)
    })
  })
})
