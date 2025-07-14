import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Dark Mode Toggle Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto(`${BASE_URL}/`);
  });

  test('should display theme toggle button in navigation', async ({ page }) => {
    // Check that the theme toggle button is visible in the navigation
    await expect(page.locator('button[aria-label*="Switch to"]')).toBeVisible();
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Check initial theme (should be light by default)
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    // Click the theme toggle button
    await page.locator('button[aria-label*="Switch to"]').click();

    // Check that dark mode is now active
    await expect(html).toHaveClass(/dark/);

    // Click again to toggle back to light mode
    await page.locator('button[aria-label*="Switch to"]').click();

    // Check that light mode is now active
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    // Toggle to dark mode
    await page.locator('button[aria-label*="Switch to"]').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Reload the page
    await page.reload();

    // Check that dark mode is still active after reload
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should show correct icons for each theme', async ({ page }) => {
    // In light mode, sun icon should be visible and moon icon should be hidden
    const sunIcon = page.locator('svg').first();
    const moonIcon = page.locator('svg').nth(1);

    await expect(sunIcon).toBeVisible();
    await expect(moonIcon).not.toBeVisible();

    // Toggle to dark mode
    await page.locator('button[aria-label*="Switch to"]').click();

    // In dark mode, moon icon should be visible and sun icon should be hidden
    await expect(sunIcon).not.toBeVisible();
    await expect(moonIcon).toBeVisible();
  });

  test('should work on auth page', async ({ page }) => {
    // Navigate to auth page
    await page.goto(`${BASE_URL}/auth`);

    // Check that the theme toggle button is visible
    await expect(page.locator('button[aria-label*="Switch to"]')).toBeVisible();

    // Toggle to dark mode
    await page.locator('button[aria-label*="Switch to"]').click();

    // Check that dark mode is active
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Check that the background changed to dark
    await expect(page.locator('body')).toHaveClass(/dark/);
  });

  test('should work on dashboard page', async ({ page }) => {
    // First, register and login (using existing test data)
    await page.goto(`${BASE_URL}/auth`);
    
    // Login with test credentials
    await page.getByRole('textbox', { name: 'Email' }).fill('testuser20250124@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should be on dashboard
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);

    // Check that the theme toggle button is visible in dashboard header
    await expect(page.locator('button[aria-label*="Switch to"]')).toBeVisible();

    // Toggle to dark mode
    await page.locator('button[aria-label*="Switch to"]').click();

    // Check that dark mode is active
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should maintain theme across page navigation', async ({ page }) => {
    // Start on home page and toggle to dark mode
    await page.goto(`${BASE_URL}/`);
    await page.locator('button[aria-label*="Switch to"]').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Navigate to auth page
    await page.goto(`${BASE_URL}/auth`);
    
    // Check that dark mode is still active
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Toggle back to light mode
    await page.locator('button[aria-label*="Switch to"]').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    // Navigate back to home
    await page.goto(`${BASE_URL}/`);
    
    // Check that light mode is still active
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    const toggleButton = page.locator('button[aria-label*="Switch to"]');
    
    // Check that button has proper aria-label
    await expect(toggleButton).toHaveAttribute('aria-label', /Switch to (dark|light) mode/);
    
    // Toggle and check that aria-label updates
    await toggleButton.click();
    await expect(toggleButton).toHaveAttribute('aria-label', /Switch to (dark|light) mode/);
  });

  test('should respect system color scheme preference', async ({ page, context }) => {
    // Clear localStorage to test system preference
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());

    // Set system preference to dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Reload page to apply system preference
    await page.reload();

    // Should start in dark mode based on system preference
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Set system preference to light mode
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();

    // Should start in light mode based on system preference
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });
});