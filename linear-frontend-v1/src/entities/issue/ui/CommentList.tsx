import { CommentCard } from './CommentCard'
import { EmptyState } from '@/shared/ui/EmptyState'
import { MessageSquare } from 'lucide-react'
import type { Comment } from '../model/types'

interface CommentListProps {
  comments: Comment[]
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-8 w-8" />}
        title="No comments yet"
        description="Be the first to share your thoughts."
      />
    )
  }

  return (
    <div className="space-y-3" role="list" aria-label="Comments">
      <h3 className="text-sm font-semibold text-text">
        Comments ({comments.length})
      </h3>
      {comments.map((comment) => (
        <div key={comment.id} role="listitem">
          <CommentCard comment={comment} />
        </div>
      ))}
    </div>
  )
}
