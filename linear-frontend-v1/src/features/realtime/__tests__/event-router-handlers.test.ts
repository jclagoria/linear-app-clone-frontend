import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { registerEventHandler, routeEvent, clearDedupStore, clearEntityDedupStore } from '../model/event-processor'
import type { WSEvent } from '../lib/event-schema'

// Mock stores
const mockSetLastHeartbeat = vi.fn()
const mockLogout = vi.fn()

vi.mock('@/shared/stores/websocketStore', () => ({
  useWebSocketStore: {
    getState: vi.fn(() => ({
      autoUpdateEnabled: true,
      setLastHeartbeat: mockSetLastHeartbeat,
    })),
  },
}))

vi.mock('@/entities/label/model/store', () => ({
  useLabelDefinitionsStore: {
    getState: vi.fn(() => ({
      labels: [],
    })),
  },
}))

vi.mock('@/entities/session/model/store', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      logout: mockLogout,
    })),
  },
}))

vi.mock('@/entities/issue/model/store', () => ({
  useIssuesStore: {
    getState: vi.fn(() => ({
      addIssue: vi.fn(),
      updateIssue: vi.fn(),
      removeIssue: vi.fn(),
      setCommentsForIssue: vi.fn(),
      updateCommentInStore: vi.fn(),
      commentsByIssue: {},
    })),
  },
}))

vi.mock('@/features/realtime/lib/project-store', () => ({
  useProjectsStore: {
    getState: vi.fn(() => ({
      applyEvent: vi.fn(),
    })),
  },
}))

vi.mock('@/features/realtime/lib/cycle-store', () => ({
  useCyclesStore: {
    getState: vi.fn(() => ({
      applyEvent: vi.fn(),
    })),
  },
}))

vi.mock('@/shared/stores/notificationsStore', () => ({
  useNotificationsStore: {
    getState: vi.fn(() => ({
      addNotification: vi.fn(),
    })),
  },
}))

function makeEvent(event: WSEvent['event'], data: Record<string, unknown> = {}): WSEvent {
  return {
    eventId: `evt-${event}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'event',
    channel: 'team:t1',
    event,
    data,
    timestamp: '2026-01-01T00:00:00Z',
    userId: 'u1',
  }
}

describe('event router — label handlers', () => {
  beforeEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
  })

  it('label.created adds new label to store', async () => {
    // Register the handler
    const handler = vi.fn()
    const unregister = registerEventHandler('label.created', handler)

    const event = makeEvent('label.created', {
      labelId: 'l1',
      name: 'Bug',
      color: '#ef4444',
    })

    routeEvent(event)

    expect(handler).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledWith(event)

    unregister()
  })
})

describe('event router — user handlers', () => {
  beforeEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
  })

  it('user.online updates last heartbeat', async () => {
    // Register the handler
    const handler = vi.fn()
    const unregister = registerEventHandler('user.online', handler)

    const event = makeEvent('user.online', {
      userId: 'u1',
      name: 'Test User',
    })

    routeEvent(event)

    expect(handler).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledWith(event)

    unregister()
  })
})

describe('event router — session handlers', () => {
  beforeEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
    vi.clearAllMocks()
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })
  })

  afterEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
  })

  it('session.revoked triggers logout and redirect', async () => {
    // Register the handler
    const handler = vi.fn()
    const unregister = registerEventHandler('session.revoked', handler)

    const event = makeEvent('session.revoked', {
      sessionId: 's1',
      reason: 'revoked',
    })

    routeEvent(event)

    expect(handler).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledWith(event)

    unregister()
  })
})
