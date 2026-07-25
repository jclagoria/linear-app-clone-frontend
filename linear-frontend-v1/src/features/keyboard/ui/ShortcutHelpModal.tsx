import { useState, useMemo } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { Kbd } from '@/shared/ui/Kbd'
import { shortcuts, type Shortcut } from '../model/shortcuts'
import { useKeyboardStore } from '../model/useKeyboardStore'

interface ShortcutHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

type CategoryFilter = 'All' | 'Global' | 'List' | 'Issue'

export function ShortcutHelpModal({ isOpen, onClose }: ShortcutHelpModalProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All')
  const context = useKeyboardStore((s) => s.context)
  const customizations = useKeyboardStore((s) => s.customizations)

  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter((shortcut) => {
      if (activeFilter !== 'All' && shortcut.category !== activeFilter) return false
      return shortcut.contexts.includes(context)
    })
  }, [activeFilter, context])

  const groupedShortcuts = useMemo(() => {
    const groups: Record<string, Shortcut[]> = {}
    for (const shortcut of filteredShortcuts) {
      if (!groups[shortcut.category]) {
        groups[shortcut.category] = []
      }
      groups[shortcut.category].push(shortcut)
    }
    return groups
  }, [filteredShortcuts])

  const filters: CategoryFilter[] = ['All', 'Global', 'List', 'Issue']

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts">
      <div className="space-y-4">
        <div className="flex gap-2" role="tablist" aria-label="Filter shortcuts by category">
          {filters.map((filter) => (
            <button
              key={filter}
              role="tab"
              aria-selected={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-text-inverse'
                  : 'bg-surface-alt text-text-muted hover:text-text'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-text-muted mb-2">{category}</h3>
              <div className="space-y-1">
                {categoryShortcuts.map((shortcut) => (
                  <div
                    key={shortcut.id}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-surface-alt"
                  >
                    <span className="text-sm text-text">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {formatKeys(customizations[shortcut.id] ?? shortcut.keys)
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
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
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
