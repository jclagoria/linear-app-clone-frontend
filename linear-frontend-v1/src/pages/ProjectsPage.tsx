import { useProjectsStore } from '@/features/realtime/lib/project-store'
import { ProjectCard } from '@/features/realtime/ui/ProjectCard'
import { EmptyState } from '@/shared/ui/EmptyState'

export function ProjectsPage() {
  const projects = useProjectsStore((s) => s.projects)
  const isLoading = useProjectsStore((s) => s.isLoading)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-text-muted">Loading projects...</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-text mb-6">Projects</h1>
        <EmptyState
          title="No projects yet"
          description="Create your first project to get started."
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text mb-6">Projects</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            projectId={project.id}
            name={project.name}
            icon={project.icon}
            status={project.status}
            variant="grid"
          />
        ))}
      </div>
    </div>
  )
}
