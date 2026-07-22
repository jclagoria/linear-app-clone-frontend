import type { Watcher } from '../model/types'

interface WatcherItemProps {
  watcher: Watcher
  isSelf: boolean
}

export function WatcherItem({ watcher, isSelf }: WatcherItemProps) {
  const initials = watcher.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <li className="flex items-center gap-2 py-1">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-text-inverse">
        {initials}
      </div>
      <span className="text-sm text-text">{watcher.name}</span>
      {isSelf && (
        <span className="text-xs text-text-muted">(you)</span>
      )}
    </li>
  )
}
