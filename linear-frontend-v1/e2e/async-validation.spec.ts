import { test, expect } from '@playwright/test'

const API_BASE = '/api/v1'

test.describe('Async Validation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_BASE}/auth/refresh`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            accessToken: 'valid-token',
            user: { id: '1', email: 'user@example.com', name: 'Test User' },
          },
        }),
      })
    })

    await page.route(`${API_BASE}/auth/me`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: { id: '1', email: 'user@example.com', name: 'Test User' },
        }),
      })
    })
  })

  test('should show error for unavailable username', async ({ page }) => {
    await page.route(`${API_BASE}/check-username*`, async (route) => {
      const url = new URL(route.request().url())
      const username = url.searchParams.get('username')
      const taken = username === 'takenuser'
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ available: !taken }),
      })
    })

    await page.goto('/profile')

    await page.getByLabel(/name/i).clear()
    await page.getByLabel(/name/i).fill('takenuser')

    await expect(page.getByText('This username is already taken')).toBeVisible({ timeout: 5000 })
  })

  test('should allow submission with available username', async ({ page }) => {
    await page.route(`${API_BASE}/check-username*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ available: true }),
      })
    })

    await page.goto('/profile')

    await page.getByLabel(/name/i).clear()
    await page.getByLabel(/name/i).fill('availableuser')
    await page.getByLabel(/email/i).clear()
    await page.getByLabel(/email/i).fill('user@example.com')

    await page.getByRole('button', { name: /save profile/i }).click()

    await expect(page.getByRole('status')).toContainText(/profile updated successfully/i)
  })

  test('should clear async error when username becomes available', async ({ page }) => {
    let callCount = 0
    await page.route(`${API_BASE}/check-username*`, async (route) => {
      callCount++
      const url = new URL(route.request().url())
      const username = url.searchParams.get('username')
      const available = callCount > 1 || username !== 'takenuser'
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ available }),
      })
    })

    await page.goto('/profile')

    await page.getByLabel(/name/i).clear()
    await page.getByLabel(/name/i).fill('takenuser')

    await expect(page.getByText('This username is already taken')).toBeVisible({ timeout: 5000 })

    await page.getByLabel(/name/i).clear()
    await page.getByLabel(/name/i).fill('newuser')

    await expect(page.getByText('This username is already taken')).not.toBeVisible({ timeout: 5000 })
  })
})
