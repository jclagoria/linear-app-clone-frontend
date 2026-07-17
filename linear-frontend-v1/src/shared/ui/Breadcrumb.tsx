import { Link } from 'react-router-dom'

interface BreadcrumbSegment {
  label: string
  href?: string
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[]
}

export function Breadcrumb({ segments }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-text-muted">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-text-muted" aria-hidden="true">
                  /
                </span>
              )}
              {segment.href && !isLast ? (
                <Link
                  to={segment.href}
                  className="underline hover:text-text-primary transition-colors"
                >
                  {segment.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'font-medium text-text' : 'text-text-muted'}
                >
                  {segment.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
