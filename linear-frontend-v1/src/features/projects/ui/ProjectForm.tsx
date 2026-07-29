import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/shared/ui/TextInput'
import { Textarea } from '@/shared/ui/Textarea'
import { Button } from '@/shared/ui/Button'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import {
  createProjectSchema,
  type CreateProjectFormSchema,
} from '../model/validation'

interface ProjectFormProps {
  teamId: string
  onSubmit: (data: CreateProjectFormSchema) => Promise<boolean | void>
  onCancel: () => void
  serverError?: string | null
}

export function ProjectForm({
  teamId,
  onSubmit,
  onCancel,
  serverError,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      teamId,
      name: '',
      description: '',
      startDate: '',
      targetDate: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="hidden" {...register('teamId')} />

      {serverError && (
        <ErrorBanner message={serverError} type="server" />
      )}

      <TextInput
        label="Name"
        placeholder="Enter project name"
        error={errors.name?.message}
        {...register('name')}
        autoFocus
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-text">
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Optional description"
          error={errors.description?.message}
          {...register('description')}
        />
      </div>

      <TextInput
        label="Start date"
        type="date"
        error={errors.startDate?.message}
        {...register('startDate')}
      />

      <TextInput
        label="Target date"
        type="date"
        error={errors.targetDate?.message}
        {...register('targetDate')}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Create Project
        </Button>
      </div>
    </form>
  )
}
