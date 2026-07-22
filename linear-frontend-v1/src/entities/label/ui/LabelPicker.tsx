import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react'
import { createPortal } from 'react-dom'
import { Search, Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useLabelDefinitionsStore } from '../model/store'
import type { Label } from '../model/types'

interface LabelPickerProps {
  selectedIds: string[]
  onSelect: (label: Label) => void
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
}

export function LabelPicker({
  selectedIds,
  onSelect,
  onClose,
  triggerRef,
}: LabelPickerProps) {
  const [search, setSearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const labels = useLabelDefinitionsStore((s) => s.labels)
  const isLoading = useLabelDefinitionsStore((s) => s.isLoading)
  const fetchLabelDefinitions = useLabelDefinitionsStore(
    (s) => s.fetchLabelDefinitions,
  )

  useEffect(() => {
    fetchLabelDefinitions()
  }, [fetchLabelDefinitions])

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return labels
    const q = search.toLowerCase()
    return labels.filter(
      (l) =>
        l.name.toLowerCase().includes(q) &&
        !selectedIds.includes(l.id),
    )
  }, [labels, search, selectedIds])

  useEffect(() => {
    setHighlightedIndex(0)
  }, [filtered.length])

  const handleSelect = useCallback(
    (label: Label) => {
      onSelect(label)
    },
    [onSelect],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0,
        )
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1,
        )
        return
      }

      if (e.key === 'Enter' && filtered[highlightedIndex]) {
        e.preventDefault()
        handleSelect(filtered[highlightedIndex])
        return
      }
    },
    [onClose, filtered, highlightedIndex, handleSelect],
  )

  const triggerRect = triggerRef.current?.getBoundingClientRect()

  return createPortal(
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Select a label"
      className="fixed z-50 w-64 rounded-lg border border-border bg-surface shadow-lg"
      style={{
        top: triggerRect ? triggerRect.bottom + 4 : 0,
        left: triggerRect ? Math.max(8, triggerRect.left) : 0,
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="border-b border-border p-2">
        <div className="relative">
          <Search
            className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search labels..."
            aria-label="Search labels"
            className="w-full rounded-md border border-border bg-surface py-1.5 pl-8 pr-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div
        ref={listRef}
        className="max-h-48 overflow-y-auto p-1"
        role="listbox"
      >
        {isLoading && labels.length === 0 && (
          <div className="p-3 text-center text-sm text-text-muted">
            Loading labels...
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="p-3 text-center text-sm text-text-muted">
            {search ? 'No labels match your search' : 'No labels available'}
          </div>
        )}

        {filtered.map((label, index) => (
          <button
            key={label.id}
            role="option"
            aria-selected={selectedIds.includes(label.id)}
            onClick={() => handleSelect(label)}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
              index === highlightedIndex
                ? 'bg-primary/10 text-text'
                : 'text-text hover:bg-surface-alt',
            )}
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: label.color }}
              aria-hidden="true"
            />
            <span className="flex-1 truncate">{label.name}</span>
            {selectedIds.includes(label.id) && (
              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    </div>,
    document.body,
  )
}
