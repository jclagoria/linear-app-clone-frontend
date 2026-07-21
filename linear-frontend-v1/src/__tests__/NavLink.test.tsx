import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { NavLink } from '@/widgets/Sidebar/ui/NavLink'
import { Home } from 'lucide-react'

function renderNavLink({
  to = '/',
  collapsed = false,
  onClick,
}: {
  to?: string
  collapsed?: boolean
  onClick?: () => void
} = {}) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <NavLink
        to={to}
        icon={<Home data-testid="nav-icon" className="h-4 w-4" />}
        label="Home"
        collapsed={collapsed}
        onClick={onClick}
      />
    </MemoryRouter>,
  )
}

describe('NavLink', () => {
  it('renders label and icon when expanded', () => {
    renderNavLink({ collapsed: false })
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByTestId('nav-icon')).toBeInTheDocument()
  })

  it('hides label when collapsed', () => {
    renderNavLink({ collapsed: true })
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
    expect(screen.getByTestId('nav-icon')).toBeInTheDocument()
  })

  it('renders as a link with proper href', () => {
    renderNavLink({ to: '/test' })
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    renderNavLink({ onClick })

    const link = screen.getByRole('link')
    await userEvent.click(link)
    expect(onClick).toHaveBeenCalled()
  })
})
