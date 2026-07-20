import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/shared/lib/utils'
import { cva } from 'class-variance-authority'

const checkboxVariants = cva(
  'h-4 w-4 shrink-0 rounded border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'border-danger',
        false: 'border-border',
      },
    },
    defaultVariants: { error: false },
  },
)

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked'> {
  checked?: boolean
  indeterminate?: boolean
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked = false, indeterminate, disabled, label, className, id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const inputId = externalId ?? generatedId

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-center gap-2',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        )}
      >
        <span className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            aria-checked={indeterminate ? 'mixed' : checked}
            className={cn(
              checkboxVariants({ error: false }),
              'appearance-none',
              className,
            )}
            {...props}
          />
          {checked && !indeterminate && (
            <svg
              className="pointer-events-none absolute h-3 w-3 text-primary"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 6l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {indeterminate && (
            <svg
              className="pointer-events-none absolute h-3 w-3 text-primary"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 6h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
        {label && (
          <span className="text-sm text-text">{label}</span>
        )}
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
