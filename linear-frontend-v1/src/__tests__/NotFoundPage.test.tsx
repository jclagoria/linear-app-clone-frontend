import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotFoundPage } from '@/pages/NotFoundPage'

function renderNotFoundPage() {
  return render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  )
}

describe('NotFoundPage', () => {
  it('renders heading', () => {
    renderNotFoundPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found')
  })

  it('renders descriptive message', () => {
    renderNotFoundPage()
    expect(screen.getByText(/doesn't exist/i)).toBeInTheDocument()
  })

  it('renders navigation link to dashboard', () => {
    renderNotFoundPage()
    const link = screen.getByRole('link', { name: /go to dashboard/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('uses role="alert" on main container', () => {
    renderNotFoundPage()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
