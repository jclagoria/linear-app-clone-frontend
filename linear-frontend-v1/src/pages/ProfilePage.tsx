import { useState } from 'react'
import { TextField } from '@/features/form/ui/TextField'
import { TextareaField } from '@/features/form/ui/TextareaField'
import { SubmitButton } from '@/features/form/ui/SubmitButton'
import { useFormFormik } from '@/features/form/lib/useFormFormik'
import { profileSchema, type ProfileFormData } from '@/features/form/model'

export function ProfilePage() {
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { control, handleSubmit, formState } = useFormFormik<ProfileFormData>({
    schema: profileSchema,
    defaultValues: {
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Software developer passionate about building great products.',
    },
    onSubmit: async (data) => {
      console.log('Updating profile:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitSuccess(true)
    },
  })

  if (submitSuccess) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <div className="rounded-md bg-green-50 p-4 text-green-800" role="status">
          Profile updated successfully!
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Profile</h1>
      <form onSubmit={handleSubmit} aria-label="Profile settings" className="flex flex-col gap-4" noValidate>
        <TextField
          name="name"
          control={control}
          label="Name"
          placeholder="Your name"
        />
        <TextField
          name="email"
          control={control}
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <TextareaField
          name="bio"
          control={control}
          label="Bio"
          rows={4}
          maxLength={500}
          placeholder="Tell us about yourself..."
        />
        <SubmitButton isSubmitting={formState.isSubmitting}>
          Save Profile
        </SubmitButton>
      </form>
    </div>
  )
}
