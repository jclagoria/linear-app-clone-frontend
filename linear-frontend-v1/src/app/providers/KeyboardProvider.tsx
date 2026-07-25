import { createContext, useContext, useEffect, useCallback, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useKeyboardStore } from '@/features/keyboard/model/useKeyboardStore'
import { useIssuesStore } from '@/entities/issue/model/store'
import { initShortcutActions } from '@/features/keyboard/model/shortcutActions'

interface KeyboardContextValue {
  isHelpModalOpen: boolean
  openHelpModal: () => void
  closeHelpModal: () => void
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null)

export function useKeyboard(): KeyboardContextValue {
  const ctx = useContext(KeyboardContext)
  if (!ctx) throw new Error('useKeyboard must be used within KeyboardProvider')
  return ctx
}

interface KeyboardProviderProps {
  children: ReactNode
}

function getRouteContext(pathname: string): 'global' | 'list' | 'detail' {
  if (pathname.match(/^\/issues\/[^/]+$/)) return 'detail'
  if (pathname.match(/^\/issues/)) return 'list'
  if (pathname.match(/^\/projects\/[^/]+$/)) return 'detail'
  if (pathname.match(/^\/projects/)) return 'list'
  return 'global'
}

function isInputElement(element: EventTarget | null): boolean {
  if (!element || !(element instanceof Element)) return false
  if (typeof element.tagName !== 'string') return false
  const tag = element.tagName.toLowerCase()
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    (element as HTMLElement).isContentEditable
  )
}

export function KeyboardProvider({ children }: KeyboardProviderProps) {
  const location = useLocation()
  const handleKeyDown = useKeyboardStore((s) => s.handleKeyDown)
  const setContext = useKeyboardStore((s) => s.setContext)
  const setSelectedIssue = useKeyboardStore((s) => s.setSelectedIssue)
  const selectedIssueId = useIssuesStore((s) => s.selectedIssueId)

  const openHelpModal = useCallback(() => {
    useKeyboardStore.getState().setHelpModalOpen(true)
  }, [])

  const closeHelpModal = useCallback(() => {
    useKeyboardStore.getState().setHelpModalOpen(false)
  }, [])

  useEffect(() => {
    const context = getRouteContext(location.pathname)
    setContext(context)
  }, [location.pathname, setContext])

  useEffect(() => {
    if (selectedIssueId) {
      setSelectedIssue(selectedIssueId)
    } else {
      setSelectedIssue(null)
    }
  }, [selectedIssueId, setSelectedIssue])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isInputElement(e.target)) return
      handleKeyDown(e)
    }

    document.addEventListener('keydown', onKeyDown)
    const cleanupActions = initShortcutActions()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      cleanupActions()
    }
  }, [handleKeyDown])

  const value: KeyboardContextValue = {
    isHelpModalOpen: useKeyboardStore((s) => s.isHelpModalOpen),
    openHelpModal,
    closeHelpModal,
  }

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  )
}
