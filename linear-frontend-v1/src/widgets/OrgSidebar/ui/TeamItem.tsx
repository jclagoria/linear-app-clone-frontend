import { TeamKeyBadge } from './TeamKeyBadge'

interface TeamItemProps {
  name: string
  teamKey: string
  isActive: boolean
  onSelect: () => void
}

export function TeamItem({ name, teamKey, isActive, onSelect }: TeamItemProps) {
  return (
    <button
      onClick={onSelect}
      role="treeitem"
      aria-current={isActive ? 'page' : undefined}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
        isActive
          ? 'bg-[var(--bg-tertiary)] font-semibold text-[var(--accent-color)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
      }`}
    >
      <span className="truncate">{name}</span>
      <TeamKeyBadge teamKey={teamKey} />
    </button>
  )
}
