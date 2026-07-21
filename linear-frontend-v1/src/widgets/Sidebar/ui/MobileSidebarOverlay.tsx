import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { NavLink } from './NavLink'
import { TeamSelector } from './TeamSelector'
import { LayoutDashboard, ListTodo, FolderKanban, RefreshCw, Settings } from 'lucide-react'

const navItems = [
  { to: '/', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Dashboard' },
  { to: '/issues', icon: <ListTodo className="h-4 w-4" />, label: 'Issues' },
  { to: '/projects', icon: <FolderKanban className="h-4 w-4" />, label: 'Projects' },
  { to: '/cycles', icon: <RefreshCw className="h-4 w-4" />, label: 'Cycles' },
  { to: '/settings', icon: <Settings className="h-4 w-4" />, label: 'Settings' },
]

const teams = [
  { id: 'team-1', name: 'Team Alpha' },
  { id: 'team-2', name: 'Team Beta' },
  { id: 'team-3', name: 'Team Gamma' },
]

interface MobileSidebarOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebarOverlay({ isOpen, onClose }: MobileSidebarOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null)
  const navigate = useNavigate()

  const handleNavClick = useCallback(
    (to: string) => {
      onClose()
      navigate(to)
    },
    [onClose, navigate],
  )

  // Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = overlayRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    },
    [isOpen, onClose],
  )

  // Focus first nav link when opened
  useEffect(() => {
    if (isOpen && firstNavLinkRef.current) {
      firstNavLinkRef.current.focus()
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[var(--overlay-backdrop)] transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Overlay panel */}
      <aside
        ref={overlayRef}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-secondary)] shadow-xl transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
      >
        <TeamSelector
          teams={teams}
          currentTeamId="team-1"
          onSelect={(id) => console.log('Team selected:', id)}
        />

        <div className="border-b border-[var(--border-color)] px-3 py-2">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-2 py-2">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              onClick={() => handleNavClick(item.to)}
              ref={index === 0 ? firstNavLinkRef : undefined}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}
