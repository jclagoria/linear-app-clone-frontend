import { test, expect } from '@playwright/test'

const API_BASE = '/api'

test.describe('Registration Flow', () => {
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

  test('navigate from login to register', async ({ page }) => {
    await page.goto('/login')
    
    // Click sign up link
    await page.getByText(/sign up/i).click()
    
    // Should be on register page
    await expect(page).toHaveURL('/register')
    await expect(page.getByText('Create your account')).toBeVisible()
  })

  test('register with valid credentials', async ({ page }) => {
    await page.route(`${API_BASE}/auth/register`, async (route) => {
      const request = route.request()
      const body = JSON.parse(request.postData() || '{}')

      if (body.email === 'newuser@example.com' && body.name === 'New User' && body.password === 'password123') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              accessToken: 'valid-token',
              user: { id: '1', email: 'newuser@example.com', name: 'New User' },
            },
          }),
        })
      } else {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Validation failed' }),
        })
      }
    })

    await page.goto('/register')
    
    // Fill in registration form
    await page.getByLabel(/name/i).fill('New User')
    await page.getByLabel(/email/i).fill('newuser@example.com')
    await page.getByLabel(/^password$/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click()
    
    // Should redirect to app (dashboard)
    await expect(page).toHaveURL('/', { timeout: 5000 })
  })

  test('register with existing email shows 409 error', async ({ page }) => {
    await page.route(`${API_BASE}/auth/register`, async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'An account with this email already exists' }),
      })
    })

    await page.goto('/register')
    
    // Fill in registration form with existing email
    await page.getByLabel(/name/i).fill('Existing User')
    await page.getByLabel(/email/i).fill('existing@example.com')
    await page.getByLabel(/^password$/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click()
    
    // Error message should appear
    await expect(page.getByRole('alert')).toContainText(/account with this email already exists/i)
    
    // Form should remain editable
    await expect(page.getByLabel(/name/i)).toBeEnabled()
    await expect(page.getByLabel(/email/i)).toBeEnabled()
  })

  test('register with short password shows client-side validation error', async ({ page }) => {
    await page.goto('/register')
    
    // Fill in registration form with short password
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^password$/i).fill('abc')
    await page.getByLabel(/confirm password/i).fill('abc')
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click()
    
    // Validation error should appear
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible()
  })

  test('register with password mismatch shows error', async ({ page }) => {
    await page.goto('/register')
    
    // Fill in registration form with mismatched passwords
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^password$/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password456')
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click()
    
    // Validation error should appear
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('loading state prevents duplicate submission', async ({ page }) => {
    let registerCalled = 0
    await page.route(`${API_BASE}/auth/register`, async (route) => {
      registerCalled++
      // Delay response to ensure loading state is visible
      await new Promise((resolve) => setTimeout(resolve, 500))
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            accessToken: 'valid-token',
            user: { id: '1', email: 'newuser@example.com', name: 'New User' },
          },
        }),
      })
    })

    await page.goto('/register')
    
    // Fill in registration form
    await page.getByLabel(/name/i).fill('New User')
    await page.getByLabel(/email/i).fill('newuser@example.com')
    await page.getByLabel(/^password$/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')
    
    // Click multiple times quickly
    await page.getByRole('button', { name: /create account/i }).click()
    await page.getByRole('button', { name: /create account/i }).click()
    await page.getByRole('button', { name: /create account/i }).click()
    
    // Wait for redirect
    await expect(page).toHaveURL('/', { timeout: 5000 })
    
    // Register should have been called only once
    expect(registerCalled).toBe(1)
  })

  test('form shows loading text during submission', async ({ page }) => {
    await page.route(`${API_BASE}/auth/register`, async (route) => {
      // Delay response to ensure loading state is visible
      await new Promise((resolve) => setTimeout(resolve, 500))
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            accessToken: 'valid-token',
            user: { id: '1', email: 'newuser@example.com', name: 'New User' },
          },
        }),
      })
    })

    await page.goto('/register')
    
    // Fill in registration form
    await page.getByLabel(/name/i).fill('New User')
    await page.getByLabel(/email/i).fill('newuser@example.com')
    await page.getByLabel(/^password$/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click()
    
    // Button should show loading text
    await expect(page.getByRole('button', { name: /creating/i })).toBeVisible()
    
    // Form fields should be disabled
    await expect(page.getByLabel(/name/i)).toBeDisabled()
    await expect(page.getByLabel(/email/i)).toBeDisabled()
    await expect(page.getByLabel(/^password$/i)).toBeDisabled()
    await expect(page.getByLabel(/confirm password/i)).toBeDisabled()
  })
})

test.describe('Registration Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_BASE}/auth/refresh`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'No session' }),
      })
    })
  })

  test('form fields have proper labels', async ({ page }) => {
    await page.goto('/register')
    
    // Check that all fields have associated labels
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/^password$/i)).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
  })

  test('error messages are announced to screen readers', async ({ page }) => {
    await page.goto('/register')
    
    // Submit empty form to trigger validation errors
    await page.getByRole('button', { name: /create account/i }).click()
    
    // Error messages should have role="alert" for screen readers
    const errorMessages = page.locator('[role="alert"]')
    await expect(errorMessages.first()).toBeVisible()
  })

  test('keyboard navigation works correctly', async ({ page }) => {
    await page.goto('/register')
    
    // Tab through form fields
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/name/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/email/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/^password$/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/confirm password/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /create account/i })).toBeFocused()
  })
})
