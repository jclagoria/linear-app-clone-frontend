import { useState } from 'react'
import { TextField } from '@/features/form/ui/TextField'
import { TextareaField } from '@/features/form/ui/TextareaField'
import { SelectField } from '@/features/form/ui/SelectField'
import { SubmitButton } from '@/features/form/ui/SubmitButton'
import { useFormFormik } from '@/features/form/lib/useFormFormik'
import { createIssueSchema, type CreateIssueFormData } from '@/features/form/model'

const priorityOptions = [
  { label: 'None', value: 'none' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

const projectOptions = [
  { label: 'Project Alpha', value: 'project-alpha' },
  { label: 'Project Beta', value: 'project-beta' },
]

export function CreateIssuePage() {
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { control, handleSubmit, formState } = useFormFormik<CreateIssueFormData>({
    schema: createIssueSchema,
    defaultValues: {
      title: '',
      description: '',
      projectId: '',
      priority: '',
      assigneeId: '',
    },
    onSubmit: async (data) => {
      console.log('Creating issue:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitSuccess(true)
    },
  })

  if (submitSuccess) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <div className="rounded-md bg-green-50 p-4 text-green-800" role="status">
          Issue created successfully!
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Create Issue</h1>
      <form onSubmit={handleSubmit} aria-label="Create issue" className="flex flex-col gap-4" noValidate>
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
        <SubmitButton isSubmitting={formState.isSubmitting}>
          Create Issue
        </SubmitButton>
      </form>
    </div>
  )
}
