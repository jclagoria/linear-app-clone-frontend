import { type InputHTMLAttributes, useId, forwardRef } from 'react'
import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form'
import { cn } from '@/shared/lib/utils'

interface TextFieldProps<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  hint?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps<FieldValues>>(
  function TextField({
    name,
    control,
    label,
    hint,
    disabled,
    ...props
  }, ref) {
    const generatedId = useId()

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const inputId = generatedId
          const errorId = fieldState.error ? `${inputId}-error` : undefined
          const hintId = hint && !fieldState.error ? `${inputId}-hint` : undefined

          return (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={inputId}
                className="text-sm font-medium text-text"
              >
                {label}
              </label>
              <input
                {...field}
                {...props}
                ref={ref}
                id={inputId}
                aria-invalid={fieldState.error ? true : undefined}
                aria-describedby={errorId ?? hintId}
                disabled={disabled}
                className={cn(
                  'rounded-md border bg-surface px-3 py-2.5 text-sm text-text transition-colors',
                  'placeholder:text-text-muted',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt',
                  fieldState.error
                    ? 'border-error-text focus:ring-error-text'
                    : 'border-border',
                )}
              />
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
            </div>
          )
        }}
      />
    )
  }
)
