import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IssueCard } from '../ui/IssueCard'
import { NotificationBadge } from '../ui/NotificationBadge'
import { ConnectionStatusIndicator } from '../ui/ConnectionStatusIndicator'
import { useNotificationsStore } from '@/shared/stores/notificationsStore'
import { useOptimisticStore } from '../lib/optimistic-store'

describe('IssueCard', () => {
  beforeEach(() => {
    useOptimisticStore.setState({ pending: [] })
  })

  it('renders issue title', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Fix login bug"
        statusId="in-progress"
        statusLabel="In Progress"
      />,
    )
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
  })

  it('renders status label in aria-label', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Fix login bug"
        statusId="done"
        statusLabel="Done"
      />,
    )
    expect(screen.getByRole('article')).toHaveAttribute(
      'aria-label',
      'Issue: Fix login bug, Status: Done',
    )
  })

  it('renders assignee name', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Fix login bug"
        statusId="todo"
        assigneeName="Alice"
      />,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders priority indicator for priority > 0', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Fix login bug"
        statusId="todo"
        priority={2}
      />,
    )
    expect(screen.getByText('!!')).toBeInTheDocument()
  })

  it('does not render priority indicator for priority 0', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Fix login bug"
        statusId="todo"
        priority={0}
      />,
    )
    expect(screen.queryByLabelText(/Priority/)).not.toBeInTheDocument()
  })

  it('renders labels', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Fix login bug"
        statusId="todo"
        labels={['bug', 'urgent']}
      />,
    )
    expect(screen.getByText('bug')).toBeInTheDocument()
    expect(screen.getByText('urgent')).toBeInTheDocument()
  })

  it('has correct aria-label', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Fix login bug"
        statusId="todo"
        statusLabel="To Do"
      />,
    )
    expect(screen.getByRole('article')).toHaveAttribute(
      'aria-label',
      'Issue: Fix login bug, Status: To Do',
    )
  })

  it('applies optimistic styling when isOptimistic is true', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Fix login bug"
        statusId="todo"
        isOptimistic
      />,
    )
    const article = screen.getByRole('article')
    expect(article.className).toContain('animate-pulse')
  })

  it('applies revert styling when isReverted is true', () => {
    render(
      <IssueCard
        issueId="i1"
        title="Fix login bug"
        statusId="todo"
        isReverted
      />,
    )
    const article = screen.getByRole('article')
    expect(article.className).toContain('ring-red-500')
  })
})

describe('NotificationBadge', () => {
  beforeEach(() => {
    useNotificationsStore.setState({ items: [] })
  })

  it('renders nothing when no unread notifications', () => {
    render(<NotificationBadge />)
    expect(screen.queryByLabelText(/unread/)).not.toBeInTheDocument()
  })

  it('renders count for unread notifications', () => {
    useNotificationsStore.setState({
      items: [
        { id: 'n1', type: 'info', title: 'Test', message: '', read: false, createdAt: '' },
        { id: 'n2', type: 'info', title: 'Test2', message: '', read: false, createdAt: '' },
      ],
    })

    render(<NotificationBadge />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByLabelText('2 unread notifications')).toBeInTheDocument()
  })

  it('renders 99+ for counts above 99', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: `n${i}`,
      type: 'info',
      title: `Test ${i}`,
      message: '',
      read: false,
      createdAt: '',
    }))
    useNotificationsStore.setState({ items })

    render(<NotificationBadge />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('has aria-live="polite" attribute', () => {
    useNotificationsStore.setState({
      items: [
        { id: 'n1', type: 'info', title: 'Test', message: '', read: false, createdAt: '' },
      ],
    })

    render(<NotificationBadge />)
    expect(screen.getByLabelText('1 unread notifications')).toHaveAttribute(
      'aria-live',
      'polite',
    )
  })
})

describe('ConnectionStatusIndicator', () => {
  it('shows Connected when status is connected', () => {
    render(<ConnectionStatusIndicator status="connected" />)
    expect(screen.getByText('Connected')).toBeInTheDocument()
  })

  it('shows Connecting when status is connecting', () => {
    render(<ConnectionStatusIndicator status="connecting" />)
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
  })

  it('shows Reconnecting when status is reconnecting', () => {
    render(<ConnectionStatusIndicator status="reconnecting" />)
    expect(screen.getByText('Reconnecting...')).toBeInTheDocument()
  })

  it('shows Disconnected when status is disconnected', () => {
    render(<ConnectionStatusIndicator status="disconnected" />)
    expect(screen.getByText('Disconnected')).toBeInTheDocument()
  })

  it('has role="status" and aria-live="polite"', () => {
    render(<ConnectionStatusIndicator status="connected" />)
    const indicator = screen.getByRole('status')
    expect(indicator).toHaveAttribute('aria-live', 'polite')
    expect(indicator).toHaveAttribute('aria-label', 'Connection status: connected')
  })

  it('calls onReconnect when disconnected and clicked', () => {
    const onReconnect = vi.fn()
    render(<ConnectionStatusIndicator status="disconnected" onReconnect={onReconnect} />)

    screen.getByRole('status').click()
    expect(onReconnect).toHaveBeenCalledOnce()
  })

  it('does not call onReconnect when connected and clicked', () => {
    const onReconnect = vi.fn()
    render(<ConnectionStatusIndicator status="connected" onReconnect={onReconnect} />)

    screen.getByRole('status').click()
    expect(onReconnect).not.toHaveBeenCalled()
  })
})
