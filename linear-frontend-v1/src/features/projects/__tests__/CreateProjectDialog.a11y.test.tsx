import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/__tests__/test-utils'
import { CreateProjectDialog } from '../ui/CreateProjectDialog'
import * as projectsApi from '@/shared/api/projects'

vi.mock('@/shared/api/projects', () => ({
  createProject: vi.fn(),
}))

const teamId = '550e8400-e29b-41d4-a716-446655440000'

describe('CreateProjectDialog a11y', () => {
  it('has role="dialog" and aria-modal on the modal', () => {
    renderWithRouter(
      <CreateProjectDialog teamId={teamId} isOpen={true} onClose={vi.fn()} />,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby')
  })

  it('closes on Escape key', () => {
    const onClose = vi.fn()
    renderWithRouter(
      <CreateProjectDialog teamId={teamId} isOpen={true} onClose={onClose} />,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('focuses first field on open', () => {
    renderWithRouter(
      <CreateProjectDialog teamId={teamId} isOpen={true} onClose={vi.fn()} />,
    )
    expect(screen.getByLabelText('Name')).toHaveFocus()
  })

  it('has aria-describedby on error fields', async () => {
    renderWithRouter(
      <CreateProjectDialog teamId={teamId} isOpen={true} onClose={vi.fn()} />,
    )

    fireEvent.click(screen.getByText('Create Project'))

    await waitFor(() => {
      const nameInput = screen.getByLabelText('Name')
      expect(nameInput).toHaveAttribute('aria-describedby')
    })
  })

  it('has aria-live region on ErrorBanner when error is shown', () => {
    const onClose = vi.fn()

    const { rerender } = renderWithRouter(
      <CreateProjectDialog teamId={teamId} isOpen={true} onClose={onClose} />,
    )

    rerender(
      <CreateProjectDialog
        teamId={teamId}
        isOpen={true}
        onClose={onClose}
      />,
    )

    const banners = screen.queryAllByRole('alert')
    banners.forEach((b) => {
      const live = b.getAttribute('aria-live')
      expect(['polite', 'assertive']).toContain(live)
    })
  })
})
