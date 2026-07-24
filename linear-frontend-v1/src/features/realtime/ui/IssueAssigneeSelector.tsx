import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface User {
  id: string
  name: string
  avatarUrl?: string
}

interface IssueAssigneeSelectorProps {
  issueId: string
  currentAssignee: User | null
  users: User[]
  onSelect: (issueId: string, userId: string | null) => void
  variant?: 'compact' | 'full'
  className?: string
}

export function IssueAssigneeSelector({
  issueId,
  currentAssignee,
  users,
  onSelect,
  variant = 'full',
  className,
}: IssueAssigneeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const allOptions = useMemo(() => [{ id: null, name: 'Unassigned' } as User, ...users], [users])

  const close = useCallback(() => {
    setIsOpen(false)
    setActiveIndex(-1)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (!listRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, close])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault()
          setIsOpen(true)
          setActiveIndex(0)
        }
        return
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          close()
          break
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((i) => (i + 1) % allOptions.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((i) => (i - 1 + allOptions.length) % allOptions.length)
          break
        case 'Enter':
          e.preventDefault()
          if (activeIndex >= 0) {
            const selected = allOptions[activeIndex]
            onSelect(issueId, selected.id)
            close()
          }
          break
      }
    },
    [isOpen, activeIndex, allOptions, issueId, onSelect, close],
  )

  const isCompact = variant === 'compact'

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center gap-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)]',
          'text-sm text-[var(--text-primary)] hover:border-[var(--border-hover)]',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          isCompact ? 'h-7 px-1.5' : 'h-8 px-2',
        )}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Assignee: ${currentAssignee?.name || 'Unassigned'}`}
      >
        {currentAssignee ? (
          <>
            <div className="h-4 w-4 rounded-full bg-[var(--bg-secondary)]" aria-hidden="true" />
            {!isCompact && (
              <span className="max-w-[100px] truncate">{currentAssignee.name}</span>
            )}
          </>
        ) : (
          <span className="text-[var(--text-secondary)]">Unassigned</span>
        )}
        <ChevronDown className={cn('h-3 w-3 text-[var(--text-secondary)]', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Select assignee"
          className="absolute z-50 mt-1 w-full min-w-[180px] max-h-60 overflow-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-xl"
        >
          {allOptions.map((user, index) => (
            <li
              key={user.id || '__unassigned__'}
              role="option"
              aria-selected={currentAssignee?.id === user.id || (!currentAssignee && user.id === null)}
              className={cn(
                'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
                'hover:bg-[var(--bg-secondary)] focus:bg-[var(--bg-secondary)]',
                activeIndex === index && 'bg-[var(--bg-secondary)]',
              )}
              onClick={() => {
                onSelect(issueId, user.id)
                close()
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {user.id ? (
                <div className="h-5 w-5 rounded-full bg-[var(--bg-secondary)]" aria-hidden="true" />
              ) : (
                <div className="h-5 w-5 rounded-full border border-dashed border-[var(--border-color)]" aria-hidden="true" />
              )}
              <span className="flex-1 truncate">{user.name}</span>
              {(currentAssignee?.id === user.id || (!currentAssignee && user.id === null)) && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
