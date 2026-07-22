import { Plus, Tag } from 'lucide-react'
import { LabelBadge } from './LabelBadge'
import { Button } from '@/shared/ui/Button'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { EmptyState } from '@/shared/ui/EmptyState'
import { SkeletonLoader } from '@/entities/issue/ui/SkeletonLoader'
import type { Label } from '../model/types'

interface LabelListProps {
  labels: Label[]
  onDetach?: (labelId: string) => void
  onAdd?: () => void
  isLoading?: boolean
  error?: string | null
  disabled?: boolean
}

export function LabelList({
  labels,
  onDetach,
  onAdd,
  isLoading,
  error,
  disabled,
}: LabelListProps) {
  if (error) {
    return (
      <ErrorBanner
        message={error}
        type="server"
      />
    )
  }

  if (isLoading) {
    return <SkeletonLoader count={1} className="max-w-xs" />
  }

  if (labels.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <EmptyState
          icon={<Tag className="h-8 w-8" />}
          title="No labels"
          className="py-4"
        />
        {onAdd && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdd}
            icon={<Plus className="h-4 w-4" />}
            aria-label="Add label to issue"
          >
            Add label
          </Button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div
        role="list"
        aria-label="Issue labels"
        className="flex flex-wrap items-center gap-1.5"
      >
        {labels.map((label) => (
          <LabelBadge
            key={label.id}
            label={label}
            onRemove={onDetach}
            removable={!!onDetach}
            disabled={disabled}
          />
        ))}
        {onAdd && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdd}
            icon={<Plus className="h-4 w-4" />}
            aria-label="Add label to issue"
            className="ml-1"
          >
            Add label
          </Button>
        )}
      </div>
    </div>
  )
}
