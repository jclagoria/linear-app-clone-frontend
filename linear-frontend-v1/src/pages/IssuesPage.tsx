import { useEffect, useState } from 'react'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useUIStore } from '@/shared/stores/uiStore'
import { useCacheStore } from '@/shared/stores/cacheStore'
import { Plus, X } from 'lucide-react'

export function IssuesPage() {
  const issues = useIssuesStore((s) => s.issues)
  const isLoading = useIssuesStore((s) => s.isLoading)
  const error = useIssuesStore((s) => s.error)
  const filters = useIssuesStore((s) => s.filters)
  const loadIssues = useIssuesStore((s) => s.loadIssues)
  const loadNextPage = useIssuesStore((s) => s.loadNextPage)
  const hasMore = useIssuesStore((s) => s.hasMore)
  const selectIssue = useIssuesStore((s) => s.selectIssue)
  const selectedIssueId = useIssuesStore((s) => s.selectedIssueId)
  const setFilters = useIssuesStore((s) => s.setFilters)
  const clearFilters = useIssuesStore((s) => s.clearFilters)
  const activeModal = useUIStore((s) => s.activeModal)
  const openModal = useUIStore((s) => s.openModal)
  const closeModal = useUIStore((s) => s.closeModal)

  const [statusFilter, setStatusFilter] = useState(filters.status ?? '')

  useEffect(() => {
    const cached = useCacheStore.getState().get<typeof issues>('issues:list')
    if (!cached) {
      loadIssues()
    }
  }, [loadIssues])

  useEffect(() => {
    if (activeModal === 'issue-form') {
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [activeModal])

  function handleApplyFilters() {
    setFilters({ status: statusFilter || null })
    loadIssues()
  }

  function handleClearFilters() {
    setStatusFilter('')
    clearFilters()
    loadIssues()
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8" role="alert">
        <p className="text-lg font-semibold text-text">Failed to load issues</p>
        <p className="text-sm text-text-muted">{error}</p>
        <button
          onClick={() => loadIssues()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  if (isLoading && issues.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-busy="true">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="text-sm text-text-muted">Loading issues...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Issues</h1>
        <button
          onClick={() => openModal('issue-form')}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus size={16} aria-hidden="true" />
          New Issue
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          onClick={handleApplyFilters}
          className="rounded-md bg-surface-hover px-3 py-1.5 text-sm font-medium text-text hover:opacity-80"
        >
          Apply
        </button>
        {(filters.status || filters.assigneeId) && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-text-muted hover:text-text"
          >
            <X size={14} aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      {!isLoading && issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2 p-8">
          <p className="text-lg font-semibold text-text">No issues found</p>
          <p className="text-sm text-text-muted">Create your first issue to get started.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {issues.map((issue) => (
            <li key={issue.id}>
              <button
                onClick={() => selectIssue(issue.id)}
                className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                  selectedIssueId === issue.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text">{issue.title}</span>
                  <span className="text-xs text-text-muted">{issue.status}</span>
                </div>
                {issue.labels.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {issue.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {hasMore && issues.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => loadNextPage()}
            disabled={isLoading}
            className="rounded-md border border-border px-6 py-2 text-sm font-medium text-text hover:bg-surface-hover disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}

      {activeModal === 'issue-form' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Create new issue"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">New Issue</h2>
              <button
                onClick={closeModal}
                className="rounded-md p-1 text-text-muted hover:bg-surface-hover hover:text-text"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-text-muted">
              Issue creation form will be connected here.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
