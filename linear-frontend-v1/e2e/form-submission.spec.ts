import { test, expect } from '@playwright/test'

const API_BASE = '/api/v1'

test.describe('Form Submission Flow E2E', () => {
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

  test('should submit create issue form with valid data', async ({ page }) => {
    await page.route(`${API_BASE}/issues`, async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              id: 'new-1',
              ...body,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }),
        })
      }
    })

    await page.goto('/issues/create')
    await expect(page.getByRole('heading', { name: /create issue/i })).toBeVisible()

    await page.getByLabel(/title/i).fill('Bug in dashboard')
    await page.getByLabel(/description/i).fill('The dashboard shows incorrect data')
    await page.getByLabel(/project/i).selectOption('project-alpha')
    await page.getByLabel(/priority/i).selectOption('high')

    await page.getByRole('button', { name: /create issue/i }).click()

    await expect(page.getByRole('status')).toContainText(/issue created successfully/i)
  })

  test('should submit profile form with valid data', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible()

    await page.getByLabel(/name/i).clear()
    await page.getByLabel(/name/i).fill('Jane Smith')
    await page.getByLabel(/email/i).clear()
    await page.getByLabel(/email/i).fill('jane@example.com')
    await page.getByLabel(/bio/i).clear()
    await page.getByLabel(/bio/i).fill('Full-stack developer')

    await page.getByRole('button', { name: /save profile/i }).click()

    await expect(page.getByRole('status')).toContainText(/profile updated successfully/i)
  })

  test('should submit project settings form with valid data', async ({ page }) => {
    await page.goto('/projects/p1/settings')
    await expect(page.getByRole('heading', { name: /project settings/i })).toBeVisible()

    await page.getByLabel(/project name/i).clear()
    await page.getByLabel(/project name/i).fill('Updated Project')
    await page.getByLabel(/project slug/i).clear()
    await page.getByLabel(/project slug/i).fill('updated-project')
    await page.getByLabel(/description/i).clear()
    await page.getByLabel(/description/i).fill('Updated description')

    await page.getByRole('button', { name: /save settings/i }).click()

    await expect(page.getByRole('status')).toContainText(/project settings updated successfully/i)
  })

  test('should show loading state during submission', async ({ page }) => {
    let resolveSubmit: () => void
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve
    })

    await page.route(`${API_BASE}/issues`, async (route) => {
      if (route.request().method() === 'POST') {
        await submitPromise
        const body = route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            data: { id: 'new-1', ...body },
          }),
        })
      }
    })

    await page.goto('/issues/create')
    await page.getByLabel(/title/i).fill('Slow issue')
    await page.getByLabel(/project/i).selectOption('project-alpha')
    await page.getByLabel(/priority/i).selectOption('medium')

    await page.getByRole('button', { name: /create issue/i }).click()

    await expect(page.getByRole('button', { name: /submitting/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /submitting/i })).toBeDisabled()

    resolveSubmit!()
  })
})
