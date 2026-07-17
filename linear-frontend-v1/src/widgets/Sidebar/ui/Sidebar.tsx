import { LayoutDashboard, ListTodo, FolderKanban, RefreshCw, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { NavLink } from './NavLink'

const navItems = [
  { to: '/', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Dashboard' },
  { to: '/issues', icon: <ListTodo className="h-4 w-4" />, label: 'Issues' },
  { to: '/projects', icon: <FolderKanban className="h-4 w-4" />, label: 'Projects' },
  { to: '/cycles', icon: <RefreshCw className="h-4 w-4" />, label: 'Cycles' },
  { to: '/settings', icon: <Settings className="h-4 w-4" />, label: 'Settings' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-sidebar-bg transition-all duration-200',
        collapsed ? 'w-14' : 'w-60',
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-end border-b border-border px-3 py-2">
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-sidebar-hover hover:text-text-primary transition-colors"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>
      <nav className="flex flex-col gap-1 px-2 py-2">
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
