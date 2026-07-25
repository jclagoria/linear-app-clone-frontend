import { useEffect, type ReactNode } from 'react'
import { useToastStore, type ToastVariant } from '@/shared/stores/toastStore'

const SHORTCUT_TOAST_MESSAGES: Record<string, { title: string; variant: ToastVariant }> = {
  'create-issue': { title: 'Creating new issue…', variant: 'info' },
  'go-to-inbox': { title: 'Navigating to inbox', variant: 'info' },
  'go-to-projects': { title: 'Navigating to projects', variant: 'info' },
  'go-to-cycles': { title: 'Navigating to cycles', variant: 'info' },
  'search': { title: 'Opening search', variant: 'info' },
  'show-help': { title: 'Opened keyboard shortcuts', variant: 'info' },
  'navigate-down': { title: 'Moved selection down', variant: 'success' },
  'navigate-up': { title: 'Moved selection up', variant: 'success' },
  'open-issue': { title: 'Opening issue…', variant: 'info' },
  'set-status': { title: 'Changing status…', variant: 'info' },
  'assign': { title: 'Opening assignee picker…', variant: 'info' },
  'set-label': { title: 'Opening label picker…', variant: 'info' },
  'edit-issue': { title: 'Editing issue…', variant: 'info' },
  'delete-issue': { title: 'Delete issue?', variant: 'error' },
}

interface ToastContainerProps {
  children: ReactNode
}

export function ToastContainer({ children }: ToastContainerProps) {
  const addToast = useToastStore((s) => s.addToast)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { action: string }
      const message = SHORTCUT_TOAST_MESSAGES[detail.action]
      if (message) {
        addToast({ title: message.title, variant: message.variant, duration: 2000 })
      }
    }

    window.addEventListener('keyboard-shortcut', handler)
    return () => window.removeEventListener('keyboard-shortcut', handler)
  }, [addToast])

  return <>{children}</>
}
