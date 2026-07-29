import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectsStore } from '@/features/realtime/lib/project-store'
import { ProjectCard } from '@/features/realtime/ui/ProjectCard'
import { CreateProjectDialog } from '@/features/projects/ui/CreateProjectDialog'
import { Spinner } from '@/shared/ui/Spinner'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Select } from '@/shared/ui/Select'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { Button } from '@/shared/ui/Button'

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Planned', value: 'planned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Canceled', value: 'canceled' },
]

export function ProjectsPage() {
  const navigate = useNavigate()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const projects = useProjectsStore((s) => s.projects)
  const isLoading = useProjectsStore((s) => s.isLoading)
  const error = useProjectsStore((s) => s.error)
  const hasMore = useProjectsStore((s) => s.hasMore)
  const statusFilter = useProjectsStore((s) => s.statusFilter)
  const fetchProjects = useProjectsStore((s) => s.fetchProjects)
  const fetchMore = useProjectsStore((s) => s.fetchMore)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const teamId = 'default-team-id'

  useEffect(() => {
    fetchProjects(teamId)
  }, [fetchProjects, teamId])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          fetchMore()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, fetchMore])

  const handleFilterChange = useCallback(
    (value: string) => {
      fetchProjects(teamId, { status: value || undefined })
    },
    [fetchProjects, teamId],
  )

  const handleRetry = useCallback(() => {
    fetchProjects(teamId, { status: statusFilter ?? undefined })
  }, [fetchProjects, teamId, statusFilter])

  const hasActiveFilter = statusFilter !== null && statusFilter !== ''

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Projects</h1>
        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
            New Project
          </Button>
          <div className="w-48">
            <Select
              aria-label="Filter projects by status"
              options={STATUS_OPTIONS}
              value={statusFilter ?? ''}
              onChange={handleFilterChange}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-3">
          <ErrorBanner message={error} type="server" />
          <Button variant="secondary" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}

      {isLoading && projects.length === 0 && (
        <div className="flex items-center justify-center py-16" aria-live="polite">
          <Spinner size="lg" label="Loading projects" />
        </div>
      )}

      {!isLoading && projects.length === 0 && !error && (
        <EmptyState
          icon={hasActiveFilter ? '🔍' : '📭'}
          title={hasActiveFilter ? 'No projects match this filter' : 'No projects yet'}
          description={hasActiveFilter ? 'Try a different status filter.' : 'Create your first project to get started.'}
        />
      )}

      {projects.length > 0 && (
        <>
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="Projects list"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                projectId={project.id}
                name={project.name}
                icon={project.icon}
                status={project.status}
                variant="grid"
                onClick={(id) => navigate(`/projects/${id}`)}
              />
            ))}
          </div>

          {isLoading && projects.length > 0 && (
            <div className="flex justify-center py-8" aria-live="polite">
              <Spinner label="Loading more projects" />
            </div>
          )}

          {!hasMore && projects.length > 0 && (
            <p className="py-4 text-center text-sm text-text-muted" role="status">
              No more projects to show
            </p>
          )}

          <div ref={sentinelRef} className="h-1" aria-hidden="true" />
        </>
      )}

      <CreateProjectDialog
        teamId={teamId}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  )
}
