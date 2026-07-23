import { Select } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { Filter, X } from 'lucide-react'
import type { IssueFilters as IssueFiltersType } from '../model/types'

interface IssueFiltersProps {
  filters: IssueFiltersType
  onFilterChange: (filters: Partial<IssueFiltersType>) => void
  onClearFilters: () => void
}

const statusOptions = [
  { label: 'All statuses', value: '' },
  { label: 'Todo', value: 'Todo' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' },
  { label: 'Cancelled', value: 'Cancelled' },
]

export function IssueFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: IssueFiltersProps) {
  const hasActiveFilters =
    filters.statusId !== null ||
    filters.assigneeId !== null ||
    filters.projectId !== null ||
    filters.cycleId !== null ||
    filters.labelIds.length > 0

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2" role="search" aria-label="Filter issues">
      <Filter className="h-4 w-4 text-text-muted" aria-hidden="true" />
      <Select
        options={statusOptions}
        value={filters.statusId ?? ''}
        onChange={(value) => onFilterChange({ statusId: value || null })}
        placeholder="Status"
        aria-label="Filter by status"
        className="w-36"
      />
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          icon={<X className="h-4 w-4" />}
          aria-label="Clear all filters"
        >
          Clear
        </Button>
      )}
    </div>
  )
}
