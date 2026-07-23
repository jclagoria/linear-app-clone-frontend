import { Modal } from '@/shared/ui/Modal'
import { IssueForm } from './IssueForm'
import { useToastStore } from '@/shared/stores/toastStore'
import { isBusinessRuleError } from '@/shared/lib/api-client/errors'
import type { Issue } from '../model/types'
import type { IssueFormSchema } from '../model/validation'

interface IssueFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  issue?: Issue
  disabled?: boolean
  disabledMessage?: string
  onClose: () => void
  onSubmit: (data: IssueFormSchema) => Promise<boolean | void>
}

export function IssueFormModal({
  isOpen,
  mode,
  issue,
  disabled = false,
  disabledMessage,
  onClose,
  onSubmit,
}: IssueFormModalProps) {
  const addToast = useToastStore((s) => s.addToast)

  const handleSubmit = async (data: IssueFormSchema) => {
    try {
      const result = await onSubmit(data)
      if (result === false) {
        return
      }
      const isAssigneeOnly =
        issue &&
        result === true &&
        issue.title === data.title &&
        issue.description === (data.description || '') &&
        issue.status === data.status &&
        issue.priority === data.priority &&
        JSON.stringify(issue.labels) === JSON.stringify(data.labels)

      addToast({
        title:
          mode === 'create'
            ? 'Issue created'
            : isAssigneeOnly
              ? 'Assignee updated'
              : 'Issue updated',
        variant: 'success',
        duration: 3000,
      })
      onClose()
    } catch (err) {
      if (isBusinessRuleError(err)) {
        return
      }
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
      {disabled && disabledMessage && (
        <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800" role="alert">
          {disabledMessage}
        </div>
      )}
      <IssueForm
        mode={mode}
        issue={issue}
        onSubmit={handleSubmit}
        onCancel={onClose}
        disabled={disabled}
      />
    </Modal>
  )
}
