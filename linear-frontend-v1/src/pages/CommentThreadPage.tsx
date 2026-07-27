import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useIssuesStore } from '@/entities/issue/model/store'
import { CommentItem, type CommentItemData } from '@/features/realtime/ui/CommentItem'
import { EmptyState } from '@/features/realtime/ui/EmptyState'
import { Button } from '@/shared/ui/Button'
import { ArrowLeft, Send } from 'lucide-react'

export function CommentThreadPage() {
  const { id: issueId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const issue = useIssuesStore((s) => s.issues.find((i) => i.id === issueId))
  const comments = useIssuesStore((s) => s.commentsByIssue[issueId ?? ''] ?? [])
  const loadComments = useIssuesStore((s) => s.loadCommentsForIssue)

  useEffect(() => {
    if (issueId) {
      loadComments(issueId)
    }
  }, [issueId, loadComments])

  const handleSubmitComment = useCallback(async () => {
    if (!issueId || !newComment.trim()) return

    setIsSubmitting(true)
    try {
      // TODO: Implement API call to post comment
      // For now, just clear the input
      setNewComment('')
    } finally {
      setIsSubmitting(false)
    }
  }, [issueId, newComment])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleSubmitComment()
      }
    },
    [handleSubmitComment],
  )

  if (!issueId) {
    return (
      <div className="p-6">
        <EmptyState
          title="Issue not found"
          description="No issue ID provided."
          actionLabel="Go back"
          onAction={() => navigate(-1)}
        />
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="p-6">
        <EmptyState
          title="Loading..."
          description="Fetching issue details..."
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon={<ArrowLeft className="h-4 w-4" />}
          className="mb-4"
        >
          Back to issue
        </Button>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{issue.title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="border border-[var(--border-color)] rounded-lg overflow-hidden mb-6">
        {comments.length === 0 ? (
          <EmptyState
            title="No comments yet"
            description="Be the first to comment on this issue."
          />
        ) : (
          comments.map((comment: CommentItemData) => (
            <CommentItem
              key={comment.id}
              comment={comment}
            />
          ))
        )}
      </div>

      <div className="border border-[var(--border-color)] rounded-lg p-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment... (Ctrl+Enter to submit)"
          className="w-full min-h-[100px] p-3 text-sm text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          disabled={isSubmitting}
        />
        <div className="mt-3 flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
            icon={<Send className="h-4 w-4" />}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  )
}
