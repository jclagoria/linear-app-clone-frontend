import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/entities/session/model/store'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useIssueLabelsStore } from '@/entities/label/model/store'
import { IssueDetail } from '@/entities/issue/ui/IssueDetail'
import { IssueFormModal } from '@/entities/issue/ui/IssueFormModal'
import { ConfirmDeleteDialog } from '@/entities/issue/ui/ConfirmDeleteDialog'
import { useToastStore } from '@/shared/stores/toastStore'
import { updateIssue, updateComment, deleteIssue } from '@/entities/issue/api'
import { isBusinessRuleError, isForbiddenError } from '@/shared/lib/api-client'
import { selectIssueById } from '@/entities/issue/model/selectors'
import { useShallow } from 'zustand/react/shallow'
import type { IssueFormSchema } from '@/entities/issue/model/validation'
import type { Label } from '@/entities/label/model/types'

export function IssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const issues = useIssuesStore((s) => s.issues)
  const isLoading = useIssuesStore((s) => s.isLoading)
  const error = useIssuesStore((s) => s.error)
  const loadIssues = useIssuesStore((s) => s.loadIssues)
  const updateIssueInStore = useIssuesStore((s) => s.updateIssue)
  const removeIssue = useIssuesStore((s) => s.removeIssue)
  const selectIssue = useIssuesStore((s) => s.selectIssue)
  const assignIssue = useIssuesStore((s) => s.assignIssue)
  const fetchComments = useIssuesStore((s) => s.fetchComments)
  const updateCommentInStore = useIssuesStore((s) => s.updateCommentInStore)
  const comments = useIssuesStore(
    useShallow((s) => (id ? s.commentsByIssue[id] ?? [] : [])),
  )
  const commentsLoading = useIssuesStore((s) => s.commentsLoading)
  const commentsError = useIssuesStore((s) => s.commentsError)
  const addToast = useToastStore((s) => s.addToast)
  const currentUserId = user?.id ?? null

  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [statusChanging, setStatusChanging] = useState(false)
  const [showLabelPicker, setShowLabelPicker] = useState(false)
  const [labelsDisabled, setLabelsDisabled] = useState(false)

  const issueLabels = useIssueLabelsStore(
    useShallow((s) => (id ? s.labelsByIssue[id] ?? [] : [])),
  )
  const labelsLoading = useIssueLabelsStore((s) => s.isLoading)
  const labelsError = useIssueLabelsStore((s) => s.error)
  const fetchLabels = useIssueLabelsStore((s) => s.fetchLabels)
  const attachLabel = useIssueLabelsStore((s) => s.attachLabel)
  const detachLabelStore = useIssueLabelsStore((s) => s.detachLabel)

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
    fetchComments(id)
  }, [id, fetchComments])

  useEffect(() => {
    if (id) {
      fetchLabels(id)
    }
  }, [id, fetchLabels])

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

  const handleDetachLabel = useCallback(
    async (labelId: string) => {
      if (!id) return
      setLabelsDisabled(true)
      try {
        await detachLabelStore(id, labelId)
        addToast({
          title: 'Label removed',
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
            title: 'Failed to remove label. Please try again.',
            variant: 'error',
            duration: 5000,
          })
        }
      } finally {
        setLabelsDisabled(false)
      }
    },
    [id, detachLabelStore, addToast],
  )

  const handleAddLabel = useCallback(
    async (label: Label) => {
      if (!id) return
      setLabelsDisabled(true)
      try {
        await attachLabel(id, label.id, label)
        setShowLabelPicker(false)
        addToast({
          title: `Label "${label.name}" added`,
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
            title: 'Failed to add label. Please try again.',
            variant: 'error',
            duration: 5000,
          })
        }
      } finally {
        setLabelsDisabled(false)
      }
    },
    [id, attachLabel, addToast],
  )

  const handleToggleLabelPicker = useCallback(() => {
    setShowLabelPicker((prev) => !prev)
  }, [])

  const handleEditComment = useCallback(
    async (commentId: string, body: string) => {
      if (!id) return
      try {
        await updateComment(id, commentId, body)
        updateCommentInStore(id, commentId, body)
        addToast({
          title: 'Comment updated',
          variant: 'success',
          duration: 3000,
        })
      } catch (err) {
        if (isForbiddenError(err)) {
          addToast({
            title: 'Not the comment owner',
            variant: 'error',
            duration: 5000,
          })
          return
        }
        addToast({
          title: 'Failed to update comment. Please try again.',
          variant: 'error',
          duration: 5000,
        })
        throw err
      }
    },
    [id, addToast],
  )

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
          loadIssues()
          if (id) fetchComments(id)
        }}
        onStatusChange={handleStatusChange}
        statusChanging={statusChanging}
        labels={issueLabels}
        labelsLoading={labelsLoading}
        labelsError={labelsError}
        onDetachLabel={handleDetachLabel}
        onAddLabel={handleAddLabel}
        showLabelPicker={showLabelPicker}
        onToggleLabelPicker={handleToggleLabelPicker}
        onCloseLabelPicker={() => setShowLabelPicker(false)}
        labelsDisabled={labelsDisabled}
        currentUserId={currentUserId}
        onEditComment={handleEditComment}
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
