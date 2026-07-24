import { useForm, type UseFormProps, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ZodSchema } from 'zod'

interface UseFormFormikOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  schema: ZodSchema<T>
  onSubmit: (data: T) => Promise<void> | void
}

interface UseFormFormikReturn<T extends FieldValues> {
  control: ReturnType<typeof useForm<T>>['control']
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  formState: {
    errors: ReturnType<typeof useForm<T>>['formState']['errors']
    isSubmitting: boolean
    isValid: boolean
    touchedFields: ReturnType<typeof useForm<T>>['formState']['touchedFields']
  }
  reset: () => void
}

export function useFormFormik<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
}: UseFormFormikOptions<T>): UseFormFormikReturn<T> {
  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState,
    reset,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  })

  const handleSubmit = async (e?: React.BaseSyntheticEvent) => {
    try {
      await rhfHandleSubmit(async (data) => {
        await onSubmit(data)
      })(e)
    } catch {
      // Error already handled by react-hook-form's onError callback
    }
  }

  return {
    control,
    handleSubmit,
    formState: {
      errors: formState.errors,
      isSubmitting: formState.isSubmitting,
      isValid: formState.isValid,
      touchedFields: formState.touchedFields,
    },
    reset,
  }
}
