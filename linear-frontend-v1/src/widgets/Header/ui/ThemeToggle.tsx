import { Sun, Moon, Monitor } from 'lucide-react'
import { useUIStore, type Theme } from '@/shared/stores/uiStore'

const themeCycle: Theme[] = ['light', 'dark', 'system']

const themeConfig: Record<Theme, { icon: React.ReactNode; nextLabel: string }> = {
  light: { icon: <Sun className="h-4 w-4" />, nextLabel: 'dark' },
  dark: { icon: <Moon className="h-4 w-4" />, nextLabel: 'system' },
  system: { icon: <Monitor className="h-4 w-4" />, nextLabel: 'light' },
}

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  const handleToggle = () => {
    const currentIndex = themeCycle.indexOf(theme)
    const nextTheme = themeCycle[(currentIndex + 1) % themeCycle.length]
    setTheme(nextTheme)
  }

  const { icon, nextLabel } = themeConfig[theme]

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-alt hover:text-text transition-colors"
      aria-label={`Switch to ${nextLabel} mode`}
    >
      {icon}
    </button>
  )
}
