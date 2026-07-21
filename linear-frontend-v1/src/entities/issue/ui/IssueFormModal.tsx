import { Modal } from '@/shared/ui/Modal'
import { IssueForm } from './IssueForm'
import { useToastStore } from '@/shared/stores/toastStore'
import type { Issue } from '../model/types'
import type { IssueFormSchema } from '../model/validation'

interface IssueFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  issue?: Issue
  onClose: () => void
  onSubmit: (data: IssueFormSchema) => Promise<void>
}

export function IssueFormModal({
  isOpen,
  mode,
  issue,
  onClose,
  onSubmit,
}: IssueFormModalProps) {
  const addToast = useToastStore((s) => s.addToast)

  const handleSubmit = async (data: IssueFormSchema) => {
    try {
      await onSubmit(data)
      addToast({
        title: mode === 'create' ? 'Issue created' : 'Issue updated',
        variant: 'success',
        duration: 3000,
      })
      onClose()
    } catch {
      addToast({
        title: 'Failed to save issue',
        variant: 'error',
        duration: 4000,
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'New Issue' : 'Edit Issue'}
    >
      <IssueForm
        mode={mode}
        issue={issue}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
