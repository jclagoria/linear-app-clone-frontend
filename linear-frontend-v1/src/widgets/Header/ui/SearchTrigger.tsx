import { Search } from 'lucide-react'

interface SearchTriggerProps {
  onClick?: () => void
}

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-alt hover:text-text transition-colors"
      aria-label="Open command palette"
    >
      <Search className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
