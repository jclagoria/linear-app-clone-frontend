import { test, expect } from '@playwright/test'

const API_BASE = '/api'

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept auth/refresh to simulate no session
    await page.route(`${API_BASE}/auth/refresh`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'No session' }),
      })
    })
  })

  test('login with valid credentials', async ({ page }) => {
    await page.route(`${API_BASE}/auth/login`, async (route) => {
      const request = route.request()
      const body = JSON.parse(request.postData() || '{}')

      if (body.email === 'user@example.com' && body.password === 'password123') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            accessToken: 'valid-token',
            user: { id: '1', email: 'user@example.com', name: 'Test User' },
          }),
        })
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid email or password' }),
        })
      }
    })

    await page.goto('/login')
    await expect(page.getByLabel(/email/i)).toBeVisible()

    await page.getByLabel(/email/i).fill('user@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /log in/i }).click()

    // Should redirect to app (dashboard)
    await expect(page).toHaveURL('/', { timeout: 5000 })
  })

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.route(`${API_BASE}/auth/login`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid email or password' }),
      })
    })

    await page.goto('/login')

    await page.getByLabel(/email/i).fill('wrong@example.com')
    await page.getByLabel(/password/i).fill('wrongpass')
    await page.getByRole('button', { name: /log in/i }).click()

    // Error message should appear
    await expect(page.getByRole('alert')).toContainText(/invalid email or password/i)
  })

  test('login with validation errors shows field-level messages', async ({ page }) => {
    await page.goto('/login')

    // Submit empty form
    await page.getByRole('button', { name: /log in/i }).click()

    // Should see validation errors
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible()
    await expect(page.getByText(/password must be at least 8/i)).toBeVisible()
  })

  test('loading state prevents duplicate submission', async ({ page }) => {
    let loginCalled = 0
    await page.route(`${API_BASE}/auth/login`, async (route) => {
      loginCalled++
      // Delay response to ensure loading state is visible
      await new Promise((resolve) => setTimeout(resolve, 500))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'valid-token',
          user: { id: '1', email: 'user@example.com', name: 'Test User' },
        }),
      })
    })

    await page.goto('/login')
    await page.getByLabel(/email/i).fill('user@example.com')
    await page.getByLabel(/password/i).fill('password123')

    // Click multiple times quickly
    await page.getByRole('button', { name: /log in/i }).click()
    await page.getByRole('button', { name: /log in/i }).click()
    await page.getByRole('button', { name: /log in/i }).click()

    // Wait for redirect
    await expect(page).toHaveURL('/', { timeout: 5000 })

    // Login should have been called only once
    expect(loginCalled).toBe(1)
  })
})

test.describe('Logout Flow', () => {
  test('logout clears session and redirects to login', async ({ page }) => {
    // Simulate authenticated state
    await page.route(`${API_BASE}/auth/refresh`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'valid-token',
          user: { id: '1', email: 'user@example.com', name: 'Test User' },
        }),
      })
    })

    await page.route(`${API_BASE}/auth/logout`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })

    // Navigate to app (will be authenticated via route mock)
    await page.goto('/')

    // Click user avatar to open dropdown
    const userButton = page.getByLabel(/user menu/i)
    await expect(userButton).toBeVisible()
    await userButton.click()

    // Click logout
    const logoutButton = page.getByRole('menuitem', { name: /log out/i })
    await expect(logoutButton).toBeVisible()
    await logoutButton.click()

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })
})

test.describe('Session Hydration', () => {
  test('valid session redirects to app without showing login', async ({ page }) => {
    await page.route(`${API_BASE}/auth/refresh`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'valid-token',
          user: { id: '1', email: 'user@example.com', name: 'Test User' },
        }),
      })
    })

    await page.goto('/login')

    // Should redirect to app since we're authenticated
    await expect(page).toHaveURL('/', { timeout: 5000 })
  })

  test('expired session shows login page', async ({ page }) => {
    await page.route(`${API_BASE}/auth/refresh`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'No session' }),
      })
    })

    await page.goto('/splash')

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })
})

test.describe('Protected Routes', () => {
  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.route(`${API_BASE}/auth/refresh`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'No session' }),
      })
    })

    // Try to access protected route
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })

  test('authenticated user can access protected routes', async ({ page }) => {
    await page.route(`${API_BASE}/auth/refresh`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'valid-token',
          user: { id: '1', email: 'user@example.com', name: 'Test User' },
        }),
      })
    })

    await page.goto('/')
    await expect(page.getByText(/dashboard/i)).toBeVisible({ timeout: 5000 })
  })
})
