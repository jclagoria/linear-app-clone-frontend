import { useCyclesStore } from '@/features/realtime/lib/cycle-store'
import { EmptyState } from '@/shared/ui/EmptyState'

export function CyclesPage() {
  const cycles = useCyclesStore((s) => s.cycles)
  const isLoading = useCyclesStore((s) => s.isLoading)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-text-muted">Loading cycles...</p>
      </div>
    )
  }

  if (cycles.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-text mb-6">Cycles</h1>
        <EmptyState
          title="No cycles yet"
          description="Cycles will appear here when created."
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text mb-6">Cycles</h1>
      <div className="space-y-3">
        {cycles.map((cycle) => (
          <div
            key={cycle.id}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[var(--text-primary)]">{cycle.name}</h3>
              <span className="text-xs text-[var(--text-secondary)]">
                {new Date(cycle.startsAt).toLocaleDateString()} - {new Date(cycle.endsAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
