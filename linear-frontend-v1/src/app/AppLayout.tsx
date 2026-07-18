import { Outlet } from 'react-router-dom'
import { UserAvatar } from '@/features/auth/ui/UserAvatar'
import { Sidebar } from '@/widgets/Sidebar/ui/Sidebar'
import { useUIStore } from '@/shared/stores/uiStore'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { Bell } from 'lucide-react'
import { selectUnreadCount } from '@/shared/stores/selectors'

export function AppLayout() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const notifications = useWebSocketStore((s) => s.notifications)
  const unreadCount = selectUnreadCount(notifications)

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-text">Linear Clone</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            >
              <Bell size={18} aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white" aria-hidden="true">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <UserAvatar />
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
