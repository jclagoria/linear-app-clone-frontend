import { AutoUpdateToggle } from '@/features/realtime/ui/AutoUpdateToggle'
import { ThemeSelector } from '@/features/settings/ui/ThemeSelector'

export function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Settings</h1>
      <div className="max-w-2xl space-y-6">
        <ThemeSelector />
        <AutoUpdateToggle />
      </div>
    </div>
  )
}
