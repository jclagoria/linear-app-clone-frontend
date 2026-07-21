import { forwardRef, type ReactNode } from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'

interface NavLinkProps {
  to: string
  icon: ReactNode
  label: string
  collapsed?: boolean
  onClick?: () => void
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, icon, label, collapsed = false, onClick }, ref) => {
    return (
      <RouterNavLink
        to={to}
        ref={ref}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-[var(--bg-tertiary)] text-[var(--accent-color)]'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--accent-color)]" />
            )}
            <span className="shrink-0" aria-hidden="true">
              {icon}
            </span>
            {!collapsed && <span>{label}</span>}
          </>
        )}
      </RouterNavLink>
    )
  },
)

NavLink.displayName = 'NavLink'
