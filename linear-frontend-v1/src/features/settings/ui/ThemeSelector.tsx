import { Sun, Moon, Monitor } from 'lucide-react'
import { useUIStore, type Theme } from '@/shared/stores/uiStore'

const themes: { value: Theme; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: <Sun className="h-5 w-5" />,
    description: 'Light mode for daytime use',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <Moon className="h-5 w-5" />,
    description: 'Dark mode for nighttime use',
  },
  {
    value: 'system',
    label: 'System',
    icon: <Monitor className="h-5 w-5" />,
    description: 'Follow your system preference',
  },
]

export function ThemeSelector() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-primary)]">Theme</h3>
      <div className="grid grid-cols-3 gap-3">
        {themes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTheme(t.value)}
            className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
              theme === t.value
                ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10'
                : 'border-[var(--border-color)] hover:border-[var(--accent-color)]/50'
            }`}
            aria-pressed={theme === t.value}
            aria-label={`Select ${t.label} theme`}
          >
            <span className={theme === t.value ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'}>
              {t.icon}
            </span>
            <span className="text-sm font-medium text-[var(--text-primary)]">{t.label}</span>
            <span className="text-xs text-[var(--text-secondary)] text-center">{t.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}