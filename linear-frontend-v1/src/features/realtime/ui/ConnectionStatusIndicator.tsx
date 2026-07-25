import { cn } from '@/shared/lib/utils'
import type { ConnectionStatus } from '@/shared/stores/websocketStore'

interface ConnectionStatusIndicatorProps {
  status: ConnectionStatus
  className?: string
  onReconnect?: () => void
}

const STATUS_CONFIG: Record<ConnectionStatus, { dot: string; label: string; pulse: boolean }> = {
  connected: { dot: 'bg-green-500', label: 'Connected', pulse: false },
  connecting: { dot: 'bg-yellow-500', label: 'Connecting...', pulse: true },
  reconnecting: { dot: 'bg-orange-500', label: 'Reconnecting...', pulse: true },
  disconnected: { dot: 'bg-red-500', label: 'Disconnected', pulse: false },
}

export function ConnectionStatusIndicator({
  status,
  className,
  onReconnect,
}: ConnectionStatusIndicatorProps) {
  const config = STATUS_CONFIG[status]
  const isDisconnected = status === 'disconnected'

  return (
    <div
      role="status"
      aria-label={`Connection status: ${status}`}
      aria-live="polite"
      className={cn(
        'flex items-center gap-2',
        isDisconnected && 'cursor-pointer',
        className,
      )}
      onClick={isDisconnected ? onReconnect : undefined}
      onKeyDown={(e) => {
        if (isDisconnected && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onReconnect?.()
        }
      }}
      tabIndex={isDisconnected ? 0 : undefined}
    >
      <span
        className={cn(
          'inline-block h-2 w-2 rounded-full',
          config.dot,
          config.pulse && 'animate-pulse',
        )}
      />
      <span className="hidden text-xs text-[var(--text-secondary)] md:inline">
        {config.label}
      </span>
    </div>
  )
}
