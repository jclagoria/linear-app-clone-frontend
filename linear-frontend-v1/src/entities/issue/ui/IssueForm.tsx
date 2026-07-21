import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/shared/ui/TextInput'
import { Textarea } from '@/shared/ui/Textarea'
import { Select } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { issueFormSchema, type IssueFormSchema } from '../model/validation'
import type { Issue } from '../model/types'

interface IssueFormProps {
  mode: 'create' | 'edit'
  issue?: Issue
  onSubmit: (data: IssueFormSchema) => Promise<void>
  onCancel: () => void
}

const statusOptions = [
  { label: 'Todo', value: 'Todo' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' },
  { label: 'Cancelled', value: 'Cancelled' },
]

const priorityOptions = [
  { label: 'No priority', value: '0' },
  { label: 'Urgent', value: '1' },
  { label: 'High', value: '2' },
  { label: 'Medium', value: '3' },
  { label: 'Low', value: '4' },
]

export function IssueForm({ mode, issue, onSubmit, onCancel }: IssueFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<IssueFormSchema>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      title: issue?.title ?? '',
      description: issue?.description ?? '',
      status: issue?.status ?? 'Todo',
      priority: issue?.priority ?? 0,
      assigneeId: issue?.assigneeId ?? null,
      labels: issue?.labels ?? [],
    },
  })

  const selectedStatus = watch('status')
  const selectedPriority = String(watch('priority'))
  const submitError = isSubmitSuccessful ? null : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {submitError && (
        <ErrorBanner
          message="Failed to save issue. Please try again."
          type="server"
        />
      )}

      <TextInput
        label="Title"
        placeholder="Enter issue title"
        error={errors.title?.message}
        {...register('title')}
        autoFocus
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-sm font-medium text-text"
        >
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Optional description"
          error={errors.description?.message}
          {...register('description')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text">Status</label>
        <Select
          value={selectedStatus}
          onChange={(value) => setValue('status', value)}
          options={statusOptions}
          placeholder="Select status"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text">Priority</label>
        <Select
          value={selectedPriority}
          onChange={(value) => setValue('priority', Number(value))}
          options={priorityOptions}
          placeholder="Select priority"
        />
      </div>

      {errors.title && (
        <span className="text-sm text-danger" role="alert">
          {errors.title.message}
        </span>
      )}

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
          {mode === 'create' ? 'Create issue' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
