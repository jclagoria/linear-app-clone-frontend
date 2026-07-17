import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/shared/lib/utils'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, className, id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const inputId = externalId ?? generatedId
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint && !error ? `${inputId}-hint` : undefined

    return (
      <div className="flex flex-col gap-1.5" role="group">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId ?? hintId}
          className={cn(
            'rounded-md border bg-surface px-3 py-2.5 text-sm text-text transition-colors',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt',
            error
              ? 'border-error-text focus:ring-error-text'
              : 'border-border',
            className,
          )}
          {...props}
        />
        {error && (
          <span
            id={errorId}
            className="text-sm text-error-text"
            role="alert"
          >
            {error}
          </span>
        )}
        {hint && !error && (
          <span id={hintId} className="text-sm text-text-muted">
            {hint}
          </span>
        )}
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
