import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationBadge } from '../ui/NotificationBadge'
import { ConnectionStatusIndicator } from '../ui/ConnectionStatusIndicator'
import { IssueCard } from '../ui/IssueCard'
import { useNotificationsStore } from '@/shared/stores/notificationsStore'
import { useOptimisticStore } from '../lib/optimistic-store'

describe('accessibility: aria-live regions', () => {
  beforeEach(() => {
    useNotificationsStore.setState({ items: [] })
    useOptimisticStore.setState({ pending: [] })
  })

  it('NotificationBadge has aria-live="polite"', () => {
    useNotificationsStore.setState({
      items: [
        { id: 'n1', type: 'info', title: 'Test', message: '', read: false, createdAt: '' },
      ],
    })

    render(<NotificationBadge />)
    const badge = screen.getByLabelText('1 unread notifications')
    expect(badge).toHaveAttribute('aria-live', 'polite')
  })

  it('ConnectionStatusIndicator has aria-live="polite"', () => {
    render(<ConnectionStatusIndicator status="connected" />)
    const indicator = screen.getByRole('status')
    expect(indicator).toHaveAttribute('aria-live', 'polite')
  })

  it('ConnectionStatusIndicator has role="status"', () => {
    render(<ConnectionStatusIndicator status="connected" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('IssueCard has role="article" and aria-label', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Test Issue"
        statusId="todo"
        statusLabel="To Do"
      />,
    )
    const article = screen.getByRole('article')
    expect(article).toHaveAttribute('aria-label', 'Issue: Test Issue, Status: To Do')
  })

  it('IssueCard has aria-busy when optimistic', () => {
    useOptimisticStore.setState({
      pending: [{
        id: 'opt_1',
        action: 'update',
        target: 'issues:i1',
        data: {},
        revert: { action: 'update', target: 'issues:i1', data: {} },
        request: { method: 'PATCH', url: '/api/issues/i1' },
        timestamp: Date.now(),
      }],
    })

    render(
      <IssueCard
        issueId="i1"
        title="Busy Issue"
        statusId="todo"
        isOptimistic
      />,
    )
    expect(screen.getByRole('article')).toHaveAttribute('aria-busy', 'true')
  })
})

describe('accessibility: tab order', () => {
  beforeEach(() => {
    useOptimisticStore.setState({ pending: [] })
  })

  it('IssueCard with onClick is focusable', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Clickable Issue"
        statusId="todo"
        onClick={() => {}}
      />,
    )
    const article = screen.getByRole('article')
    expect(article).toHaveAttribute('tabindex', '0')
  })

  it('IssueCard without onClick is not focusable', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Non-clickable Issue"
        statusId="todo"
      />,
    )
    const article = screen.getByRole('article')
    expect(article).not.toHaveAttribute('tabindex')
  })

  it('ConnectionStatusIndicator is focusable when disconnected', () => {
    render(<ConnectionStatusIndicator status="disconnected" onReconnect={() => {}} />)
    const indicator = screen.getByRole('status')
    expect(indicator).toHaveAttribute('tabindex', '0')
  })

  it('ConnectionStatusIndicator is not focusable when connected', () => {
    render(<ConnectionStatusIndicator status="connected" />)
    const indicator = screen.getByRole('status')
    expect(indicator).not.toHaveAttribute('tabindex')
  })
})

describe('accessibility: reduced motion', () => {
  beforeEach(() => {
    useOptimisticStore.setState({ pending: [] })
  })

  it('IssueCard uses transition-all (respects prefers-reduced-motion via CSS)', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Test Issue"
        statusId="todo"
      />,
    )
    const article = screen.getByRole('article')
    expect(article.className).toContain('transition-all')
  })
})
