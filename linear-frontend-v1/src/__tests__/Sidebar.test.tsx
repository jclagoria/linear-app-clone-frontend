import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { OrgSidebar } from '@/widgets/OrgSidebar'

function renderOrgSidebar(collapsed = false, onToggle = vi.fn()) {
  return render(
    <BrowserRouter>
      <OrgSidebar collapsed={collapsed} onToggle={onToggle} />
    </BrowserRouter>,
  )
}

describe('OrgSidebar', () => {
  it('renders nav items', () => {
    renderOrgSidebar()
    const sidebarItems = screen.getAllByText(/Dashboard|Issues|Projects|Cycles|Settings/)
    expect(sidebarItems.length).toBeGreaterThanOrEqual(5)
  })

  it('calls onToggle when collapse button is clicked', () => {
    const onToggle = vi.fn()
    renderOrgSidebar(false, onToggle)

    const toggleBtn = screen.getByRole('button', { name: /collapse sidebar/i })
    fireEvent.click(toggleBtn)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows expand label when collapsed', () => {
    renderOrgSidebar(true)
    expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument()
  })

  it('has correct aria-label on sidebar', () => {
    renderOrgSidebar()
    const navElements = screen.getAllByLabelText('Organization navigation')
    expect(navElements.length).toBeGreaterThanOrEqual(1)
  })

  it('is hidden on mobile (hidden lg:flex classes)', () => {
    const { container } = renderOrgSidebar()
    const aside = container.querySelector('aside')
    expect(aside?.className).toContain('hidden')
    expect(aside?.className).toContain('lg:flex')
  })
})
