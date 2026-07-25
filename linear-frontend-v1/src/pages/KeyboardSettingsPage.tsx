import { useState, useCallback } from 'react'
import { Button } from '@/shared/ui/Button'
import { ShortcutSettingsRow } from '@/features/keyboard/ui/ShortcutSettingsRow'
import { DeleteConfirmModal } from '@/features/keyboard/ui/DeleteConfirmModal'
import { shortcuts } from '@/features/keyboard/model/shortcuts'
import { useKeyboardStore } from '@/features/keyboard/model/useKeyboardStore'

export function KeyboardSettingsPage() {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const resetCustomizations = useKeyboardStore((s) => s.resetCustomizations)

  const handleReset = useCallback(() => {
    resetCustomizations()
    setIsResetModalOpen(false)
  }, [resetCustomizations])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text">Keyboard Shortcuts</h1>
          <p className="text-sm text-text-muted mt-1">
            Customize keyboard shortcuts for faster navigation
          </p>
        </div>
        <Button variant="secondary" onClick={() => setIsResetModalOpen(true)}>
          Reset to defaults
        </Button>
      </div>

      <div className="border border-border rounded-lg">
        {shortcuts.map((shortcut) => (
          <ShortcutSettingsRow
            key={shortcut.id}
            shortcutId={shortcut.id}
            label={shortcut.description}
            defaultKeys={shortcut.keys}
          />
        ))}
      </div>

      <DeleteConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
        title="Reset keyboard shortcuts"
        message="Are you sure you want to reset all keyboard shortcuts to their default values? This action cannot be undone."
      />
    </div>
  )
}
