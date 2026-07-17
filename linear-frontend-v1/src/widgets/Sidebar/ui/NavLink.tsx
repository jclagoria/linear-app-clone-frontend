import type { ReactNode } from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'

interface NavLinkProps {
  to: string
  icon: ReactNode
  label: string
  collapsed?: boolean
}

export function NavLink({ to, icon, label, collapsed = false }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-sidebar-active-bg text-sidebar-active-text'
            : 'text-text-secondary hover:bg-sidebar-hover hover:text-text-primary',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
          )}
          <span className="shrink-0">{icon}</span>
          {!collapsed && <span>{label}</span>}
        </>
      )}
    </RouterNavLink>
  )
}
