import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface Team {
  id: string
  name: string
}

interface TeamSelectorProps {
  teams: Team[]
  currentTeamId?: string
  onSelect: (teamId: string) => void
  collapsed?: boolean
}

export function TeamSelector({
  teams,
  currentTeamId,
  onSelect,
  collapsed = false,
}: TeamSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentTeam = teams.find((t) => t.id === currentTeamId) ?? teams[0]

  const handleToggle = useCallback(() => {
    if (!collapsed) setIsOpen((prev) => !prev)
  }, [collapsed])

  const handleSelect = useCallback(
    (teamId: string) => {
      onSelect(teamId)
      setIsOpen(false)
    },
    [onSelect],
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  if (teams.length === 0) return null

  return (
    <div ref={ref} className="relative px-2 pt-2">
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={collapsed ? currentTeam?.name : 'Select team'}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-tertiary)]',
          collapsed && 'justify-center px-0',
        )}
      >
        {!collapsed && (
          <>
            <span className="truncate">{currentTeam?.name ?? 'Select team'}</span>
            <ChevronDown
              className={cn(
                'ml-auto h-3.5 w-3.5 text-[var(--text-secondary)] transition-transform',
                isOpen && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {isOpen && !collapsed && (
        <ul
          role="listbox"
          aria-label="Select a team"
          className="absolute left-2 right-2 top-full z-50 mt-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-lg"
        >
          {teams.map((team) => (
            <li
              key={team.id}
              role="option"
              aria-selected={team.id === currentTeamId}
              onClick={() => handleSelect(team.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelect(team.id)
                }
              }}
              tabIndex={0}
              className={cn(
                'cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-[var(--bg-tertiary)] first:rounded-t-lg last:rounded-b-lg',
                team.id === currentTeamId
                  ? 'text-[var(--accent-color)] font-semibold'
                  : 'text-[var(--text-primary)]',
              )}
            >
              {team.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
