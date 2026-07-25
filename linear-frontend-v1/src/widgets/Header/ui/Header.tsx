import { type RefCallback, useState, useCallback } from 'react'
import { UserAvatar } from '@/features/auth/ui/UserAvatar'
import { SearchTrigger } from './SearchTrigger'
import { ThemeToggle } from './ThemeToggle'
import { HamburgerButton } from '@/widgets/Sidebar/ui/HamburgerButton'
import { ConnectionStatusIndicator } from '@/features/realtime/ui/ConnectionStatusIndicator'
import { NotificationPanel } from '@/features/realtime/ui/NotificationPanel'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { cn } from '@/shared/lib/utils'
import type { ConnectionStatus } from '@/shared/stores/websocketStore'

interface HeaderProps {
  connectionStatus?: ConnectionStatus
  onReconnect?: () => void
  onSearchClick?: () => void
  onHamburgerClick?: () => void
  isMobileSidebarOpen?: boolean
  showHamburger?: boolean
  hamburgerRef?: RefCallback<HTMLButtonElement>
}

export function Header({
  connectionStatus = 'disconnected',
  onReconnect,
  onSearchClick,
  onHamburgerClick,
  isMobileSidebarOpen = false,
  showHamburger = false,
  hamburgerRef,
}: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const notifications = useWebSocketStore((s) => s.notifications)
  const markAsRead = useWebSocketStore((s) => s.markAsRead)

  const handleToggleNotifications = useCallback(() => {
    setIsNotificationsOpen((prev) => !prev)
  }, [])

  const handleMarkAllRead = useCallback(() => {
    for (const n of notifications) {
      if (!n.read) markAsRead(n.id)
    }
  }, [notifications, markAsRead])

  const handleNotificationClick = useCallback(() => {
    setIsNotificationsOpen(false)
  }, [])

  return (
    <header
      className="flex h-12 items-center justify-between border-b border-[var(--border-color)] px-3 sticky top-0 z-100 bg-[var(--bg-primary)]"
      role="banner"
    >
      <div className="flex items-center gap-2">
        {/* Logo - visible on md+ (tablet/desktop) */}
        <div className="hidden md:flex items-center gap-2">
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
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Linear Clone
          </span>
        </div>

        {/* Hamburger - visible on mobile only */}
        <div className={cn('flex md:hidden', !showHamburger && 'hidden')}>
          <HamburgerButton
            open={isMobileSidebarOpen}
            onToggle={onHamburgerClick}
            ref={hamburgerRef}
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ConnectionStatusIndicator
          status={connectionStatus}
          onReconnect={onReconnect}
        />
        <ThemeToggle />
        <SearchTrigger onClick={onSearchClick} />
        <NotificationPanel
          isOpen={isNotificationsOpen}
          notifications={notifications}
          onToggle={handleToggleNotifications}
          onMarkAsRead={markAsRead}
          onMarkAllRead={handleMarkAllRead}
          onClose={() => setIsNotificationsOpen(false)}
          onItemClick={handleNotificationClick}
        />
        <UserAvatar />
      </div>
    </header>
  )
}
