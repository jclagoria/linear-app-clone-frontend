import { useState, useCallback, useRef, useEffect } from 'react'
import { Kbd } from '@/shared/ui/Kbd'
import { Button } from '@/shared/ui/Button'
import { useKeyboardStore } from '../model/useKeyboardStore'
import { isConflict } from '../model/validation'

interface ShortcutSettingsRowProps {
  shortcutId: string
  label: string
  defaultKeys: string
}

export function ShortcutSettingsRow({ shortcutId, label, defaultKeys }: ShortcutSettingsRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const customizations = useKeyboardStore((s) => s.customizations)
  const updateCustomization = useKeyboardStore((s) => s.updateCustomization)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const currentKeys = customizations[shortcutId] ?? defaultKeys

  const handleStartEdit = useCallback(() => {
    setIsEditing(true)
    setError(null)
  }, [])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setError(null)
    buttonRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isEditing) return

      if (e.key === 'Escape') {
        handleCancel()
        return
      }

      if (e.key === 'Tab') return

      e.preventDefault()

      const parts: string[] = []
      if (e.ctrlKey || e.metaKey) parts.push('Ctrl')
      if (e.altKey) parts.push('Alt')
      if (e.shiftKey) parts.push('Shift')

      const key = e.key.toLowerCase()
      if (!['ctrl', 'alt', 'shift', 'meta', 'control'].includes(key)) {
        parts.push(key)
      }

      const newKeys = parts.join('+')

      if (isConflict(newKeys, customizations, shortcutId)) {
        setError('This key combination is already in use')
        return
      }

      updateCustomization(shortcutId, newKeys)
      setIsEditing(false)
      setError(null)
      buttonRef.current?.focus()
    },
    [isEditing, customizations, shortcutId, updateCustomization, handleCancel],
  )

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditing, handleKeyDown])

  const handleReset = useCallback(() => {
    updateCustomization(shortcutId, defaultKeys)
    setError(null)
  }, [shortcutId, defaultKeys, updateCustomization])

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border">
      <div className="flex-1">
        <span className="text-sm font-medium text-text">{label}</span>
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
      </div>

      <div className="flex items-center gap-3">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted animate-pulse">Press keys...</span>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {formatKeys(currentKeys)
                .split('+')
                .map((key, i, arr) => (
                  <span key={i} className="flex items-center">
                    <Kbd>{key}</Kbd>
                    {i < arr.length - 1 && (
                      <span className="text-text-muted mx-0.5">+</span>
                    )}
                  </span>
                ))}
            </div>
            <Button ref={buttonRef} variant="ghost" size="sm" onClick={handleStartEdit}>
              Edit
            </Button>
            {currentKeys !== defaultKeys && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function formatKeys(keys: string): string {
  return keys
    .split(' then ')
    .map((part) =>
      part
        .split('+')
        .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
        .join('+'),
    )
    .join(' then ')
}
