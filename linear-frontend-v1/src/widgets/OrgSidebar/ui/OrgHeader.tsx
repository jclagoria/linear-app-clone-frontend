import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface OrgHeaderProps {
  name: string
  isExpanded: boolean
  onToggle: () => void
}

export function OrgHeader({ name, isExpanded, onToggle }: OrgHeaderProps) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={isExpanded}
      className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
    >
      <ChevronDown
        className={cn(
          'h-3.5 w-3.5 transition-transform',
          isExpanded ? 'rotate-0' : '-rotate-90',
        )}
        aria-hidden="true"
      />
      <span>{name}</span>
    </button>
  )
}
