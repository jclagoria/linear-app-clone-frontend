import { http, HttpResponse } from 'msw'

const API_BASE = '/api/v1'

const createdAt = '2026-07-15T10:00:00Z'
const updatedAt = '2026-07-18T14:30:00Z'

const mockIssues = [
  { id: '1', title: 'Bug fix', description: 'Fix the bug', status: 'todo', priority: 1, assigneeId: 'u1', projectId: null, cycleId: null, labels: ['bug'], createdAt, updatedAt },
  { id: '2', title: 'Add feature', description: 'New feature', status: 'in_progress', priority: 2, assigneeId: 'u1', projectId: 'p1', cycleId: null, labels: [], createdAt, updatedAt },
  { id: '3', title: 'Documentation', description: 'Write docs', status: 'done', priority: 3, assigneeId: null, projectId: null, cycleId: null, labels: ['docs'], createdAt, updatedAt },
]

export const handlers = [
  // ── Auth ────────────────────────────────────────────────────────────

  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    if (body.email === 'valid@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        data: {
          accessToken: 'valid-access-token',
          user: {
            id: '1',
            email: 'valid@example.com',
            name: 'Valid User',
          },
        },
      })
    }

    return HttpResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' } },
      { status: 401 },
    )
  }),

  http.post(`${API_BASE}/auth/logout`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 },
      )
    }
    return HttpResponse.json({ data: { success: true } })
  }),

  http.post(`${API_BASE}/auth/refresh`, async () => {
    return HttpResponse.json({
      data: {
        accessToken: 'refreshed-access-token',
      },
    })
  }),

  http.get(`${API_BASE}/auth/me`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 },
      )
    }
    return HttpResponse.json({
      data: {
        id: '1',
        email: 'valid@example.com',
        name: 'Valid User',
      },
    })
  }),

  // ── Issues ──────────────────────────────────────────────────────────

  http.get(`${API_BASE}/issues`, ({ request }) => {
    const url = new URL(request.url)
    const cursor = url.searchParams.get('cursor')
    const statusId = url.searchParams.get('statusId')
    const labelIds = url.searchParams.get('labelIds')

    let filtered = [...mockIssues]
    if (statusId) filtered = filtered.filter((i) => i.status === statusId)
    if (labelIds) {
      const ids = labelIds.split(',')
      filtered = filtered.filter((i) => ids.some((id) => i.labels.includes(id)))
    }

    if (cursor === 'page2') {
      return HttpResponse.json({
        data: [{ id: '4', title: 'Page 2 issue', description: 'More', status: 'todo', priority: 1, assigneeId: null, projectId: null, cycleId: null, labels: [], createdAt: '', updatedAt: '' }],
        meta: { cursor: null, hasMore: false },
      })
    }

    return HttpResponse.json({
      data: filtered,
      meta: { cursor: filtered.length > 2 ? 'page2' : null, hasMore: filtered.length > 2 },
    })
  }),

  http.get(`${API_BASE}/issues/:id`, ({ params }) => {
    const { id } = params
    const issue = mockIssues.find((i) => i.id === id)

    if (!issue) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: `Issue ${id} not found` } },
        { status: 404 },
      )
    }

    return HttpResponse.json({ data: issue })
  }),

  // ── Error Simulation Endpoints ──────────────────────────────────────

  // ── Comments ────────────────────────────────────────────────────────

  http.delete(`${API_BASE}/issues/:issueId/comments/:commentId`, async ({ params }) => {
    const { commentId } = params
    const failing = commentId === 'fail-403'
    if (failing) {
      return HttpResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 },
      )
    }
    return HttpResponse.json({ data: { success: true } })
  }),

  http.get(`${API_BASE}/errors/bad-request`, () => {
    return HttpResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: [{ field: 'title', message: 'Title is required' }],
        },
      },
      { status: 400 },
    )
  }),

  http.get(`${API_BASE}/errors/forbidden`, () => {
    return HttpResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Access denied' } },
      { status: 403 },
    )
  }),

  http.get(`${API_BASE}/errors/conflict`, () => {
    return HttpResponse.json(
      { error: { code: 'CONFLICT', message: 'Resource already exists' } },
      { status: 409 },
    )
  }),

  http.get(`${API_BASE}/errors/business-rule`, () => {
    return HttpResponse.json(
      { error: { code: 'BUSINESS_RULE_ERROR', message: 'Cannot delete active resource' } },
      { status: 422 },
    )
  }),

  http.get(`${API_BASE}/errors/rate-limited`, () => {
    return HttpResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 30),
          'Retry-After': '30',
        },
      },
    )
  }),

  http.get(`${API_BASE}/errors/server-error`, () => {
    return HttpResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 },
    )
  }),
]
