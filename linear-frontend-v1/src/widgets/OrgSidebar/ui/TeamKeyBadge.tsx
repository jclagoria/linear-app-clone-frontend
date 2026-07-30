interface TeamKeyBadgeProps {
  teamKey: string
}

export function TeamKeyBadge({ teamKey }: TeamKeyBadgeProps) {
  return (
    <span className="ml-auto inline-flex items-center rounded-md bg-[var(--bg-tertiary)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
      {teamKey}
    </span>
  )
}
