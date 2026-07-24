import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { TextField } from '@/features/form/ui/TextField'
import { TextareaField } from '@/features/form/ui/TextareaField'
import { SubmitButton } from '@/features/form/ui/SubmitButton'
import { useFormFormik } from '@/features/form/lib/useFormFormik'
import { projectSettingsSchema, type ProjectSettingsFormData } from '@/features/form/model'

export function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { control, handleSubmit, formState } = useFormFormik<ProjectSettingsFormData>({
    schema: projectSettingsSchema,
    defaultValues: {
      name: 'Project Alpha',
      slug: 'project-alpha',
      description: 'A sample project description.',
    },
    onSubmit: async (data) => {
      console.log('Updating project settings:', id, data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitSuccess(true)
    },
  })

  if (submitSuccess) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <div className="rounded-md bg-green-50 p-4 text-green-800" role="status">
          Project settings updated successfully!
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Project Settings</h1>
      <form onSubmit={handleSubmit} aria-label="Project settings" className="flex flex-col gap-4" noValidate>
        <TextField
          name="name"
          control={control}
          label="Project Name"
          placeholder="Enter project name"
        />
        <TextField
          name="slug"
          control={control}
          label="Project Slug"
          placeholder="project-slug"
          hint="Lowercase letters, numbers, and hyphens only"
        />
        <TextareaField
          name="description"
          control={control}
          label="Description"
          rows={4}
          maxLength={500}
          placeholder="Brief project description..."
        />
        <SubmitButton isSubmitting={formState.isSubmitting}>
          Save Settings
        </SubmitButton>
      </form>
    </div>
  )
}
