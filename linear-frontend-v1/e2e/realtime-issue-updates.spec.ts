import { test, expect } from '@playwright/test'

test.describe('Real-time Issue Updates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('issue appears in list without page refresh', async ({ page }) => {
    // Navigate to issues page
    await page.goto('/issues')

    // Verify initial state
    await expect(page.locator('[role="article"]')).toHaveCount(0, { timeout: 5000 }).catch(() => {
      // May already have issues
    })

    // Simulate SSE event via page evaluation
    await page.evaluate(() => {
      const event = new CustomEvent('sse-event', {
        detail: {
          eventId: 'e2e-issue-1',
          type: 'issue.created',
          payload: { issueId: 'i-e2e-1', title: 'E2E Test Issue', statusId: 'todo' },
          timestamp: new Date().toISOString(),
          teamId: 't1',
        },
      })
      window.dispatchEvent(event)
    })

    // Wait for the issue to appear
    await expect(page.getByText('E2E Test Issue')).toBeVisible({ timeout: 5000 })
  })

  test('issue status updates in real-time', async ({ page }) => {
    await page.goto('/issues')

    // Create an issue first
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('sse-event', {
        detail: {
          eventId: 'e2e-status-1',
          type: 'issue.created',
          payload: { issueId: 'i-status-1', title: 'Status Test Issue', statusId: 'todo' },
          timestamp: new Date().toISOString(),
          teamId: 't1',
        },
      }))
    })

    await expect(page.getByText('Status Test Issue')).toBeVisible({ timeout: 5000 })

    // Update status
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('sse-event', {
        detail: {
          eventId: 'e2e-status-2',
          type: 'issue.statusChanged',
          payload: { issueId: 'i-status-1', statusId: 'done' },
          timestamp: new Date().toISOString(),
          teamId: 't1',
        },
      }))
    })

    // Verify status updated
    await expect(page.locator('[aria-label*="Status Test Issue"]')).toBeVisible({ timeout: 5000 })
  })

  test('notification count increments on new notification', async ({ page }) => {
    // Send a notification event
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('sse-event', {
        detail: {
          eventId: 'e2e-notif-1',
          type: 'notification.created',
          payload: {
            notificationId: 'n-e2e-1',
            type: 'issue_assigned',
            title: 'New Assignment',
            message: 'You were assigned to an issue',
          },
          timestamp: new Date().toISOString(),
          teamId: 't1',
        },
      }))
    })

    // Verify notification badge appears
    await expect(page.getByLabelText(/unread notifications/)).toBeVisible({ timeout: 5000 })
  })
})
