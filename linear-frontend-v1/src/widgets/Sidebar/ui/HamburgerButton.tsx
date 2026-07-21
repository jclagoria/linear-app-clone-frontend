import { forwardRef } from 'react'
import { Menu, X } from 'lucide-react'

interface HamburgerButtonProps {
  open: boolean
  onToggle: () => void
}

export const HamburgerButton = forwardRef<HTMLButtonElement, HamburgerButtonProps>(
  ({ open, onToggle }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? (
          <X className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Menu className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    )
  },
)

HamburgerButton.displayName = 'HamburgerButton'
