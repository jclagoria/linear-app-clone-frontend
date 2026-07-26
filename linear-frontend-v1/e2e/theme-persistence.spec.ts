import { test, expect } from '@playwright/test'

test.describe('Theme Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('theme persists across page refresh', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('[role="banner"]')

    // Click theme toggle to switch to dark mode
    const themeToggle = page.getByRole('button', { name: /switch to.*mode/i })
    await themeToggle.click()

    // Verify theme is set to dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Refresh page
    await page.reload()

    // Wait for page to load
    await page.waitForSelector('[role="banner"]')

    // Verify theme is still dark after refresh
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('theme persists across navigation', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('[role="banner"]')

    // Click theme toggle to switch to dark mode
    const themeToggle = page.getByRole('button', { name: /switch to.*mode/i })
    await themeToggle.click()

    // Verify theme is set to dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Navigate to settings page
    await page.click('a[href="/settings"]')
    await page.waitForSelector('h1:text("Settings")')

    // Verify theme is still dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Navigate back to dashboard
    await page.click('a[href="/"]')
    await page.waitForSelector('[role="banner"]')

    // Verify theme is still dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('system theme follows system preference', async ({ page }) => {
    // Set system preference to dark
    await page.emulateMedia({ colorScheme: 'dark' })

    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('[role="banner"]')

    // Click theme toggle to cycle to system mode
    const themeToggle = page.getByRole('button', { name: /switch to.*mode/i })

    // Click twice: light -> dark -> system
    await themeToggle.click()
    await themeToggle.click()

    // Verify theme is dark (following system preference)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Change system preference to light
    await page.emulateMedia({ colorScheme: 'light' })

    // Verify theme changes to light
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })
})