import { useParams } from 'react-router-dom'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-text-muted">
      <p>Project Detail — {id ?? 'unknown'}</p>
    </div>
  )
}
