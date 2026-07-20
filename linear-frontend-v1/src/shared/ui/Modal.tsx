import { type ReactNode, useCallback, useEffect, useRef, useId } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useModalStore } from '@/shared/stores/modalStore'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  closeOnBackdropClick?: boolean
  className?: string
  stackId?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdropClick = true,
  className,
  stackId: externalStackId,
}: ModalProps) {
  const generatedId = useId()
  const stackId = externalStackId ?? generatedId
  const push = useModalStore((s) => s.push)
  const pop = useModalStore((s) => s.pop)
  const stack = useModalStore((s) => s.stack)
  const topId = useModalStore((s) => s.topId)
  const zIndex = stack.find((item) => item.id === stackId)?.zIndex ?? 50
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2, 9)}`)
  const contentRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }

      if (e.key === 'Tab' && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return

    push(stackId)

    previousFocusRef.current = document.activeElement as HTMLElement
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    requestAnimationFrame(() => {
      const firstFocusable = contentRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      firstFocusable?.focus()
    })

    return () => {
      pop(stackId)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
  }, [isOpen, handleKeyDown, push, pop, stackId])

  if (!isOpen) return null

  const isTop = topId === stackId

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center',
        !isTop && 'pointer-events-none',
      )}
      style={{ zIndex }}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId.current}
        className={cn(
          'relative z-10 mx-auto w-full max-w-lg rounded-lg bg-surface shadow-xl',
          'max-h-[85vh] overflow-y-auto',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2
            id={titleId.current}
            className="text-lg font-semibold text-text"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-text-muted transition-colors hover:text-text hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
