import { useIssuesStore } from '@/entities/issue/model/store'
import { useToastStore } from '@/shared/stores/toastStore'

const SHORTCUT_ACTION_MAP: Record<string, (selectedIssueId: string | null) => void | Promise<void>> = {
  'navigate-down': () => {
    const { issues, selectedIssueId, selectIssue } = useIssuesStore.getState()
    if (issues.length === 0) return
    const currentIndex = selectedIssueId ? issues.findIndex((i) => i.id === selectedIssueId) : -1
    const nextIndex = currentIndex < issues.length - 1 ? currentIndex + 1 : 0
    selectIssue(issues[nextIndex].id)
  },

  'navigate-up': () => {
    const { issues, selectedIssueId, selectIssue } = useIssuesStore.getState()
    if (issues.length === 0) return
    const currentIndex = selectedIssueId ? issues.findIndex((i) => i.id === selectedIssueId) : 1
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : issues.length - 1
    selectIssue(issues[prevIndex].id)
  },

  'close-modal': () => {
    useIssuesStore.getState().deselectIssue()
  },

  'set-status': async (selectedIssueId) => {
    if (!selectedIssueId) return
    const store = useIssuesStore.getState()
    const issue = store.issues.find((i) => i.id === selectedIssueId)
    if (!issue) return
    try {
      await store.changeStatus(selectedIssueId, issue.statusId)
    } catch {
      useToastStore.getState().addToast({
        title: 'Failed to change status',
        variant: 'error',
      })
    }
  },

  'assign': (selectedIssueId) => {
    if (!selectedIssueId) return
    const event = new CustomEvent('open-assign-picker', {
      detail: { issueId: selectedIssueId },
    })
    window.dispatchEvent(event)
  },

  'set-label': (selectedIssueId) => {
    if (!selectedIssueId) return
    const event = new CustomEvent('open-label-picker', {
      detail: { issueId: selectedIssueId },
    })
    window.dispatchEvent(event)
  },

  'open-issue': (selectedIssueId) => {
    if (!selectedIssueId) return
    const event = new CustomEvent('navigate-to-issue', {
      detail: { issueId: selectedIssueId },
    })
    window.dispatchEvent(event)
  },
}

export function initShortcutActions() {
  const handler = async (e: Event) => {
    const { action, selectedIssueId } = (e as CustomEvent).detail as {
      action: string
      selectedIssueId: string | null
    }

    const actionFn = SHORTCUT_ACTION_MAP[action]
    if (actionFn) {
      await actionFn(selectedIssueId)
    }
  }

  window.addEventListener('keyboard-shortcut', handler)
  return () => window.removeEventListener('keyboard-shortcut', handler)
}
