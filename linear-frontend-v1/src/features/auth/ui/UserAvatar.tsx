import { useState, useRef, useEffect, useCallback } from 'react'
import { LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function UserAvatar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleLogout = useCallback(async () => {
    setIsOpen(false)
    await logout()
  }, [logout])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close dropdown on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`User menu for ${user.name}`}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-text-inverse">
          {initials}
        </div>
        <span className="hidden sm:inline">{user.name}</span>
        <ChevronDown
          className={`h-4 w-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded-lg border border-border bg-surface shadow-lg"
        >
          <div className="border-b border-border px-3 py-2">
            <p className="text-sm font-medium text-text">{user.name}</p>
            <p className="text-xs text-text-muted">{user.email}</p>
          </div>
          <div className="p-1">
            <Button
              variant="ghost"
              onClick={handleLogout}
              icon={<LogOut className="h-4 w-4" />}
              aria-label={`Log out ${user.name}`}
              className="w-full justify-start rounded-md px-2 py-1.5 text-sm"
            >
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
