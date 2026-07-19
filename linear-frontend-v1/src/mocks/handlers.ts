import { http, HttpResponse } from 'msw'

const API_BASE = '/api/v1'

const mockIssues = [
  { id: '1', title: 'Bug fix', description: 'Fix the bug', status: 'todo', priority: 1, assigneeId: 'u1', projectId: null, cycleId: null, labels: ['bug'], createdAt: '', updatedAt: '' },
  { id: '2', title: 'Add feature', description: 'New feature', status: 'in_progress', priority: 2, assigneeId: 'u1', projectId: 'p1', cycleId: null, labels: [], createdAt: '', updatedAt: '' },
  { id: '3', title: 'Documentation', description: 'Write docs', status: 'done', priority: 3, assigneeId: null, projectId: null, cycleId: null, labels: ['docs'], createdAt: '', updatedAt: '' },
]

export const handlers = [
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
      { message: 'Invalid email or password' },
      { status: 401 },
    )
  }),

  http.post(`${API_BASE}/auth/logout`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
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

  http.get(`${API_BASE}/issues`, ({ request }) => {
    const url = new URL(request.url)
    const cursor = url.searchParams.get('cursor')
    const status = url.searchParams.get('status')

    let filtered = [...mockIssues]
    if (status) filtered = filtered.filter((i) => i.status === status)

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
]