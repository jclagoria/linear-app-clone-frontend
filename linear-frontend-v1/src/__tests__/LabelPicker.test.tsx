import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LabelPicker } from '@/entities/label/ui/LabelPicker'
import { useLabelDefinitionsStore } from '@/entities/label/model/store'
import { useCacheStore } from '@/shared/stores/cacheStore'
import { fetchLabelDefinitions } from '@/entities/label/api'

vi.mock('@/entities/label/api', () => ({
  fetchLabelDefinitions: vi.fn(),
}))

const mockLabels = [
  { id: 'l1', name: 'Bug', color: '#ef4444', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'l2', name: 'Feature', color: '#22c55e', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'l3', name: 'Enhancement', color: '#3b82f6', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
]

function renderLabelPicker(props: Partial<Parameters<typeof LabelPicker>[0]> = {}) {
  const triggerRef = { current: document.createElement('button') }
  const defaultProps = {
    selectedIds: [],
    onSelect: vi.fn(),
    onClose: vi.fn(),
    triggerRef,
  }

  return render(<LabelPicker {...defaultProps} {...props} />)
}

describe('LabelPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useLabelDefinitionsStore.setState({
      labels: [],
      isLoading: false,
      error: null,
    })
    useCacheStore.getState().clear()
  })

  describe('when labels are loaded', () => {
    beforeEach(() => {
      vi.mocked(fetchLabelDefinitions).mockResolvedValue({ data: mockLabels })
    })

    it('renders search input with placeholder', async () => {
      renderLabelPicker()
      expect(await screen.findByPlaceholderText('Search labels...')).toBeInTheDocument()
    })

    it('renders all labels when no search query', async () => {
      renderLabelPicker()
      expect(await screen.findByText('Bug')).toBeInTheDocument()
      expect(screen.getByText('Feature')).toBeInTheDocument()
      expect(screen.getByText('Enhancement')).toBeInTheDocument()
    })

    it('filters labels by search query', async () => {
      const user = userEvent.setup()
      renderLabelPicker()

      await screen.findByText('Bug')

      const searchInput = screen.getByPlaceholderText('Search labels...')
      await user.type(searchInput, 'Bug')

      expect(screen.getByText('Bug')).toBeInTheDocument()
      expect(screen.queryByText('Feature')).not.toBeInTheDocument()
      expect(screen.queryByText('Enhancement')).not.toBeInTheDocument()
    })

    it('shows "No labels match" when search yields no results', async () => {
      const user = userEvent.setup()
      renderLabelPicker()

      await screen.findByText('Bug')

      const searchInput = screen.getByPlaceholderText('Search labels...')
      await user.type(searchInput, 'zzzzz')

      expect(screen.getByText('No labels match your search')).toBeInTheDocument()
    })

    it('calls onSelect when a label is clicked', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()

      renderLabelPicker({ onSelect: handleSelect })

      await screen.findByText('Bug')
      await user.click(screen.getByText('Bug'))
      expect(handleSelect).toHaveBeenCalledWith(mockLabels[0])
    })

    it('calls onClose when Escape is pressed', async () => {
      const handleClose = vi.fn()
      const user = userEvent.setup()

      renderLabelPicker({ onClose: handleClose })

      await screen.findByPlaceholderText('Search labels...')
      await user.keyboard('{Escape}')
      expect(handleClose).toHaveBeenCalled()
    })

    it('highlights first option by default', async () => {
      renderLabelPicker()

      const options = await screen.findAllByRole('option')
      expect(options[0]).toHaveClass('bg-primary/10')
    })

    it('navigates down with ArrowDown key', async () => {
      const user = userEvent.setup()
      renderLabelPicker()

      const searchInput = await screen.findByPlaceholderText('Search labels...')
      searchInput.focus()
      await user.keyboard('{ArrowDown}')

      const options = screen.getAllByRole('option')
      expect(options[1]).toHaveClass('bg-primary/10')
    })

    it('navigates up with ArrowUp key', async () => {
      const user = userEvent.setup()
      renderLabelPicker()

      const searchInput = await screen.findByPlaceholderText('Search labels...')
      searchInput.focus()
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowUp}')

      const options = screen.getAllByRole('option')
      expect(options[0]).toHaveClass('bg-primary/10')
    })

    it('selects highlighted option with Enter key', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()

      renderLabelPicker({ onSelect: handleSelect })

      const searchInput = await screen.findByPlaceholderText('Search labels...')
      searchInput.focus()
      await user.keyboard('{Enter}')

      expect(handleSelect).toHaveBeenCalledWith(mockLabels[0])
    })

    it('wraps highlight around when navigating past last item', async () => {
      const user = userEvent.setup()
      renderLabelPicker()

      const searchInput = await screen.findByPlaceholderText('Search labels...')
      searchInput.focus()
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')

      const options = screen.getAllByRole('option')
      expect(options[0]).toHaveClass('bg-primary/10')
    })

    it('wraps highlight around when pressing up on first item', async () => {
      const user = userEvent.setup()
      renderLabelPicker()

      const searchInput = await screen.findByPlaceholderText('Search labels...')
      searchInput.focus()
      await user.keyboard('{ArrowUp}')

      const options = screen.getAllByRole('option')
      expect(options[options.length - 1]).toHaveClass('bg-primary/10')
    })

    it('highlights item on mouse enter', async () => {
      const user = userEvent.setup()
      renderLabelPicker()

      await screen.findByText('Bug')
      await user.hover(screen.getByText('Feature'))

      const options = screen.getAllByRole('option')
      expect(options[1]).toHaveClass('bg-primary/10')
    })

    it('has role="dialog" with accessible label', async () => {
      renderLabelPicker()

      expect(await screen.findByRole('dialog', { name: /Select a label/i })).toBeInTheDocument()
    })

    it('assigns aria-selected correctly', async () => {
      renderLabelPicker({ selectedIds: ['l2'] })

      const options = await screen.findAllByRole('option')
      expect(options[0]).toHaveAttribute('aria-selected', 'false')
      expect(options[1]).toHaveAttribute('aria-selected', 'true')
      expect(options[2]).toHaveAttribute('aria-selected', 'false')
    })

    it('focuses search input on mount', async () => {
      renderLabelPicker()
      expect(await screen.findByPlaceholderText('Search labels...')).toHaveFocus()
    })

    it('renders label color dots', async () => {
      renderLabelPicker()
      await screen.findByText('Bug')
      const dots = document.querySelectorAll('span[aria-hidden="true"]')
      expect(dots.length).toBeGreaterThanOrEqual(3)
    })

    it('shows all labels when no search (selected ones are indicated via aria-selected)', async () => {
      renderLabelPicker({ selectedIds: ['l1', 'l2'] })

      await screen.findByText('Bug')
      // Without search all labels are visible (selected ones highlighted via aria-selected)
      expect(screen.getByText('Bug')).toBeInTheDocument()
      expect(screen.getByText('Feature')).toBeInTheDocument()
      expect(screen.getByText('Enhancement')).toBeInTheDocument()
    })

    it('filters out selected labels when searching', async () => {
      const user = userEvent.setup()
      renderLabelPicker({ selectedIds: ['l1', 'l2'] })

      await screen.findByText('Bug')

      const searchInput = screen.getByPlaceholderText('Search labels...')
      await user.type(searchInput, 'Bug')

      // Bug is selected and search matches it - should be filtered out
      expect(screen.queryByText('Bug')).not.toBeInTheDocument()
      expect(screen.getByText('No labels match your search')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    beforeEach(() => {
      vi.mocked(fetchLabelDefinitions).mockResolvedValue({ data: [] })
    })

    it('shows empty state when no labels exist at all', async () => {
      renderLabelPicker()

      expect(await screen.findByText('No labels available')).toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    beforeEach(() => {
      vi.mocked(fetchLabelDefinitions).mockReturnValue(new Promise(() => {}))
    })

    it('shows loading state when loading', async () => {
      renderLabelPicker()

      expect(await screen.findByText('Loading labels...')).toBeInTheDocument()
    })
  })
})
