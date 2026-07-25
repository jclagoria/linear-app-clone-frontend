import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Project } from './entity-types'
import { useCacheStore } from '@/shared/stores/cacheStore'

interface ProjectsState {
  projects: Project[]
  isLoading: boolean
  error: string | null

  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, changes: Partial<Project>) => void
  removeProject: (id: string) => void
  applyEvent: (event: { type: string; payload: Record<string, unknown> }) => void
}

export const useProjectsStore = create<ProjectsState>()(
  devtools(
    (set) => ({
      projects: [],
      isLoading: false,
      error: null,

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
        const { type, payload } = event
        const projectId = payload.projectId as string
        if (!projectId) return

        switch (type) {
          case 'project.created':
            set((state) => ({
              projects: [payload as unknown as Project, ...state.projects],
            }))
            break
          case 'project.updated':
            set((state) => ({
              projects: state.projects.map((p) =>
                p.id === projectId ? { ...p, ...payload } : p,
              ),
            }))
            break
        }
      },
    }),
    { name: 'projects-store' },
  ),
)
