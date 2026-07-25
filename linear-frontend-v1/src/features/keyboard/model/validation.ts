import { z } from 'zod'

const BROWSER_SHORTCUTS = [
  'ctrl+s',
  'ctrl+w',
  'ctrl+t',
  'ctrl+n',
  'ctrl+r',
  'ctrl+shift+r',
  'ctrl+tab',
  'ctrl+shift+tab',
  'alt+f4',
  'f5',
  'f11',
]

export const shortcutKeySchema = z
  .string()
  .min(1, 'Key combination is required')
  .refine(
    (value) => {
      const lower = value.toLowerCase()
      return !BROWSER_SHORTCUTS.includes(lower)
    },
    { message: 'This key combination is reserved by the browser' },
  )
  .refine(
    (value) => {
      const parts = value.toLowerCase().split('+')
      const modifiers = ['ctrl', 'alt', 'shift', 'meta']
      const nonModifiers = parts.filter((p) => !modifiers.includes(p))
      return nonModifiers.length === 1
    },
    { message: 'Invalid key combination' },
  )

export function isConflict(
  key: string,
  existingKeys: Record<string, string>,
  excludeId?: string,
): boolean {
  const lower = key.toLowerCase()
  return Object.entries(existingKeys).some(
    ([id, existingKey]) => id !== excludeId && existingKey.toLowerCase() === lower,
  )
}
