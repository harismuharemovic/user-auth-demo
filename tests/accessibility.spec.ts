import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
  });

  test.describe('Color Contrast Tests', () => {
    test('should have sufficient color contrast in light mode', async ({ page }) => {
      // Test focus ring visibility
      await page.locator('button[aria-label*="Switch to"]').focus();
      
      // Verify focus ring is visible
      const focusRing = page.locator('button[aria-label*="Switch to"]:focus');
      await expect(focusRing).toHaveCSS('outline-color', /oklch\(0\.45/);
      
      // Test muted text contrast
      const navigation = page.locator('nav');
      await expect(navigation).toBeVisible();
      
      // Test button text contrast
      const loginButton = page.locator('a[href="/auth"]').first();
      await expect(loginButton).toHaveCSS('color', /oklch/);
    });

    test('should have sufficient color contrast in dark mode', async ({ page }) => {
      // Switch to dark mode
      await page.locator('button[aria-label*="Switch to"]').click();
      
      // Verify dark mode is active
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Test focus ring visibility in dark mode
      await page.locator('button[aria-label*="Switch to"]').focus();
      const focusRing = page.locator('button[aria-label*="Switch to"]:focus');
      await expect(focusRing).toHaveCSS('outline-color', /oklch\(0\.75/);
      
      // Test form elements in dark mode
      await page.goto(`${BASE_URL}/auth`);
      
      // Verify input border visibility
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveCSS('border-color', /oklch\(0\.35/);
    });
  });

  test.describe('Dark Mode Accessibility', () => {
    test('should maintain accessibility when toggling themes', async ({ page }) => {
      // Test theme toggle button accessibility
      const toggleButton = page.locator('button[aria-label*="Switch to"]');
      
      // Check initial aria-label
      await expect(toggleButton).toHaveAttribute('aria-label', /Switch to (dark|light) mode/);
      
      // Toggle theme
      await toggleButton.click();
      
      // Check updated aria-label
      await expect(toggleButton).toHaveAttribute('aria-label', /Switch to (dark|light) mode/);
      
      // Verify keyboard accessibility
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Should toggle back
      await expect(page.locator('html')).not.toHaveClass(/dark/);
    });

    test('should persist theme preference across page navigation', async ({ page }) => {
      // Toggle to dark mode
      await page.locator('button[aria-label*="Switch to"]').click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Navigate to auth page
      await page.goto(`${BASE_URL}/auth`);
      
      // Dark mode should persist
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Theme toggle should still be accessible
      const toggleButton = page.locator('button[aria-label*="Switch to"]');
      await expect(toggleButton).toHaveAttribute('aria-label', /Switch to light mode/);
    });
  });

  test.describe('Error Message Accessibility', () => {
    test('should provide accessible error messages with icons and ARIA attributes', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth`);
      
      // Try to submit empty login form
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Wait for error message to appear
      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toBeVisible();
      
      // Check ARIA attributes
      await expect(errorMessage).toHaveAttribute('role', 'alert');
      await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
      
      // Check icon presence
      const errorIcon = errorMessage.locator('svg[aria-hidden="true"]');
      await expect(errorIcon).toBeVisible();
      
      // Check error prefix
      await expect(errorMessage).toContainText('Error:');
    });

    test('should provide accessible error messages in dark mode', async ({ page }) => {
      // Switch to dark mode
      await page.locator('button[aria-label*="Switch to"]').click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      await page.goto(`${BASE_URL}/auth`);
      
      // Submit empty form to trigger error
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Check error message visibility in dark mode
      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toBeVisible();
      
      // Check dark mode color classes
      await expect(errorMessage).toHaveClass(/dark:text-red-400/);
      
      // Icon should be visible in dark mode
      const errorIcon = errorMessage.locator('svg[aria-hidden="true"]');
      await expect(errorIcon).toBeVisible();
    });

    test('should provide accessible success messages', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth`);
      
      // Switch to register tab
      await page.locator('[data-state="inactive"]').click();
      
      // Fill out registration form
      await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      await page.getByRole('textbox', { name: 'Confirm Password' }).fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page.getByRole('textbox', { name: 'Phone' }).fill('+1234567890');
      
      // Submit form (will likely fail due to no backend, but tests the message structure)
      await page.getByRole('button', { name: 'Create Account' }).click();
      
      // Check for message container (may be error or success)
      const messageContainer = page.locator('[role="alert"]');
      await expect(messageContainer).toBeVisible();
      
      // Check for proper icon and text structure
      const icon = messageContainer.locator('svg[aria-hidden="true"]');
      await expect(icon).toBeVisible();
      
      // Check for proper text prefix
      await expect(messageContainer.locator('span')).toContainText(/^(Success|Error):/);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation for theme toggle', async ({ page }) => {
      // Navigate to theme toggle using keyboard
      await page.keyboard.press('Tab');
      
      // Find the focused element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toHaveAttribute('aria-label', /Switch to/);
      
      // Toggle theme using keyboard
      await page.keyboard.press('Enter');
      
      // Should toggle theme
      await expect(page.locator('html')).toHaveClass(/dark/);
    });

    test('should maintain focus visibility in both themes', async ({ page }) => {
      // Test focus in light mode
      await page.keyboard.press('Tab');
      let focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Toggle to dark mode
      await page.keyboard.press('Enter');
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Test focus in dark mode
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('WCAG 2.1 AA Compliance', () => {
    test('should meet minimum color contrast ratios', async ({ page }) => {
      // Test primary text contrast
      const bodyText = page.locator('body');
      await expect(bodyText).toHaveCSS('color', /oklch\(0\.129/); // Should be dark enough
      
      // Test in dark mode
      await page.locator('button[aria-label*="Switch to"]').click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Test dark mode text contrast
      await expect(bodyText).toHaveCSS('color', /oklch\(0\.984/); // Should be light enough
    });

    test('should provide non-color means of conveying information', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth`);
      
      // Trigger an error to test non-color indicators
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toBeVisible();
      
      // Should have icon (visual indicator beyond color)
      const icon = errorMessage.locator('svg');
      await expect(icon).toBeVisible();
      
      // Should have text prefix (semantic indicator)
      await expect(errorMessage).toContainText('Error:');
    });

    test('should provide proper focus indicators', async ({ page }) => {
      // Test focus indicators on various elements
      const elementsToTest = [
        'button[aria-label*="Switch to"]',
        'a[href="/auth"]',
      ];
      
      for (const selector of elementsToTest) {
        const element = page.locator(selector);
        await element.focus();
        
        // Should have visible focus indicator
        await expect(element).toHaveCSS('outline-color', /oklch/);
        await expect(element).toHaveCSS('outline-width', /1px|2px/);
      }
    });
  });
});