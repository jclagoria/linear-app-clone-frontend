import { type ReactNode, useEffect } from 'react'

interface KeyboardShortcutWrapperProps {
  children: ReactNode
  shortcuts: {
    key: string
    action: () => void
    description?: string
  }[]
}

export function KeyboardShortcutWrapper({ children, shortcuts }: KeyboardShortcutWrapperProps) {
  useEffect(() => {
    const handleShortcut = (e: CustomEvent) => {
      const { action } = e.detail
      const shortcut = shortcuts.find((s) => s.key === action || s.description === action)
      if (shortcut) {
        shortcut.action()
      }
    }

    window.addEventListener('keyboard-shortcut', handleShortcut as EventListener)
    return () => window.removeEventListener('keyboard-shortcut', handleShortcut as EventListener)
  }, [shortcuts])

  return <>{children}</>
}
