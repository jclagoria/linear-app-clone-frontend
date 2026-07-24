import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { TextField } from '@/features/form/ui/TextField'
import { TextareaField } from '@/features/form/ui/TextareaField'
import { SelectField } from '@/features/form/ui/SelectField'
import { SubmitButton } from '@/features/form/ui/SubmitButton'
import { useFormFormik } from '@/features/form/lib/useFormFormik'
import { editIssueSchema, type EditIssueFormData } from '@/features/form/model'

const priorityOptions = [
  { label: 'None', value: 'none' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

const statusOptions = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
  { label: 'Canceled', value: 'canceled' },
]

const projectOptions = [
  { label: 'Project Alpha', value: 'project-alpha' },
  { label: 'Project Beta', value: 'project-beta' },
]

export function EditIssuePage() {
  const { id } = useParams<{ id: string }>()
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { control, handleSubmit, formState } = useFormFormik<EditIssueFormData>({
    schema: editIssueSchema,
    defaultValues: {
      title: `Issue ${id}`,
      description: 'This is a sample issue description.',
      projectId: 'project-alpha',
      priority: 'medium',
      status: 'todo',
      assigneeId: '',
    },
    onSubmit: async (data) => {
      console.log('Updating issue:', id, data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitSuccess(true)
    },
  })

  if (submitSuccess) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <div className="rounded-md bg-green-50 p-4 text-green-800" role="status">
          Issue updated successfully!
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Edit Issue</h1>
      <form onSubmit={handleSubmit} aria-label="Edit issue" className="flex flex-col gap-4" noValidate>
        <TextField
          name="title"
          control={control}
          label="Title"
          placeholder="Issue title"
        />
        <TextareaField
          name="description"
          control={control}
          label="Description"
          rows={6}
          maxLength={5000}
          placeholder="Describe the issue..."
        />
        <SelectField
          name="projectId"
          control={control}
          label="Project"
          options={projectOptions}
          placeholder="Select a project"
        />
        <SelectField
          name="priority"
          control={control}
          label="Priority"
          options={priorityOptions}
          placeholder="Select priority"
        />
        <SelectField
          name="status"
          control={control}
          label="Status"
          options={statusOptions}
          placeholder="Select status"
        />
        <SubmitButton isSubmitting={formState.isSubmitting}>
          Update Issue
        </SubmitButton>
      </form>
    </div>
  )
}
