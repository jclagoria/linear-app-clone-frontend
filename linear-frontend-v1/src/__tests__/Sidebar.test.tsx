import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from '@/widgets/Sidebar/ui/Sidebar'

function renderSidebar(collapsed = false, onToggle = vi.fn()) {
  return render(
    <BrowserRouter>
      <Sidebar collapsed={collapsed} onToggle={onToggle} />
    </BrowserRouter>,
  )
}

describe('Sidebar', () => {
  it('renders nav items', () => {
    renderSidebar()
    const sidebarItems = screen.getAllByText(/Dashboard|Issues|Projects|Cycles|Settings/)
    expect(sidebarItems.length).toBeGreaterThanOrEqual(5)
  })

  it('calls onToggle when collapse button is clicked', () => {
    const onToggle = vi.fn()
    renderSidebar(false, onToggle)

    const toggleBtn = screen.getByRole('button', { name: /collapse sidebar/i })
    fireEvent.click(toggleBtn)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows expand label when collapsed', () => {
    renderSidebar(true)
    expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument()
  })

  it('has correct aria-label on sidebar', () => {
    renderSidebar()
    const navElements = screen.getAllByLabelText('Main navigation')
    expect(navElements.length).toBeGreaterThanOrEqual(1)
  })

  it('is hidden on mobile (hidden lg:flex classes)', () => {
    const { container } = renderSidebar()
    const aside = container.querySelector('aside')
    expect(aside?.className).toContain('hidden')
    expect(aside?.className).toContain('lg:flex')
  })
})
