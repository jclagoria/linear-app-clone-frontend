import { test, expect } from '@playwright/test'

const API_BASE = '/api/v1'

test.describe('Form Validation Error Display E2E', () => {
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

  test('should display required field errors on empty form submit', async ({ page }) => {
    await page.goto('/issues/create')

    await page.getByRole('button', { name: /create issue/i }).click()

    await expect(page.getByText('Title is required')).toBeVisible()
    await expect(page.getByText('Project is required')).toBeVisible()
    await expect(page.getByText('Priority is required')).toBeVisible()
  })

  test('should display min length error for short title', async ({ page }) => {
    await page.goto('/issues/create')

    await page.getByLabel(/title/i).fill('ab')
    await page.getByLabel(/title/i).blur()

    await expect(page.getByText('Title must be at least 3 characters')).toBeVisible()
  })

  test('should display max length error for long title', async ({ page }) => {
    await page.goto('/issues/create')

    await page.getByLabel(/title/i).fill('a'.repeat(256))
    await page.getByLabel(/title/i).blur()

    await expect(page.getByText('Title must be 255 characters or less')).toBeVisible()
  })

  test('should display validation errors for project settings', async ({ page }) => {
    await page.goto('/projects/p1/settings')

    await page.getByLabel(/project name/i).clear()
    await page.getByLabel(/project slug/i).clear()
    await page.getByRole('button', { name: /save settings/i }).click()

    await expect(page.getByText('Project name is required')).toBeVisible()
    await expect(page.getByText('Project slug is required')).toBeVisible()
  })

  test('should display slug pattern error', async ({ page }) => {
    await page.goto('/projects/p1/settings')

    await page.getByLabel(/project slug/i).clear()
    await page.getByLabel(/project slug/i).fill('Invalid Slug!')
    await page.getByLabel(/project slug/i).blur()

    await expect(page.getByText('Slug must contain only lowercase letters, numbers, and hyphens')).toBeVisible()
  })

  test('should display email validation error on profile page', async ({ page }) => {
    await page.goto('/profile')

    await page.getByLabel(/email/i).clear()
    await page.getByLabel(/email/i).fill('not-an-email')
    await page.getByLabel(/email/i).blur()

    await expect(page.getByText('Please enter a valid email address')).toBeVisible()
  })

  test('should clear errors when fields are corrected', async ({ page }) => {
    await page.goto('/issues/create')

    await page.getByRole('button', { name: /create issue/i }).click()
    await expect(page.getByText('Title is required')).toBeVisible()

    await page.getByLabel(/title/i).fill('Valid Title')
    await page.getByLabel(/title/i).blur()

    await expect(page.getByText('Title is required')).not.toBeVisible()
  })

  test('should display character count for textarea', async ({ page }) => {
    await page.goto('/issues/create')

    await expect(page.getByText('0/5000')).toBeVisible()

    await page.getByLabel(/description/i).fill('Hello World')

    await expect(page.getByText('11/5000')).toBeVisible()
  })
})
