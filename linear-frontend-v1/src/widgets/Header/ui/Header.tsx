import { type RefCallback } from 'react'
import { UserAvatar } from '@/features/auth/ui/UserAvatar'
import { SearchTrigger } from './SearchTrigger'
import { ThemeToggle } from './ThemeToggle'
import { NotificationBell } from './NotificationBell'
import { HamburgerButton } from '@/widgets/Sidebar/ui/HamburgerButton'
import { cn } from '@/shared/lib/utils'

interface HeaderProps {
  unreadCount: number
  onSearchClick?: () => void
  onHamburgerClick?: () => void
  isMobileSidebarOpen?: boolean
  showHamburger?: boolean
  hamburgerRef?: RefCallback<HTMLButtonElement>
}

export function Header({
  unreadCount,
  onSearchClick,
  onHamburgerClick,
  isMobileSidebarOpen = false,
  showHamburger = false,
  hamburgerRef,
}: HeaderProps) {
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
        <ThemeToggle />
        <SearchTrigger onClick={onSearchClick} />
        <NotificationBell unreadCount={unreadCount} />
        <UserAvatar />
      </div>
    </header>
  )
}
