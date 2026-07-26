import { describe, it, expect, beforeEach } from 'vitest'
import { useNotificationsStore } from '@/shared/stores/notificationsStore'

describe('useNotificationsStore', () => {
  beforeEach(() => {
    useNotificationsStore.setState({ items: [] })
  })

  describe('addNotification', () => {
    it('adds a notification to the beginning of the list', () => {
      useNotificationsStore.getState().addNotification({
        id: 'n1',
        type: 'info',
        title: 'First',
        message: 'msg1',
        read: false,
        createdAt: '2026-01-01T00:00:00Z',
      })

      useNotificationsStore.getState().addNotification({
        id: 'n2',
        type: 'info',
        title: 'Second',
        message: 'msg2',
        read: false,
        createdAt: '2026-01-01T00:01:00Z',
      })

      const items = useNotificationsStore.getState().items
      expect(items).toHaveLength(2)
      expect(items[0].id).toBe('n2')
      expect(items[1].id).toBe('n1')
    })

    it('preserves notification properties', () => {
      useNotificationsStore.getState().addNotification({
        id: 'n1',
        type: 'issue_assigned',
        title: 'Assigned to you',
        message: 'You were assigned to PROJ-123',
        read: false,
        createdAt: '2026-01-01T00:00:00Z',
        issueId: 'i1',
      })

      const item = useNotificationsStore.getState().items[0]
      expect(item.type).toBe('issue_assigned')
      expect(item.issueId).toBe('i1')
    })
  })

  describe('markRead', () => {
    it('marks a specific notification as read', () => {
      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'info', title: 'One', message: '', read: false, createdAt: '' },
          { id: 'n2', type: 'info', title: 'Two', message: '', read: false, createdAt: '' },
        ],
      })

      useNotificationsStore.getState().markRead('n1')

      const items = useNotificationsStore.getState().items
      expect(items[0].read).toBe(true)
      expect(items[1].read).toBe(false)
    })

    it('does nothing when id does not exist', () => {
      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'info', title: 'One', message: '', read: false, createdAt: '' },
        ],
      })

      useNotificationsStore.getState().markRead('nonexistent')

      expect(useNotificationsStore.getState().items[0].read).toBe(false)
    })
  })

  describe('markAllRead', () => {
    it('marks all notifications as read', () => {
      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'info', title: 'One', message: '', read: false, createdAt: '' },
          { id: 'n2', type: 'info', title: 'Two', message: '', read: false, createdAt: '' },
        ],
      })

      useNotificationsStore.getState().markAllRead()

      const items = useNotificationsStore.getState().items
      expect(items.every((n) => n.read)).toBe(true)
    })
  })

  describe('clearAll', () => {
    it('removes all notifications', () => {
      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'info', title: 'One', message: '', read: false, createdAt: '' },
          { id: 'n2', type: 'info', title: 'Two', message: '', read: false, createdAt: '' },
        ],
      })

      useNotificationsStore.getState().clearAll()

      expect(useNotificationsStore.getState().items).toHaveLength(0)
    })

    it('does nothing when already empty', () => {
      useNotificationsStore.getState().clearAll()

      expect(useNotificationsStore.getState().items).toHaveLength(0)
    })
  })

  describe('getUnreadCount', () => {
    it('returns count of unread notifications', () => {
      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'info', title: 'One', message: '', read: false, createdAt: '' },
          { id: 'n2', type: 'info', title: 'Two', message: '', read: true, createdAt: '' },
          { id: 'n3', type: 'info', title: 'Three', message: '', read: false, createdAt: '' },
        ],
      })

      expect(useNotificationsStore.getState().getUnreadCount()).toBe(2)
    })

    it('returns 0 when all are read', () => {
      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'info', title: 'One', message: '', read: true, createdAt: '' },
        ],
      })

      expect(useNotificationsStore.getState().getUnreadCount()).toBe(0)
    })

    it('returns 0 when store is empty', () => {
      expect(useNotificationsStore.getState().getUnreadCount()).toBe(0)
    })
  })
})
