import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Project } from './entity-types'
import { useCacheStore } from '@/shared/stores/cacheStore'
import { listProjects } from '@/shared/api/projects'
import type { PaginatedResponse, ProjectListParams } from '@/shared/api/projects'

interface ProjectsState {
  projects: Project[]
  isLoading: boolean
  error: string | null
  cursor: string | null
  hasMore: boolean
  teamId: string | null
  statusFilter: string | null

  fetchProjects: (teamId: string, options?: { status?: string }) => Promise<void>
  fetchMore: () => Promise<void>
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, changes: Partial<Project>) => void
  removeProject: (id: string) => void
  applyEvent: (event: { type: string; payload: Record<string, unknown> }) => void
}

export const useProjectsStore = create<ProjectsState>()(
  devtools(
    (set, get) => ({
      projects: [],
      isLoading: false,
      error: null,
      cursor: null,
      hasMore: true,
      teamId: null,
      statusFilter: null,

      fetchProjects: async (teamId, options) => {
        set({ isLoading: true, error: null, projects: [], cursor: null, hasMore: true, teamId, statusFilter: options?.status ?? null })

        try {
          const result: PaginatedResponse<Project> = await listProjects({
            teamId,
            status: options?.status as ProjectListParams['status'],
          })

          set({
            projects: result.data,
            cursor: result.pagination.nextCursor,
            hasMore: result.pagination.hasMore,
            isLoading: false,
          })
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load projects',
            isLoading: false,
          })
        }
      },

      fetchMore: async () => {
        const { hasMore, isLoading, cursor, teamId, statusFilter } = get()
        if (!hasMore || isLoading || !cursor || !teamId) return

        set({ isLoading: true })

        try {
          const result: PaginatedResponse<Project> = await listProjects({
            teamId,
            status: statusFilter as ProjectListParams['status'],
            cursor,
          })

          set((state) => ({
            projects: [...state.projects, ...result.data],
            cursor: result.pagination.nextCursor,
            hasMore: result.pagination.hasMore,
            isLoading: false,
          }))
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load more projects',
            isLoading: false,
          })
        }
      },

      setProjects: (projects) => set({ projects }),

      addProject: (project) => {
        useCacheStore.getState().invalidateByPrefix('projects')
        set((state) => ({
          projects: [project, ...state.projects],
        }))
      },

      updateProject: (id, changes) => {
        useCacheStore.getState().invalidateByPrefix('projects')
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...changes } : p,
          ),
        }))
      },

      removeProject: (id) => {
        useCacheStore.getState().invalidateByPrefix('projects')
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }))
      },

      applyEvent: (event) => {
        const { event: eventType, data } = event as { event: string; data: Record<string, unknown> }
        const projectId = data.projectId as string
        if (!projectId) return

        switch (eventType) {
          case 'project.created':
            set((state) => ({
              projects: [data as unknown as Project, ...state.projects],
            }))
            break
          case 'project.updated':
            set((state) => ({
              projects: state.projects.map((p) =>
                p.id === projectId ? { ...p, ...data } : p,
              ),
            }))
            break
        }
      },
    }),
    { name: 'projects-store' },
  ),
)
