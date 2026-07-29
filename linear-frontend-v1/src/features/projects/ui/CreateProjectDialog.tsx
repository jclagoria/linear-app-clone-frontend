import { useState } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { ProjectForm } from './ProjectForm'
import { useToastStore } from '@/shared/stores/toastStore'
import { createProject } from '@/shared/api/projects'
import { useProjectsStore } from '@/features/realtime/lib/project-store'
import {
  isBusinessRuleError,
  isForbiddenError,
} from '@/shared/lib/api-client/errors'
import type { CreateProjectFormSchema } from '../model/validation'

interface CreateProjectDialogProps {
  teamId: string
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectDialog({
  teamId,
  isOpen,
  onClose,
}: CreateProjectDialogProps) {
  const addToast = useToastStore((s) => s.addToast)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleSubmit = async (data: CreateProjectFormSchema) => {
    setServerError(null)
    try {
      const project = await createProject(data)
      useProjectsStore.getState().addProject(project)
      addToast({
        title: 'Project created',
        variant: 'success',
        duration: 3000,
      })
      onClose()
    } catch (err) {
      if (isBusinessRuleError(err)) {
        setServerError(err.message)
        return
      }
      if (isForbiddenError(err)) {
        addToast({
          title: "You don't have permission to create projects",
          variant: 'error',
          duration: 4000,
        })
        return
      }
      addToast({
        title: 'Failed to create project',
        variant: 'error',
        duration: 4000,
      })
    }
  }

  const handleCancel = () => {
    setServerError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="New Project"
    >
      <ProjectForm
        teamId={teamId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        serverError={serverError}
      />
    </Modal>
  )
}
