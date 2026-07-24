import { useId, forwardRef } from 'react'
import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form'
import { Select } from '@/shared/ui/Select'

interface SelectOption {
  label: string
  value: string
}

interface SelectFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  options: SelectOption[]
  placeholder?: string
  hint?: string
  disabled?: boolean
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps<FieldValues>>(
  function SelectField({
    name,
    control,
    label,
    options,
    placeholder,
    hint,
    disabled,
  }, ref) {
    const generatedId = useId()

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const hintId = hint && !fieldState.error ? `${generatedId}-hint` : undefined

          return (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={generatedId}
                className="text-sm font-medium text-text"
              >
                {label}
              </label>
              <Select
                ref={ref}
                id={generatedId}
                options={options}
                value={field.value}
                onChange={field.onChange}
                placeholder={placeholder}
                disabled={disabled}
                error={fieldState.error?.message}
                aria-describedby={hintId}
              />
              {fieldState.error && (
                <span
                  id={`${generatedId}-error`}
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
