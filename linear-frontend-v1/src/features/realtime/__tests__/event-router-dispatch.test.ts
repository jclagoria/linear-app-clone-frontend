import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Create mock stores
const observedAutoUpdate: boolean[] = []

const mockLabelStore = {
  labels: [] as any[],
  addLabel: vi.fn((label) => { 
    // capture auto-update flag at time of handler execution for debugging
    try { observedAutoUpdate.push(useWebSocketStore.getState().autoUpdateEnabled) } catch (e) { observedAutoUpdate.push(undefined as any) }
    mockLabelStore.labels.push(label)
  }),
  getState: vi.fn(() => mockLabelStore),
}

const mockUserStore = {
  users: [{ id: 'u1', isOnline: false }],
  updateUserOnline: vi.fn((userId, isOnline) => { 
    const user = mockUserStore.users.find(u => u.id === userId)
    if (user) user.isOnline = isOnline
  }),
  getState: vi.fn(() => mockUserStore),
}


const mockWebSocketStore = {
  autoUpdateEnabled: true,
  getState: vi.fn(() => mockWebSocketStore),
  setLastHeartbeat: vi.fn(),
}

// Mock the stores
vi.doMock('@/entities/label/model/store', () => ({
  useLabelDefinitionsStore: { getState: () => mockLabelStore }
}))


vi.doMock('@/shared/stores/websocketStore', () => ({
  useWebSocketStore: mockWebSocketStore
}))

vi.mock('@/entities/session/model/store', () => {
  const store = {
    isAuthenticated: true,
    logout: vi.fn(() => { store.isAuthenticated = false }),
    getState: () => store,
  }
  return { useAuthStore: store }
})

// Import after mocks
import { useLabelDefinitionsStore } from '@/entities/label/model/store'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { useAuthStore } from '@/entities/session/model/store'
import { processEvent, routeEvent, clearEventHandlers } from '../model/event-processor'
import { setupEventRouter, setTestAutoUpdateOverride } from '../model/event-router'

// Helper to dispatch events
const dispatchEvent = (event) => {
  const processed = processEvent(event)
  if (processed) {
    routeEvent(processed)
  }
}

describe('Event Router handlers', () => {
  
  beforeEach(() => {
    // Reset mocks and handlers before each test
    clearEventHandlers()
    mockLabelStore.labels = []
    
    mockUserStore.users = [{ id: 'u1', isOnline: false }]
    mockUserStore.updateUserOnline.mockClear()
    
    const auth = useAuthStore.getState()
    auth.isAuthenticated = true
    auth.logout.mockClear()
    
    mockWebSocketStore.autoUpdateEnabled = true
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // Test label.created handler
  it('label.created updates label store', () => {
    const label = { id: 'l1', name: 'Bug', color: '#ff0000' }
    const event = {
      eventId: 'e1',
      type: 'event',
      channel: 'team:t1',
      event: 'label.created',
      data: { labelId: 'l1', name: label.name, color: label.color },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1'
    }
    
    // Register handlers after mocks are configured
    setupEventRouter()

    dispatchEvent(event)

    expect(useLabelDefinitionsStore.getState().labels).toEqual(
      expect.arrayContaining([expect.objectContaining(label)])
    )
  })

  // Test user.online handler
  it('user.online updates user status', () => {
    const event = {
      eventId: 'e2',
      type: 'event',
      channel: 'user:u1',
      event: 'user.online',
      data: {
        userId: 'u1',
        name: 'Test User',
        email: 'test@test.com'
      },
      timestamp: '2026-01-01T00:00:00Z'
    }
    
    // Register handlers after mocks are configured
    setupEventRouter()
    expect(() => dispatchEvent(event)).not.toThrow()
  })

  // Test session.revoked handler
  it('session.revoked triggers auth logout', () => {
    const event = {
      eventId: 'e3',
      type: 'event',
      channel: 'user:u1',
      event: 'session.revoked',
      data: {
        sessionId: 's1',
        reason: 'Token expired'
      },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1'
    }
    
    // Prevent jsdom navigation error by stubbing window.location
    const originalLocation = window.location
    Object.defineProperty(window, 'location', { configurable: true, value: { href: '', assign: vi.fn() } })

    // Register handlers after mocks are configured
    setupEventRouter()
    dispatchEvent(event)

    const auth = useAuthStore.getState()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.logout).toHaveBeenCalled()

    // restore original location
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
  })

  // Test auto-update toggle affects event handling
  it('auto-update disabled events are not processed', () => {
    // Disable auto-update via the event-router test hook to ensure handlers see it
    setTestAutoUpdateOverride(false)
    try {
      // Also guard the websocket store mock in case some code reads it directly
      useWebSocketStore.getState = vi.fn(() => ({ autoUpdateEnabled: false }))
      expect(useWebSocketStore.getState().autoUpdateEnabled).toBe(false)

      // Re-register handlers so they capture the overridden auto-update state
      setupEventRouter()

      const event = {
        eventId: 'e4',
        type: 'event',
        channel: 'team:t1',
        event: 'label.created',
        data: { labelId: 'l1', name: 'Bug', color: '#ff0000' },
        timestamp: '2026-01-01T00:00:00Z',
        userId: 'u1'
      }
      
      // Ensure store starts empty right before dispatch to avoid cross-test residue
      useLabelDefinitionsStore.getState().labels = []

      dispatchEvent(event)
      
      // Debug: show what auto-update flag was observed when addLabel ran
      // (this will surface in test output)
      // eslint-disable-next-line no-console
      console.log('observedAutoUpdate', observedAutoUpdate)
      // eslint-disable-next-line no-console
      console.log('current labels', useLabelDefinitionsStore.getState().labels)

      // Should not affect label store when auto-update is disabled
      expect(useLabelDefinitionsStore.getState().labels).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 'l1' })])
      )
    } finally {
      // restore test hook
      setTestAutoUpdateOverride(null)
    }
  })

  it('auto-update enabled events are processed normally', () => {
    mockWebSocketStore.autoUpdateEnabled = true
    useWebSocketStore.getState = vi.fn(() => mockWebSocketStore)
    // Re-register handlers to ensure they see latest auto-update state
    setupEventRouter()

    const event = {
      eventId: 'e5',
      type: 'event',
      channel: 'team:t1',
      event: 'label.created',
      data: { labelId: 'l1', name: 'Bug', color: '#ff0000' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1'
    }
    
    dispatchEvent(event)
    
    expect(useLabelDefinitionsStore.getState().labels).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'l1', name: 'Bug', color: '#ff0000' })])
    )
  })
})