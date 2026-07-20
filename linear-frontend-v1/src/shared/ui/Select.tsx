import {
  type ButtonHTMLAttributes,
  forwardRef,
  useId,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  error?: string
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ options, value, onChange, placeholder, disabled, error, className, id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const listboxId = `${externalId ?? generatedId}-listbox`
    const errorId = error ? `${externalId ?? generatedId}-error` : undefined
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const listboxRef = useRef<HTMLUListElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const selectedOption = options.find((opt) => opt.value === value)
    const activeOption = activeIndex >= 0 ? options[activeIndex] : null

    const close = useCallback(() => {
      setOpen(false)
      setActiveIndex(-1)
      buttonRef.current?.focus()
    }, [])

    useEffect(() => {
      if (!open) return
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          close()
        }
      }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }, [open, close])

    useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (
          listboxRef.current &&
          !listboxRef.current.contains(e.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(e.target as Node)
        ) {
          close()
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open, close])

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (open && activeIndex >= 0) {
            onChange?.(options[activeIndex].value)
            close()
          } else {
            setOpen(true)
            const idx = value ? options.findIndex((o) => o.value === value) : 0
            setActiveIndex(Math.max(0, idx))
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (!open) {
            setOpen(true)
          }
          setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          if (!open) {
            setOpen(true)
          }
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
          break
        case 'Escape':
          e.preventDefault()
          close()
          break
      }
    }

    return (
      <div className="relative flex flex-col gap-1.5">
        <button
          ref={(node) => {
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
            buttonRef.current = node
          }}
          id={externalId}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeOption ? `${listboxId}-${activeOption.value}` : undefined}
          aria-haspopup="listbox"
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={handleKeyDown}
          className={cn(
            'inline-flex w-full items-center justify-between rounded-md border bg-surface px-3 py-2.5 text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt',
            error ? 'border-danger' : 'border-border',
            !selectedOption && 'text-text-muted',
            className,
          )}
          {...props}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder || 'Select...'}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-text-muted transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>

        {open && (
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-label="Options"
            className="absolute top-full z-50 mt-1 w-full rounded-md border border-border bg-surface py-1 shadow-lg"
          >
            {options.length === 0 && (
              <li className="px-3 py-2 text-sm text-text-muted">No options</li>
            )}
            {options.map((option, index) => {
              const isSelected = option.value === value
              const isActive = index === activeIndex
              return (
                <li
                  key={option.value}
                  id={`${listboxId}-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange?.(option.value)
                    close()
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    'cursor-pointer px-3 py-2 text-sm transition-colors',
                    isActive && 'bg-surface-alt',
                    isSelected && 'font-medium text-primary',
                    !isSelected && 'text-text',
                  )}
                >
                  {option.label}
                </li>
              )
            })}
          </ul>
        )}

        {error && (
          <span
            id={errorId}
            className="text-sm text-danger"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
