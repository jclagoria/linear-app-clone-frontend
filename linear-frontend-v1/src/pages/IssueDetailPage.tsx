import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useToastStore } from '@/shared/stores/toastStore'
import { isBusinessRuleError } from '@/shared/lib/api-client/errors'
import { IssueDetail } from '@/entities/issue/ui/IssueDetail'
import { IssueFormModal } from '@/entities/issue/ui/IssueFormModal'
import { ConfirmDeleteDialog } from '@/entities/issue/ui/ConfirmDeleteDialog'
import { selectIssueById } from '@/entities/issue/model/selectors'
import { updateIssue, deleteIssue, fetchComments } from '@/entities/issue/api'
import type { Comment } from '@/entities/issue/model/types'
import type { IssueFormSchema } from '@/entities/issue/model/validation'

export function IssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const issues = useIssuesStore((s) => s.issues)
  const isLoading = useIssuesStore((s) => s.isLoading)
  const error = useIssuesStore((s) => s.error)
  const loadIssues = useIssuesStore((s) => s.loadIssues)
  const updateIssueInStore = useIssuesStore((s) => s.updateIssue)
  const removeIssue = useIssuesStore((s) => s.removeIssue)
  const selectIssue = useIssuesStore((s) => s.selectIssue)
  const assignIssue = useIssuesStore((s) => s.assignIssue)
  const addToast = useToastStore((s) => s.addToast)

  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState<string | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [statusChanging, setStatusChanging] = useState(false)

  const issue = selectIssueById(issues, id ?? null)

  useEffect(() => {
    if (id) {
      selectIssue(id)
    }
    return () => {
      useIssuesStore.getState().deselectIssue()
    }
  }, [id, selectIssue])

  useEffect(() => {
    if (!id) return
    setCommentsLoading(true)
    setCommentsError(null)
    fetchComments(id)
      .then((result) => {
        setComments(result.data)
        setCommentsLoading(false)
      })
      .catch((err) => {
        setCommentsError(err instanceof Error ? err.message : 'Failed to load comments')
        setCommentsLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (!issue && !isLoading && issues.length > 0) {
      loadIssues()
    }
  }, [issue, isLoading, issues.length, loadIssues])

  const handleBack = useCallback(() => {
    navigate('/issues')
  }, [navigate])

  const handleEdit = useCallback(
    async (data: IssueFormSchema): Promise<boolean | void> => {
      if (!id) return

      const currentIssue = issues.find((i) => i.id === id)
      const assigneeChanged = currentIssue && currentIssue.assigneeId !== data.assigneeId

      if (assigneeChanged) {
        try {
          await assignIssue(id, data.assigneeId ?? null)
          addToast({
            title: 'Assignee updated',
            variant: 'success',
            duration: 3000,
          })
        } catch (err) {
          if (isBusinessRuleError(err)) {
            addToast({
              title: err.message,
              variant: 'error',
              duration: 5000,
            })
          } else {
            addToast({
              title: 'Failed to update assignee. Please try again.',
              variant: 'error',
              duration: 5000,
            })
          }
          throw err
        }
      }

      const otherFieldsChanged =
        currentIssue &&
        (currentIssue.title !== data.title ||
          currentIssue.description !== (data.description || '') ||
          currentIssue.status !== data.status ||
          currentIssue.priority !== data.priority ||
          JSON.stringify(currentIssue.labels) !== JSON.stringify(data.labels))

      if (otherFieldsChanged) {
        const result = await updateIssue(id, {
          title: data.title,
          description: data.description || undefined,
          status: data.status,
          priority: data.priority,
          labels: data.labels,
        })
        updateIssueInStore(id, result.data)
        return
      }

      if (assigneeChanged) {
        return true
      }
    },
    [id, issues, assignIssue, updateIssueInStore, addToast],
  )

  const handleDelete = useCallback(async () => {
    if (!id) return
    await deleteIssue(id)
    removeIssue(id)
    addToast({
      title: 'Issue deleted',
      variant: 'success',
      duration: 3000,
    })
    navigate('/issues')
  }, [id, removeIssue, addToast, navigate])

  const handleStatusChange = useCallback(async (statusId: string) => {
    if (!id) return
    setStatusChanging(true)
    try {
      const result = await useIssuesStore.getState().changeStatus(id, statusId)
      addToast({
        title: `Status updated to ${result.status}`,
        variant: 'success',
        duration: 3000,
      })
    } catch (err) {
      if (isBusinessRuleError(err)) {
        addToast({
          title: err.message,
          variant: 'error',
          duration: 5000,
        })
      } else {
        addToast({
          title: 'Failed to update status. Please try again.',
          variant: 'error',
          duration: 5000,
        })
      }
    } finally {
      setStatusChanging(false)
    }
  }, [id, addToast])

  const pageError = error || commentsError
  const combinedLoading = isLoading || commentsLoading

  return (
    <div className="p-6">
      <IssueDetail
        issue={issue}
        comments={comments}
        isLoading={combinedLoading}
        error={pageError}
        onBack={handleBack}
        onEdit={() => setShowEditForm(true)}
        onDelete={() => setShowDeleteDialog(true)}
        onRetry={() => {
          if (id) fetchComments(id).then((r) => setComments(r.data)).catch((e) => setCommentsError(e.message))
          loadIssues()
        }}
        onStatusChange={handleStatusChange}
        statusChanging={statusChanging}
      />

      <IssueFormModal
        isOpen={showEditForm}
        mode="edit"
        issue={issue}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleEdit}
      />

      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        issueTitle={issue?.title ?? ''}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
