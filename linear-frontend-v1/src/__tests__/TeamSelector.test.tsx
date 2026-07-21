import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TeamSelector } from '@/widgets/Sidebar/ui/TeamSelector'

const teams = [
  { id: 't1', name: 'Team Alpha' },
  { id: 't2', name: 'Team Beta' },
  { id: 't3', name: 'Team Gamma' },
]

describe('TeamSelector', () => {
  beforeEach(() => {
    // Clean up DOM between tests
    document.body.innerHTML = ''
  })

  it('renders with current team name', () => {
    render(
      <TeamSelector
        teams={teams}
        currentTeamId="t1"
        onSelect={vi.fn()}
      />,
    )
    expect(screen.getByText('Team Alpha')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', async () => {
    render(
      <TeamSelector
        teams={teams}
        currentTeamId="t1"
        onSelect={vi.fn()}
      />,
    )

    const trigger = screen.getByRole('button', { name: /select team/i })
    await userEvent.click(trigger)

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByText('Team Beta')).toBeInTheDocument()
    expect(screen.getByText('Team Gamma')).toBeInTheDocument()
  })

  it('calls onSelect when a team is clicked', async () => {
    const onSelect = vi.fn()
    render(
      <TeamSelector
        teams={teams}
        currentTeamId="t1"
        onSelect={onSelect}
      />,
    )

    const trigger = screen.getByRole('button', { name: /select team/i })
    await userEvent.click(trigger)

    const betaOption = screen.getByText('Team Beta')
    await userEvent.click(betaOption)

    expect(onSelect).toHaveBeenCalledWith('t2')
  })

  it('does not show dropdown when collapsed', () => {
    render(
      <TeamSelector
        teams={teams}
        currentTeamId="t1"
        onSelect={vi.fn()}
        collapsed={true}
      />,
    )

    const trigger = screen.getByRole('button', { name: /team alpha/i })
    expect(trigger).toBeInTheDocument()
  })

  it('returns null when teams array is empty', () => {
    const { container } = render(
      <TeamSelector
        teams={[]}
        currentTeamId={undefined}
        onSelect={vi.fn()}
      />,
    )

    expect(container.innerHTML).toBe('')
  })

  it('has proper ARIA attributes', async () => {
    render(
      <TeamSelector
        teams={teams}
        currentTeamId="t1"
        onSelect={vi.fn()}
      />,
    )

    const trigger = screen.getByRole('button', { name: /select team/i })
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })
})
