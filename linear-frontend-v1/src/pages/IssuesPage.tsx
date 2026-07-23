import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useCacheStore } from '@/shared/stores/cacheStore'
import { useToastStore } from '@/shared/stores/toastStore'
import { useTeamStore } from '@/entities/team/model/store'
import { Button } from '@/shared/ui/Button'
import { Plus } from 'lucide-react'
import { IssueFilters } from '@/entities/issue/ui/IssueFilters'
import { IssueList } from '@/entities/issue/ui/IssueList'
import { IssueFormModal } from '@/entities/issue/ui/IssueFormModal'
import { createIssue } from '@/entities/issue/api'
import { selectFilteredIssues } from '@/entities/issue/model/selectors'
import type { IssueFormSchema } from '@/entities/issue/model/validation'

export function IssuesPage() {
  const navigate = useNavigate()
  const issues = useIssuesStore((s) => s.issues)
  const isLoading = useIssuesStore((s) => s.isLoading)
  const error = useIssuesStore((s) => s.error)
  const filters = useIssuesStore((s) => s.filters)
  const loadIssues = useIssuesStore((s) => s.loadIssues)
  const loadNextPage = useIssuesStore((s) => s.loadNextPage)
  const hasMore = useIssuesStore((s) => s.hasMore)
  const selectIssue = useIssuesStore((s) => s.selectIssue)
  const setFilters = useIssuesStore((s) => s.setFilters)
  const clearFilters = useIssuesStore((s) => s.clearFilters)
  const addIssue = useIssuesStore((s) => s.addIssue)
  const addToast = useToastStore((s) => s.addToast)
  const currentTeamId = useTeamStore((s) => s.currentTeamId)

  const [showForm, setShowForm] = useState(false)
  const hasActiveFilters =
    filters.statusId !== null ||
    filters.assigneeId !== null ||
    filters.projectId !== null ||
    filters.cycleId !== null ||
    filters.labelIds.length > 0

  const filteredIssues = selectFilteredIssues(issues, filters)

  useEffect(() => {
    const cached = useCacheStore.getState().get<typeof issues>('issues:list')
    if (!cached) {
      loadIssues()
    }
  }, [loadIssues])

  const handleIssueClick = useCallback(
    (id: string) => {
      selectIssue(id)
      navigate(`/issues/${id}`)
    },
    [selectIssue, navigate],
  )

  const handleCreateIssue = useCallback(
    async (data: IssueFormSchema) => {
      if (!currentTeamId) {
        addToast({
          title: 'Please select a team first',
          variant: 'error',
          duration: 3000,
        })
        return
      }

      const result = await createIssue({
        title: data.title,
        description: data.description || undefined,
        status: data.status || 'Todo',
        priority: data.priority,
        assigneeId: data.assigneeId,
        labels: data.labels,
        teamId: currentTeamId,
      })
      addIssue(result.data)
      addToast({
        title: 'Issue created',
        variant: 'success',
        duration: 3000,
      })
    },
    [addIssue, addToast, currentTeamId],
  )

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Issues</h1>
        <Button
          onClick={() => setShowForm(true)}
          icon={<Plus className="h-4 w-4" />}
          disabled={!currentTeamId}
          title={!currentTeamId ? 'Select a team first' : undefined}
        >
          New Issue
        </Button>
      </div>

      <IssueFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
      />

      <IssueList
        issues={filteredIssues}
        isLoading={isLoading}
        error={error}
        selectedIssueId={null}
        hasMore={hasMore}
        onIssueClick={handleIssueClick}
        onLoadMore={loadNextPage}
        onRetry={loadIssues}
        hasActiveFilters={hasActiveFilters}
        onCreateIssue={() => currentTeamId && setShowForm(true)}
      />

      <IssueFormModal
        isOpen={showForm}
        mode="create"
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateIssue}
      />
    </div>
  )
}
