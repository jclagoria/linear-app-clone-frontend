export type ShortcutContext = 'global' | 'list' | 'detail'

export interface Shortcut {
  id: string
  category: 'Global' | 'List' | 'Issue'
  keys: string
  sequence?: string[]
  action: string
  contexts: ShortcutContext[]
  description: string
}

export const shortcuts: Shortcut[] = [
  {
    id: 'create-issue',
    category: 'Global',
    keys: 'C',
    action: 'create-issue',
    contexts: ['global'],
    description: 'Create new issue',
  },
  {
    id: 'go-to-inbox',
    category: 'Global',
    keys: 'G then I',
    sequence: ['g', 'i'],
    action: 'go-to-inbox',
    contexts: ['global'],
    description: 'Go to inbox',
  },
  {
    id: 'go-to-projects',
    category: 'Global',
    keys: 'G then P',
    sequence: ['g', 'p'],
    action: 'go-to-projects',
    contexts: ['global'],
    description: 'Go to projects',
  },
  {
    id: 'go-to-cycles',
    category: 'Global',
    keys: 'G then C',
    sequence: ['g', 'c'],
    action: 'go-to-cycles',
    contexts: ['global'],
    description: 'Go to cycles',
  },
  {
    id: 'search',
    category: 'Global',
    keys: '/',
    action: 'search',
    contexts: ['global'],
    description: 'Open search',
  },
  {
    id: 'close-modal',
    category: 'Global',
    keys: 'Escape',
    action: 'close-modal',
    contexts: ['global', 'list', 'detail'],
    description: 'Close modal or deselect',
  },
  {
    id: 'show-help',
    category: 'Global',
    keys: '?',
    action: 'show-help',
    contexts: ['global', 'list', 'detail'],
    description: 'Show keyboard shortcuts',
  },
  {
    id: 'navigate-down',
    category: 'List',
    keys: 'J',
    action: 'navigate-down',
    contexts: ['list'],
    description: 'Move selection down',
  },
  {
    id: 'navigate-up',
    category: 'List',
    keys: 'K',
    action: 'navigate-up',
    contexts: ['list'],
    description: 'Move selection up',
  },
  {
    id: 'open-issue',
    category: 'List',
    keys: 'Enter',
    action: 'open-issue',
    contexts: ['list'],
    description: 'Open selected issue',
  },
  {
    id: 'set-status',
    category: 'Issue',
    keys: 'S',
    action: 'set-status',
    contexts: ['list', 'detail'],
    description: 'Change issue status',
  },
  {
    id: 'assign',
    category: 'Issue',
    keys: 'A',
    action: 'assign',
    contexts: ['list', 'detail'],
    description: 'Assign issue',
  },
  {
    id: 'set-label',
    category: 'Issue',
    keys: 'L',
    action: 'set-label',
    contexts: ['list', 'detail'],
    description: 'Set issue label',
  },
  {
    id: 'edit-issue',
    category: 'Issue',
    keys: 'E',
    action: 'edit-issue',
    contexts: ['list', 'detail'],
    description: 'Edit issue',
  },
  {
    id: 'delete-issue',
    category: 'Issue',
    keys: 'Delete',
    action: 'delete-issue',
    contexts: ['list', 'detail'],
    description: 'Delete issue',
  },
]

export function getShortcutsByContext(context: ShortcutContext): Shortcut[] {
  return shortcuts.filter((s) => s.contexts.includes(context))
}

export function getShortcutById(id: string): Shortcut | undefined {
  return shortcuts.find((s) => s.id === id)
}
