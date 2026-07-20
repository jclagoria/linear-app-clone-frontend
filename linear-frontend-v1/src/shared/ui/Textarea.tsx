import { type TextareaHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/shared/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, maxLength, className, id: externalId, value, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = externalId ?? generatedId
    const errorId = error ? `${textareaId}-error` : undefined
    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'rounded-md border bg-surface px-3 py-2.5 text-sm text-text transition-colors',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt',
            'min-h-[80px] resize-y',
            error
              ? 'border-danger focus:ring-danger'
              : 'border-border',
            className,
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          {error && (
            <span
              id={errorId}
              className="text-sm text-danger"
              role="alert"
            >
              {error}
            </span>
          )}
          {maxLength && (
            <span className={cn(
              'ml-auto text-xs',
              charCount >= maxLength ? 'text-danger' : 'text-text-muted',
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
