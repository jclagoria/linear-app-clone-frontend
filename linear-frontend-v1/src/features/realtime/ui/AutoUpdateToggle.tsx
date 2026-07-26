import { useWebSocketStore } from '@/shared/stores/websocketStore'

export function AutoUpdateToggle() {
  const autoUpdateEnabled = useWebSocketStore((s) => s.autoUpdateEnabled)
  const setAutoUpdateEnabled = useWebSocketStore((s) => s.setAutoUpdateEnabled)

  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
      <div>
        <h3 className="text-sm font-medium text-[var(--text-primary)]">Real-time updates</h3>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Automatically update lists and notifications when changes occur
        </p>
      </div>
      <button
        role="switch"
        aria-checked={autoUpdateEnabled}
        aria-label="Toggle real-time updates"
        onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          autoUpdateEnabled ? 'bg-primary' : 'bg-[var(--bg-secondary)]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            autoUpdateEnabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
