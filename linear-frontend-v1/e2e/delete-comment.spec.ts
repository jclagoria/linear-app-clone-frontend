import { test, expect } from '@playwright/test'

const API_BASE = '/api'

test.describe('Delete Comment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_BASE}/auth/refresh`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'valid-token',
          user: { id: 'u1', email: 'user@example.com', name: 'Test User' },
        }),
      })
    })
  })

  test('author can delete their own comment', async ({ page }) => {
    await page.route(`${API_BASE}/issues/1/comments`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'c1', issueId: '1', body: 'My comment to delete',
              authorId: 'u1', authorName: 'Test User',
              createdAt: '2024-01-01T12:00:00Z', updatedAt: '2024-01-01T12:00:00Z',
            },
            {
              id: 'c2', issueId: '1', body: 'Another comment',
              authorId: 'u2', authorName: 'Other User',
              createdAt: '2024-01-02T12:00:00Z', updatedAt: '2024-01-02T12:00:00Z',
            },
          ],
        }),
      })
    })

    let deleteCalled = false
    await page.route(`${API_BASE}/issues/1/comments/c1`, async (route) => {
      if (route.request().method() === 'DELETE') {
        deleteCalled = true
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { success: true } }),
        })
      }
    })

    await page.route(`${API_BASE}/issues`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '1', title: 'Test Issue', description: 'Test',
              status: 'todo', priority: 1, assigneeId: 'u1',
              projectId: null, cycleId: null, labels: [],
              createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
          meta: { cursor: null, hasMore: false },
        }),
      })
    })

    await page.goto('/issues/1')
    await expect(page.getByText('My comment to delete')).toBeVisible({ timeout: 5000 })

    await page.getByRole('button', { name: /delete comment/i }).click()
    await expect(page.getByText('Are you sure you want to delete this comment?')).toBeVisible()

    await page.getByRole('button', { name: /confirm delete/i }).click()

    await expect(page.getByText('My comment to delete')).not.toBeVisible({ timeout: 5000 })
    expect(deleteCalled).toBe(true)
  })

  test('non-author cannot see delete button', async ({ page }) => {
    await page.route(`${API_BASE}/issues/1/comments`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'c1', issueId: '1', body: 'Comment by other user',
              authorId: 'u2', authorName: 'Other User',
              createdAt: '2024-01-01T12:00:00Z', updatedAt: '2024-01-01T12:00:00Z',
            },
          ],
        }),
      })
    })

    await page.route(`${API_BASE}/issues`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '1', title: 'Test Issue', description: 'Test',
              status: 'todo', priority: 1, assigneeId: 'u1',
              projectId: null, cycleId: null, labels: [],
              createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
          meta: { cursor: null, hasMore: false },
        }),
      })
    })

    await page.goto('/issues/1')
    await expect(page.getByText('Comment by other user')).toBeVisible({ timeout: 5000 })

    await expect(page.getByRole('button', { name: /delete comment/i })).not.toBeVisible()
  })
})
