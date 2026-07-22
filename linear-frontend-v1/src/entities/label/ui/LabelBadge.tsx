import { useCallback } from 'react'
import { X, Tag } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Label } from '../model/types'

interface LabelBadgeProps {
  label: Label
  onRemove?: (id: string) => void
  removable?: boolean
  disabled?: boolean
}

export function LabelBadge({ label, onRemove, removable, disabled }: LabelBadgeProps) {
  const handleRemove = useCallback(() => {
    if (!disabled && onRemove) {
      onRemove(label.id)
    }
  }, [disabled, onRemove, label.id])

  return (
    <span
      role="listitem"
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        'transition-opacity',
        disabled && 'pointer-events-none opacity-50',
      )}
      style={{ backgroundColor: `${label.color}20`, color: label.color }}
    >
      <Tag className="h-3 w-3" aria-hidden="true" />
      <span>{label.name}</span>
      {removable && (
        <button
          onClick={handleRemove}
          disabled={disabled}
          aria-label={`Remove ${label.name} label`}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </span>
  )
}
