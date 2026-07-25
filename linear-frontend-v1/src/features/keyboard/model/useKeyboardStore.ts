import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { shortcuts, type ShortcutContext } from './shortcuts'
import { handleKeyInSequence, resetSequence, isInSequence } from './keySequenceMatcher'

export interface ShortcutCustomization {
  [shortcutId: string]: string
}

interface KeyboardState {
  context: ShortcutContext
  selectedIssueId: string | null
  customizations: ShortcutCustomization
  isHelpModalOpen: boolean
  pendingSequence: string[]

  setContext: (context: ShortcutContext) => void
  setSelectedIssue: (issueId: string | null) => void
  updateCustomization: (shortcutId: string, keys: string) => void
  resetCustomizations: () => void
  setHelpModalOpen: (isOpen: boolean) => void
  handleKeyDown: (e: KeyboardEvent) => void
}

const STORAGE_KEY = 'keyboard-shortcuts-customizations'

function loadCustomizations(): ShortcutCustomization {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveCustomizations(customizations: ShortcutCustomization): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customizations))
  } catch {
    console.error('Failed to save keyboard customizations')
  }
}

function getKeyFromEvent(e: KeyboardEvent): string {
  const parts: string[] = []
  if (e.ctrlKey || e.metaKey) parts.push('Ctrl')
  if (e.altKey) parts.push('Alt')
  if (e.shiftKey) parts.push('Shift')

  const key = e.key.toLowerCase()
  if (!['ctrl', 'alt', 'shift', 'meta', 'control'].includes(key)) {
    parts.push(key)
  }

  return parts.join('+')
}

function isBrowserShortcut(key: string): boolean {
  const browserShortcuts = [
    'Ctrl+s',
    'Ctrl+w',
    'Ctrl+t',
    'Ctrl+n',
    'Ctrl+r',
    'Ctrl+shift+r',
    'Ctrl+tab',
    'Ctrl+shift+tab',
    'Alt+f4',
    'F5',
    'F11',
  ]
  return browserShortcuts.includes(key)
}

function findMatchingShortcut(
  key: string,
  context: ShortcutContext,
  customizations: ShortcutCustomization,
): { shortcut: (typeof shortcuts)[0]; keys: string } | null {
  const activeShortcuts = shortcuts.filter((s) => s.contexts.includes(context))

  for (const shortcut of activeShortcuts) {
    const expectedKeys = customizations[shortcut.id] ?? shortcut.keys
    if (key.toLowerCase() === expectedKeys.toLowerCase()) {
      return { shortcut, keys: expectedKeys }
    }
  }

  return null
}

export const useKeyboardStore = create<KeyboardState>()(
  devtools(
    (set, get) => ({
      context: 'global',
      selectedIssueId: null,
      customizations: loadCustomizations(),
      isHelpModalOpen: false,
      pendingSequence: [],

      setContext: (context) => set({ context }),

      setSelectedIssue: (issueId) => set({ selectedIssueId: issueId }),

      updateCustomization: (shortcutId, keys) => {
        const { customizations } = get()
        const newCustomizations = { ...customizations, [shortcutId]: keys }
        saveCustomizations(newCustomizations)
        set({ customizations: newCustomizations })
      },

      resetCustomizations: () => {
        saveCustomizations({})
        set({ customizations: {} })
      },

      setHelpModalOpen: (isOpen) => set({ isHelpModalOpen: isOpen }),

      handleKeyDown: (e) => {
        const { context, customizations, isHelpModalOpen } = get()

        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
          e.preventDefault()
          set({ isHelpModalOpen: !isHelpModalOpen })
          return
        }

        if (e.key === 'Escape') {
          if (isHelpModalOpen) {
            set({ isHelpModalOpen: false })
            return
          }
          resetSequence()
          set({ pendingSequence: [] })
          return
        }

        const sequences = shortcuts
          .filter((s) => s.sequence && s.contexts.includes(context))
          .map((s) => ({ keys: s.sequence!, action: s.action }))

        if (sequences.length > 0) {
          const result = handleKeyInSequence(e.key, sequences)
          if (result.action) {
            e.preventDefault()
            executeAction(result.action, get().selectedIssueId)
            return
          }
          if (isInSequence()) {
            e.preventDefault()
            set({ pendingSequence: [...getCurrentSequence()] })
            return
          }
        }

        const key = getKeyFromEvent(e)
        if (isBrowserShortcut(key)) return

        const match = findMatchingShortcut(key, context, customizations)
        if (match) {
          e.preventDefault()
          executeAction(match.shortcut.action, get().selectedIssueId)
        }
      },
    }),
    { name: 'keyboard-store' },
  ),
)

function executeAction(action: string, selectedIssueId: string | null): void {
  const event = new CustomEvent('keyboard-shortcut', {
    detail: { action, selectedIssueId },
  })
  window.dispatchEvent(event)
}
