import { useState } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDeleteDialogProps {
  isOpen: boolean
  issueTitle: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function ConfirmDeleteDialog({
  isOpen,
  issueTitle,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onConfirm()
    } catch {
      setError('Failed to delete issue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete issue"
      className="max-w-md"
    >
      <div className="space-y-4">
        {error && <ErrorBanner message={error} type="server" />}

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10">
            <AlertTriangle className="h-5 w-5 text-danger" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-text">
              Are you sure you want to delete this issue?
            </p>
            <p className="mt-1 text-sm text-text-muted">
              &ldquo;{issueTitle}&rdquo;
            </p>
            <p className="mt-2 text-sm text-text-muted">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={isSubmitting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
