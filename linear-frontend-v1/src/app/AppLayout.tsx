import { Outlet } from 'react-router-dom'
import { UserAvatar } from '@/features/auth/ui/UserAvatar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
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

        <UserAvatar />
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
