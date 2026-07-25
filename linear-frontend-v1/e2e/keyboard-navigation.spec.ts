import { test, expect } from '@playwright/test'

const ISSUES_PAGE = '/issues'

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/refresh', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'valid-token',
          user: { id: '1', email: 'user@example.com', name: 'Test User' },
        }),
      })
    })

    await page.route('**/api/issues', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          issues: [
            { id: '1', title: 'First Issue', status: 'todo' },
            { id: '2', title: 'Second Issue', status: 'in-progress' },
            { id: '3', title: 'Third Issue', status: 'done' },
          ],
        }),
      })
    })
  })

  test('J/K navigate issue list', async ({ page }) => {
    await page.goto(ISSUES_PAGE)
    await expect(page.getByText('First Issue')).toBeVisible()

    await page.keyboard.press('j')
    await page.keyboard.press('j')
    await page.keyboard.press('k')
  })

  test('Enter opens issue detail', async ({ page }) => {
    await page.goto(ISSUES_PAGE)
    await expect(page.getByText('First Issue')).toBeVisible()

    await page.keyboard.press('j')
    await page.keyboard.press('Enter')
  })

  test('Escape closes modal', async ({ page }) => {
    await page.goto(ISSUES_PAGE)
    await expect(page.getByText('First Issue')).toBeVisible()

    await page.keyboard.press('j')
    await page.keyboard.press('Enter')

    await page.keyboard.press('Escape')
  })

  test('? opens and closes help modal', async ({ page }) => {
    await page.goto(ISSUES_PAGE)
    await expect(page.getByText('First Issue')).toBeVisible()

    await page.keyboard.press('?')
    await expect(page.getByText('Keyboard Shortcuts')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByText('Keyboard Shortcuts')).not.toBeVisible()
  })

  test('shortcut help modal is filterable', async ({ page }) => {
    await page.goto(ISSUES_PAGE)
    await page.keyboard.press('?')

    const globalTab = page.getByRole('tab', { name: /global/i })
    await expect(globalTab).toBeVisible()
    await globalTab.click()
    await expect(globalTab).toHaveAttribute('aria-selected', 'true')
  })
})

test.describe('Context Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/refresh', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'valid-token',
          user: { id: '1', email: 'user@example.com', name: 'Test User' },
        }),
      })
    })
  })

  test('shortcuts change based on route', async ({ page }) => {
    await page.goto(ISSUES_PAGE)
    await expect(page.getByText('First Issue')).toBeVisible()

    await page.keyboard.press('j')
    await page.keyboard.press('s')
  })

  test('global shortcuts always active', async ({ page }) => {
    await page.goto('/settings/keyboard')
    await expect(page.getByText('Keyboard Shortcuts')).toBeVisible()

    await page.keyboard.press('?')
    await expect(page.getByText('Keyboard Shortcuts')).toBeVisible()
    await page.keyboard.press('Escape')
  })

  test('issue-specific shortcuts work with selection', async ({ page }) => {
    await page.route('**/api/issues', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          issues: [
            { id: '1', title: 'First Issue', status: 'todo' },
          ],
        }),
      })
    })

    await page.goto(ISSUES_PAGE)
    await expect(page.getByText('First Issue')).toBeVisible()

    await page.keyboard.press('j')
    await page.keyboard.press('s')
    await page.keyboard.press('a')
    await page.keyboard.press('l')
    await page.keyboard.press('e')
  })
})
