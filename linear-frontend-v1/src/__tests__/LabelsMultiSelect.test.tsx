import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LabelsMultiSelect } from '@/entities/label/ui/LabelsMultiSelect'
import { useLabelDefinitionsStore } from '@/entities/label/model/store'
import { useCacheStore } from '@/shared/stores/cacheStore'
import { fetchLabelDefinitions } from '@/entities/label/api'
import { mockLabels } from './fixtures'

vi.mock('@/entities/label/api', () => ({
  fetchIssueLabels: vi.fn().mockResolvedValue({ data: [] }),
  attachLabel: vi.fn().mockResolvedValue({ data: { id: 'l1', name: 'Bug' } }),
  detachLabel: vi.fn().mockResolvedValue(undefined),
  fetchLabelDefinitions: vi.fn().mockResolvedValue({ data: [] }),
}))

describe('LabelsMultiSelect', () => {
  beforeEach(() => {
    useLabelDefinitionsStore.setState({
      labels: [],
      isLoading: false,
      error: null,
    })
    useCacheStore.getState().clear()
    vi.mocked(fetchLabelDefinitions).mockResolvedValue({ data: mockLabels })
  })

  it('renders label text and the combobox', () => {
    render(<LabelsMultiSelect selected={[]} onChange={vi.fn()} />)

    expect(screen.getByText('Labels')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows selected labels as chips when store has labels', async () => {
    useLabelDefinitionsStore.setState({ labels: mockLabels })

    render(<LabelsMultiSelect selected={['l1']} onChange={vi.fn()} />)

    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('shows remove button on each selected label chip', () => {
    useLabelDefinitionsStore.setState({ labels: mockLabels })

    render(<LabelsMultiSelect selected={['l1', 'l2']} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /Remove Bug label/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Remove Feature label/i })).toBeInTheDocument()
  })

  describe('dropdown behavior', () => {
    it('opens dropdown on combobox click', async () => {
      const user = userEvent.setup()
      render(<LabelsMultiSelect selected={[]} onChange={vi.fn()} />)

      await user.click(screen.getByRole('combobox'))

      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Search labels...')).toBeInTheDocument()
    })

    it('shows all labels in dropdown (LabelsMultiSelect only filters selected in the dropdown list, not the main view)', async () => {
      const user = userEvent.setup()
      render(<LabelsMultiSelect selected={['l1']} onChange={vi.fn()} />)

      await user.click(screen.getByRole('combobox'))

      expect(screen.queryByRole('option', { name: /Bug/i })).not.toBeInTheDocument()
      expect(screen.getByText('Feature')).toBeInTheDocument()
      expect(screen.getByText('Enhancement')).toBeInTheDocument()
    })

    it('closes dropdown when clicking outside', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <LabelsMultiSelect selected={[]} onChange={vi.fn()} />
        </div>,
      )

      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      await user.click(screen.getByTestId('outside'))
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })
  })

  describe('search', () => {
    it('filters labels by search query', async () => {
      const user = userEvent.setup()
      render(<LabelsMultiSelect selected={[]} onChange={vi.fn()} />)

      await user.click(screen.getByRole('combobox'))
      const searchInput = screen.getByPlaceholderText('Search labels...')
      await user.type(searchInput, 'Enhance')

      expect(screen.getByText('Enhancement')).toBeInTheDocument()
      expect(screen.queryByText('Bug')).not.toBeInTheDocument()
      expect(screen.queryByText('Feature')).not.toBeInTheDocument()
    })

    it('shows "No labels match your search" when search has no results', async () => {
      const user = userEvent.setup()
      render(<LabelsMultiSelect selected={[]} onChange={vi.fn()} />)

      await user.click(screen.getByRole('combobox'))
      const searchInput = screen.getByPlaceholderText('Search labels...')
      await user.type(searchInput, 'zzzzz')

      expect(screen.getByText('No labels match your search')).toBeInTheDocument()
    })

    it('shows "No labels available" when there are no labels at all', async () => {
      vi.mocked(fetchLabelDefinitions).mockResolvedValue({ data: [] })
      const user = userEvent.setup()

      render(<LabelsMultiSelect selected={[]} onChange={vi.fn()} />)

      await user.click(screen.getByRole('combobox'))

      expect(await screen.findByText('No labels available')).toBeInTheDocument()
    })
  })

  describe('selection behavior', () => {
    it('calls onChange with label id when selecting an unselected label', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(<LabelsMultiSelect selected={[]} onChange={handleChange} />)

      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByRole('option', { name: /^Bug$/i }))

      expect(handleChange).toHaveBeenCalledWith(['l1'])
    })

    it('calls onChange without label id when deselecting via chip remove', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      useLabelDefinitionsStore.setState({ labels: mockLabels })

      render(<LabelsMultiSelect selected={['l1']} onChange={handleChange} />)

      await user.click(screen.getByRole('button', { name: /Remove Bug label/i }))

      expect(handleChange).toHaveBeenCalledWith([])
    })
  })

  describe('error state', () => {
    it('shows error message with role="alert"', () => {
      render(
        <LabelsMultiSelect
          selected={[]}
          onChange={vi.fn()}
          error="One or more selected labels are invalid"
        />,
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('One or more selected labels are invalid')
    })

    it('applies error border styling to combobox', () => {
      render(
        <LabelsMultiSelect
          selected={[]}
          onChange={vi.fn()}
          error="Invalid label"
        />,
      )

      const combobox = screen.getByRole('combobox')
      expect(combobox.className).toContain('border-danger')
    })
  })

  describe('keyboard interaction', () => {
    it('closes dropdown on Escape key', async () => {
      const user = userEvent.setup()
      render(<LabelsMultiSelect selected={[]} onChange={vi.fn()} />)

      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      await user.keyboard('{Escape}')
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })
  })

  describe('ARIA attributes', () => {
    it('has aria-expanded on combobox', async () => {
      const user = userEvent.setup()
      render(<LabelsMultiSelect selected={[]} onChange={vi.fn()} />)

      const combobox = screen.getByRole('combobox')
      expect(combobox).toHaveAttribute('aria-expanded', 'false')

      await user.click(combobox)
      expect(combobox).toHaveAttribute('aria-expanded', 'true')
    })

    it('has aria-haspopup on combobox', () => {
      render(<LabelsMultiSelect selected={[]} onChange={vi.fn()} />)

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox')
    })

    it('has aria-multiselectable on listbox', async () => {
      const user = userEvent.setup()
      render(<LabelsMultiSelect selected={[]} onChange={vi.fn()} />)

      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true')
    })
  })
})
