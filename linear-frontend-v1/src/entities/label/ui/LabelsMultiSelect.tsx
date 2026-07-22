import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react'
import { X, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useLabelDefinitionsStore } from '../model/store'

interface LabelsMultiSelectProps {
  selected: string[]
  onChange: (selected: string[]) => void
  error?: string
}

export function LabelsMultiSelect({
  selected,
  onChange,
  error,
}: LabelsMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const labels = useLabelDefinitionsStore((s) => s.labels)
  const fetchLabelDefinitions = useLabelDefinitionsStore(
    (s) => s.fetchLabelDefinitions,
  )

  useEffect(() => {
    if (isOpen) {
      fetchLabelDefinitions()
      requestAnimationFrame(() => searchRef.current?.focus())
    } else {
      setSearch('')
    }
  }, [isOpen, fetchLabelDefinitions])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () =>
        document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
      }
    },
    [],
  )

  const selectedLabels = useMemo(
    () => labels.filter((l) => selected.includes(l.id)),
    [labels, selected],
  )

  const availableLabels = useMemo(
    () => labels.filter((l) => !selected.includes(l.id)),
    [labels, selected],
  )

  const filteredAvailable = useMemo(() => {
    if (!search.trim()) return availableLabels
    const q = search.toLowerCase()
    return availableLabels.filter((l) => l.name.toLowerCase().includes(q))
  }, [availableLabels, search])

  const toggleLabel = useCallback(
    (labelId: string) => {
      const next = selected.includes(labelId)
        ? selected.filter((id) => id !== labelId)
        : [...selected, labelId]
      onChange(next)
    },
    [selected, onChange],
  )

  const removeLabel = useCallback(
    (labelId: string) => {
      onChange(selected.filter((id) => id !== labelId))
    },
    [selected, onChange],
  )

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text">Labels</label>

      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'flex min-h-[44px] flex-wrap items-center gap-1 rounded-md border bg-surface px-3 py-1.5 text-sm transition-colors',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary',
          error ? 'border-danger' : 'border-border',
        )}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {selectedLabels.map((label) => (
          <span
            key={label.id}
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${label.color}20`,
              color: label.color,
            }}
          >
            {label.name}
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeLabel(label.id)
              }}
              aria-label={`Remove ${label.name} label`}
              className="rounded-full p-0.5 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
        <span className="flex-1" />
        <ChevronDown
          className={cn(
            'h-4 w-4 text-text-muted transition-transform',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </div>

      {error && (
        <span className="text-sm text-danger" role="alert">
          {error}
        </span>
      )}

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-border bg-surface shadow-lg">
          <div className="border-b border-border p-2">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search labels..."
              aria-label="Search labels"
              className="w-full rounded-md border border-border bg-surface py-1.5 px-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault()
                  setIsOpen(false)
                }
              }}
            />
          </div>

          <div
            role="listbox"
            aria-multiselectable="true"
            className="max-h-48 overflow-y-auto p-1"
          >
            {filteredAvailable.length === 0 && (
              <div className="p-3 text-center text-sm text-text-muted">
                {search ? 'No labels match your search' : 'No labels available'}
              </div>
            )}

            {filteredAvailable.map((label) => (
              <button
                key={label.id}
                role="option"
                aria-selected={false}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLabel(label.id)
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-text hover:bg-surface-alt"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: label.color }}
                  aria-hidden="true"
                />
                <span className="flex-1 truncate">{label.name}</span>
                {selected.includes(label.id) && (
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
