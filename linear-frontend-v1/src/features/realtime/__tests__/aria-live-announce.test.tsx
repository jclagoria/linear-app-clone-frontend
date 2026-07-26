import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationBadge } from '../ui/NotificationBadge'
import { ConnectionStatusIndicator } from '../ui/ConnectionStatusIndicator'
import { NotificationPanel } from '../ui/NotificationPanel'
import { useNotificationsStore } from '@/shared/stores/notificationsStore'
import { useOptimisticStore } from '../lib/optimistic-store'

describe('accessibility: aria-live regions announce new content', () => {
  beforeEach(() => {
    useNotificationsStore.setState({ items: [] })
    useOptimisticStore.setState({ pending: [] })
  })

  describe('NotificationBadge', () => {
    it('badge appears with count when notifications arrive', () => {
      const { rerender } = render(<NotificationBadge />)
      expect(screen.queryByLabelText(/unread notifications/)).not.toBeInTheDocument()

      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'mention', title: 'Mention', message: '', read: false, createdAt: '' },
        ],
      })
      rerender(<NotificationBadge />)

      const badge = screen.getByLabelText('1 unread notifications')
      expect(badge).toHaveAttribute('aria-live', 'polite')
      expect(badge.textContent).toBe('1')
    })

    it('badge count updates when more notifications arrive', () => {
      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'mention', title: 'First', message: '', read: false, createdAt: '' },
        ],
      })
      const { rerender } = render(<NotificationBadge />)
      expect(screen.getByText('1')).toBeInTheDocument()

      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'mention', title: 'First', message: '', read: false, createdAt: '' },
          { id: 'n2', type: 'assignment', title: 'Second', message: '', read: false, createdAt: '' },
          { id: 'n3', type: 'comment', title: 'Third', message: '', read: false, createdAt: '' },
        ],
      })
      rerender(<NotificationBadge />)

      const badge = screen.getByLabelText('3 unread notifications')
      expect(badge).toHaveAttribute('aria-live', 'polite')
      expect(badge.textContent).toBe('3')
    })

    it('badge caps display at 99+ for large counts', () => {
      const items = Array.from({ length: 150 }, (_, i) => ({
        id: `n${i}`,
        type: 'info',
        title: `Notification ${i}`,
        message: '',
        read: false,
        createdAt: '',
      }))
      useNotificationsStore.setState({ items })

      render(<NotificationBadge />)
      const badge = screen.getByLabelText('150 unread notifications')
      expect(badge.textContent).toBe('99+')
    })
  })

  describe('ConnectionStatusIndicator', () => {
    it('announces "Connected" status', () => {
      render(<ConnectionStatusIndicator status="connected" />)
      const region = screen.getByRole('status')
      expect(region).toHaveAttribute('aria-live', 'polite')
      expect(region).toHaveAttribute('aria-label', 'Connection status: connected')
      expect(screen.getByText('Connected')).toBeInTheDocument()
    })

    it('announces "Disconnected" status', () => {
      render(<ConnectionStatusIndicator status="disconnected" />)
      const region = screen.getByRole('status')
      expect(region).toHaveAttribute('aria-label', 'Connection status: disconnected')
      expect(screen.getByText('Disconnected')).toBeInTheDocument()
    })

    it('announces "Reconnecting..." with pulse animation', () => {
      render(<ConnectionStatusIndicator status="reconnecting" />)
      const region = screen.getByRole('status')
      expect(region).toHaveAttribute('aria-label', 'Connection status: reconnecting')
      expect(screen.getByText('Reconnecting...')).toBeInTheDocument()
      const dot = region.querySelector('.animate-pulse')
      expect(dot).toBeInTheDocument()
    })
  })

  describe('NotificationPanel', () => {
    it('list has aria-live="polite" for screen readers', () => {
      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'mention', title: 'New mention', message: 'You were tagged', read: false, createdAt: '2026-01-01T00:00:00Z' },
        ],
      })

      render(
        <NotificationPanel isOpen={true} onToggle={() => {}} onClose={() => {}} onItemClick={() => {}} />,
      )

      const list = screen.getByRole('list')
      expect(list).toHaveAttribute('aria-live', 'polite')
    })

    it('new notification items appear in the aria-live list', () => {
      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'mention', title: 'First notification', message: '', read: false, createdAt: '2026-01-01T00:00:00Z' },
        ],
      })

      const { rerender } = render(
        <NotificationPanel isOpen={true} onToggle={() => {}} onClose={() => {}} onItemClick={() => {}} />,
      )

      expect(screen.getByText('First notification')).toBeInTheDocument()

      useNotificationsStore.setState({
        items: [
          { id: 'n1', type: 'mention', title: 'First notification', message: '', read: false, createdAt: '2026-01-01T00:00:00Z' },
          { id: 'n2', type: 'assignment', title: 'Second notification', message: 'New assignment', read: false, createdAt: '2026-01-01T00:00:01Z' },
        ],
      })
      rerender(
        <NotificationPanel isOpen={true} onToggle={() => {}} onClose={() => {}} onItemClick={() => {}} />,
      )

      expect(screen.getByText('Second notification')).toBeInTheDocument()
      const list = screen.getByRole('list')
      expect(list.children).toHaveLength(2)
    })

    it('panel region has aria-label for screen readers', () => {
      render(
        <NotificationPanel isOpen={true} onToggle={() => {}} onClose={() => {}} onItemClick={() => {}} />,
      )
      expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument()
    })
  })
})
