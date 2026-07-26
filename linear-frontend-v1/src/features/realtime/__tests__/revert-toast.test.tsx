import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useOptimisticStore } from '../lib/optimistic-store'
import { applyOptimistic, createOptimisticUpdate } from '../lib/optimistic-manager'
import { RevertToast } from '../ui/RevertToast'

describe('RevertToast', () => {
  beforeEach(() => {
    useOptimisticStore.setState({ pending: [] })
  })

  it('renders nothing by default', () => {
    render(<RevertToast />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows toast when a revert event fires', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('error', { status: 500 }))

    render(<RevertToast />)

    const update = createOptimisticUpdate({
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1', body: { statusId: 'done' } },
    })

    applyOptimistic({ update })

    await vi.waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.getByText(/Reverted.*issues:i1/)).toBeInTheDocument()
  })

  it('dismisses toast after timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('error', { status: 500 }))

    render(<RevertToast />)

    const update = createOptimisticUpdate({
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1', body: { statusId: 'done' } },
    })

    applyOptimistic({ update })

    await vi.waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    vi.advanceTimersByTime(5000)

    await vi.waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    vi.useRealTimers()
  })

  it('dismisses toast on dismiss button click', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('error', { status: 500 }))

    render(<RevertToast />)

    const update = createOptimisticUpdate({
      action: 'add',
      target: 'comments:i1',
      data: { body: 'New comment' },
      revert: { action: 'remove', target: 'comments:i1', data: null },
      request: { method: 'POST', url: '/api/comments', body: { body: 'New comment' } },
    })

    applyOptimistic({ update })

    await vi.waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.getByText(/Reverted.*comments:i1/)).toBeInTheDocument()

    screen.getByRole('button', { name: 'Dismiss' }).click()

    await vi.waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('revert toast does not appear when fetch succeeds', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))

    render(<RevertToast />)

    const update = createOptimisticUpdate({
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1', body: { statusId: 'done' } },
    })

    applyOptimistic({ update })

    await vi.waitFor(() => {
      expect(useOptimisticStore.getState().pending).toHaveLength(0)
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
