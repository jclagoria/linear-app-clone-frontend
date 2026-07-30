import { useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LayoutDashboard, ListTodo, FolderKanban, RefreshCw, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { NavLink } from '@/widgets/Sidebar/ui/NavLink'
import { useTeams, useTeamStore } from '@/entities/team'
import { SkeletonLoader } from './SkeletonLoader'
import { ErrorBanner } from './ErrorBanner'
import { OrgSection } from './OrgSection'

const navItems = [
  { to: '/', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Dashboard' },
  { to: '/issues', icon: <ListTodo className="h-4 w-4" />, label: 'Issues' },
  { to: '/projects', icon: <FolderKanban className="h-4 w-4" />, label: 'Projects' },
  { to: '/cycles', icon: <RefreshCw className="h-4 w-4" />, label: 'Cycles' },
  { to: '/settings', icon: <Settings className="h-4 w-4" />, label: 'Settings' },
]

interface OrgSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  mobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function OrgSidebar({ collapsed = false, onToggle, mobile = false, isOpen, onClose }: OrgSidebarProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null)

  const { orgGroups, loading, error, retry } = useTeams()
  const activeTeamId = useTeamStore((s) => s.activeTeamId)
  const setActiveTeamId = useTeamStore((s) => s.setActiveTeamId)

  const handleTeamSelect = useCallback((teamId: string) => {
    setActiveTeamId(teamId)
    const params = new URLSearchParams(searchParams)
    params.set('team', teamId)
    setSearchParams(params, { replace: true })
    if (mobile && onClose) onClose()
  }, [setActiveTeamId, searchParams, setSearchParams, mobile, onClose])

  const handleNavClick = useCallback((to: string) => {
    if (mobile && onClose) {
      onClose()
      navigate(to)
    }
  }, [mobile, onClose, navigate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!mobile || !isOpen) return
    if (e.key === 'Escape' && onClose) {
      e.preventDefault()
      onClose()
    }
  }, [mobile, isOpen, onClose])

  // Focus first nav link when mobile opens
  const sidebarRef = useRef<HTMLDivElement>(null)
  const focusSetRef = useRef(false)
  if (mobile && isOpen && !focusSetRef.current) {
    focusSetRef.current = true
    requestAnimationFrame(() => {
      firstNavLinkRef.current?.focus()
    })
  }
  if (mobile && !isOpen) {
    focusSetRef.current = false
  }

  const sidebarContent = (
    <div className="flex flex-col h-full" ref={sidebarRef} onKeyDown={handleKeyDown}>
      {/* Team org sections */}
      {loading && <SkeletonLoader />}
      {error && <ErrorBanner onRetry={retry} />}
      {!loading && !error && orgGroups.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-3 py-6 text-sm text-[var(--text-secondary)]">
          <p>You are not a member of any team</p>
          <button
            onClick={() => navigate('/settings')}
            className="rounded-md bg-[var(--accent-color)] px-3 py-1 text-xs font-medium text-white transition-colors hover:opacity-90"
          >
            Create a team
          </button>
        </div>
      )}
      {!loading && !error && orgGroups.length > 0 && (
        <div className="flex flex-col gap-1 py-2">
          {orgGroups.map((group) => (
            <OrgSection
              key={group.orgId}
              orgId={group.orgId}
              orgName={group.orgName}
              teams={group.teams}
              activeTeamId={activeTeamId}
              singleOrg={orgGroups.length === 1}
              onTeamSelect={handleTeamSelect}
            />
          ))}
        </div>
      )}

      {/* Divider + nav */}
      <div className="mt-auto border-t border-[var(--border-color)] px-3 py-2">
        {!mobile && onToggle && (
          <div className="flex items-center justify-end mb-2">
            <button
              onClick={onToggle}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
        {mobile && onClose && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Navigation</span>
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
        )}
        <nav className="flex flex-col gap-1">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={!mobile && collapsed}
              onClick={mobile ? () => handleNavClick(item.to) : undefined}
              ref={index === 0 ? firstNavLinkRef : undefined}
            />
          ))}
        </nav>
      </div>
    </div>
  )

  if (mobile) {
    return (
      <>
        <div
          className={cn(
            'fixed inset-0 z-40 bg-[var(--overlay-backdrop)] transition-opacity duration-200',
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          onClick={onClose}
          aria-hidden="true"
        />
        <aside
          ref={overlayRef}
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-secondary)] shadow-xl transition-transform duration-200',
            isOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          aria-label="Organization navigation"
          role="dialog"
          aria-modal="true"
        >
          {sidebarContent}
        </aside>
      </>
    )
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-[var(--border-color)] bg-[var(--bg-secondary)] transition-all duration-200',
        collapsed ? 'w-14' : 'w-60',
      )}
      aria-label="Organization navigation"
    >
      {sidebarContent}
    </aside>
  )
}
