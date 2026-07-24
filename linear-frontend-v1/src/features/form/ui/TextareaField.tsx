import { useId, forwardRef } from 'react'
import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form'
import { cn } from '@/shared/lib/utils'

interface TextareaFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  rows?: number
  maxLength?: number
  hint?: string
  disabled?: boolean
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps<FieldValues>>(
  function TextareaField({
    name,
    control,
    label,
    rows = 4,
    maxLength,
    hint,
    disabled,
  }, ref) {
    const generatedId = useId()

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const textareaId = generatedId
          const errorId = fieldState.error ? `${textareaId}-error` : undefined
          const hintId = hint && !fieldState.error ? `${textareaId}-hint` : undefined
          const charCount = typeof field.value === 'string' ? field.value.length : 0

          return (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={textareaId}
                className="text-sm font-medium text-text"
              >
                {label}
              </label>
              <textarea
                {...field}
                ref={ref}
                id={textareaId}
                rows={rows}
                maxLength={maxLength}
                disabled={disabled}
                aria-invalid={fieldState.error ? true : undefined}
                aria-describedby={errorId ?? hintId}
                className={cn(
                  'rounded-md border bg-surface px-3 py-2.5 text-sm text-text transition-colors',
                  'placeholder:text-text-muted',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt',
                  'min-h-[80px] resize-y',
                  fieldState.error
                    ? 'border-error-text focus:ring-error-text'
                    : 'border-border',
                )}
              />
              <div className="flex items-center justify-between">
                {fieldState.error && (
                  <span
                    id={errorId}
                    className="text-sm text-error-text"
                    role="alert"
                  >
                    {fieldState.error.message}
                  </span>
                )}
                {hint && !fieldState.error && (
                  <span id={hintId} className="text-sm text-text-muted">
                    {hint}
                  </span>
                )}
                {maxLength && (
                  <span
                    className={cn(
                      'ml-auto text-xs',
                      charCount >= maxLength ? 'text-error-text' : 'text-text-muted',
                    )}
                  >
                    {charCount}/{maxLength}
                  </span>
                )}
              </div>
            </div>
          )
        }}
      />
    )
  }
)
