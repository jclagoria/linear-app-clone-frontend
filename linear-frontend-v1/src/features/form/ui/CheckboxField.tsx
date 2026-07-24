import { useId, forwardRef } from 'react'
import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form'
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

interface CheckboxFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  description?: string
  disabled?: boolean
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps<FieldValues>>(
  function CheckboxField({
    name,
    control,
    label,
    description,
    disabled,
  }, ref) {
    const generatedId = useId()

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const descriptionId = description ? `${generatedId}-desc` : undefined
          const errorId = fieldState.error ? `${generatedId}-error` : undefined

          return (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={generatedId}
                className={cn(
                  'inline-flex items-start gap-2',
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                )}
              >
                <span className="relative flex items-center justify-center">
                  <input
                    {...field}
                    ref={ref}
                    id={generatedId}
                    type="checkbox"
                    checked={field.value ?? false}
                    disabled={disabled}
                    aria-invalid={fieldState.error ? true : undefined}
                    aria-describedby={descriptionId ?? errorId}
                    className={cn(
                      checkboxVariants({ error: !!fieldState.error }),
                      'appearance-none',
                    )}
                  />
                  {field.value && (
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
                </span>
                <div className="flex flex-col">
                  <span className="text-sm text-text">{label}</span>
                  {description && (
                    <span id={descriptionId} className="text-xs text-text-muted">
                      {description}
                    </span>
                  )}
                </div>
              </label>
              {fieldState.error && (
                <span
                  id={errorId}
                  className="text-sm text-error-text"
                  role="alert"
                >
                  {fieldState.error.message}
                </span>
              )}
            </div>
          )
        }}
      />
    )
  }
)
