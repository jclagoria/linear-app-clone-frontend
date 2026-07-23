import { LayoutDashboard, ListTodo, FolderKanban, RefreshCw, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { NavLink } from './NavLink'
import { TeamSelector } from './TeamSelector'
import { useTeamStore } from '@/entities/team/model/store'

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

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const currentTeamId = useTeamStore((s) => s.currentTeamId)
  const setCurrentTeamId = useTeamStore((s) => s.setCurrentTeamId)

  const handleTeamSelect = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    if (team) {
      setCurrentTeamId(team.id, team.name)
    }
  }

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-[var(--border-color)] bg-[var(--bg-secondary)] transition-all duration-200',
        collapsed ? 'w-14' : 'w-60',
      )}
      aria-label="Main navigation"
    >
      <TeamSelector
        teams={teams}
        currentTeamId={currentTeamId ?? 'team-1'}
        onSelect={handleTeamSelect}
        collapsed={collapsed}
      />

      <div className="flex items-center justify-end border-b border-[var(--border-color)] px-3 py-2">
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

      <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  )
}
