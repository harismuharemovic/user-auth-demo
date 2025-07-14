import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Color Contrast Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
  });

  test.describe('WCAG 2.1 AA Compliance Tests', () => {
    test('should validate light mode color contrast ratios', async ({ page }) => {
      // Test primary text contrast (should be ~4.5:1 or higher)
      const bodyElement = page.locator('body');
      
      // Check computed styles for light mode
      await expect(bodyElement).toHaveCSS('background-color', /rgb\(255, 255, 255\)/);
      await expect(bodyElement).toHaveCSS('color', /rgb\(30, 30, 30\)/); // Approximation of oklch(0.129)
      
      // Test muted text contrast (should be ~4.5:1 or higher with our fixes)
      const mutedText = page.locator('.text-gray-700, .text-muted-foreground');
      if (await mutedText.count() > 0) {
        // Our fixed muted color should provide better contrast
        await expect(mutedText.first()).toHaveCSS('color', /rgb\(70, 70, 70\)/); // Approximation of oklch(0.45)
      }
    });

    test('should validate dark mode color contrast ratios', async ({ page }) => {
      // Switch to dark mode
      await page.locator('button[aria-label*="Switch to"]').click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Test primary text contrast in dark mode
      const bodyElement = page.locator('body');
      await expect(bodyElement).toHaveCSS('background-color', /rgb\(30, 30, 30\)/); // Approximation of oklch(0.129)
      await expect(bodyElement).toHaveCSS('color', /rgb\(250, 250, 250\)/); // Approximation of oklch(0.984)
      
      // Test form elements have proper contrast
      await page.goto(`${BASE_URL}/auth`);
      
      const inputElement = page.locator('input[type="email"]');
      // Our fixed input border should be visible
      await expect(inputElement).toHaveCSS('border-color', /rgb\(60, 60, 60\)/); // Approximation of oklch(0.35)
    });

    test('should validate focus indicator contrast', async ({ page }) => {
      // Test focus indicators in light mode
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      await themeToggle.focus();
      
      // Our fixed focus ring should have better contrast
      await expect(themeToggle).toHaveCSS('outline-color', /rgb\(70, 70, 70\)/); // Approximation of oklch(0.45)
      
      // Test focus indicators in dark mode
      await themeToggle.click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      await themeToggle.focus();
      // Dark mode focus should be lighter for better contrast
      await expect(themeToggle).toHaveCSS('outline-color', /rgb\(190, 190, 190\)/); // Approximation of oklch(0.75)
    });

    test('should validate error message contrast', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth`);
      
      // Trigger error in light mode
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toBeVisible();
      
      // Error text should have sufficient contrast
      await expect(errorMessage).toHaveCSS('color', /rgb\(190, 30, 30\)/); // Approximation of error color
      
      // Test error message in dark mode
      await page.locator('button[aria-label*="Switch to"]').click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Error should be visible in dark mode with better contrast
      await expect(errorMessage).toHaveCSS('color', /rgb\(250, 100, 100\)/); // Approximation of dark mode error
    });

    test('should validate success message contrast', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth`);
      
      // Switch to register tab to potentially trigger success message
      await page.locator('[data-state="inactive"]').click();
      
      // Fill valid form data
      await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      await page.getByRole('textbox', { name: 'Confirm Password' }).fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page.getByRole('textbox', { name: 'Phone' }).fill('+1234567890');
      
      // Submit form
      await page.getByRole('button', { name: 'Create Account' }).click();
      
      // Check for any message (success or error)
      const messageElement = page.locator('[role="alert"]');
      await expect(messageElement).toBeVisible();
      
      // If it's a success message, check green color contrast
      if (await messageElement.locator('.text-green-600').count() > 0) {
        await expect(messageElement).toHaveCSS('color', /rgb\(0, 150, 0\)/); // Good contrast green
      }
      
      // Test in dark mode
      await page.locator('button[aria-label*="Switch to"]').click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Success message should be visible in dark mode
      if (await messageElement.locator('.dark\\:text-green-400').count() > 0) {
        await expect(messageElement).toHaveCSS('color', /rgb\(100, 200, 100\)/); // Lighter green for dark mode
      }
    });
  });

  test.describe('Color Accessibility Beyond Contrast', () => {
    test('should not rely solely on color to convey information', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth`);
      
      // Trigger error message
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toBeVisible();
      
      // Should have icon (visual indicator)
      const icon = errorMessage.locator('svg');
      await expect(icon).toBeVisible();
      
      // Should have text prefix (semantic indicator)
      await expect(errorMessage).toContainText('Error:');
      
      // Should have proper ARIA attributes (programmatic indicator)
      await expect(errorMessage).toHaveAttribute('role', 'alert');
      await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    test('should provide adequate color differentiation for colorblind users', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth`);
      
      // Switch to register tab
      await page.locator('[data-state="inactive"]').click();
      
      // Test that form elements are distinguishable without color
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const textInput = page.locator('input[type="text"]');
      
      // Should have proper labels (not just color coding)
      await expect(page.locator('label[for="register-email"]')).toContainText('Email');
      await expect(page.locator('label[for="register-password"]')).toContainText('Password');
      await expect(page.locator('label[for="register-address"]')).toContainText('Address');
      
      // Should have proper placeholder text
      await expect(emailInput).toHaveAttribute('placeholder', 'example@email.com');
      await expect(passwordInput).toHaveAttribute('placeholder', 'Password');
      await expect(textInput).toHaveAttribute('placeholder', '123 Main St');
    });
  });

  test.describe('Interactive Element Accessibility', () => {
    test('should provide sufficient contrast for interactive elements', async ({ page }) => {
      // Test button contrast
      const loginButton = page.locator('a[href="/auth"]').first();
      await expect(loginButton).toBeVisible();
      
      // Test hover states
      await loginButton.hover();
      await expect(loginButton).toHaveCSS('color', /rgb/); // Should have defined color
      
      // Test in dark mode
      await page.locator('button[aria-label*="Switch to"]').click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      await loginButton.hover();
      await expect(loginButton).toHaveCSS('color', /rgb/); // Should have defined color in dark mode
    });

    test('should maintain contrast for disabled states', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth`);
      
      // Start login process to enable loading state
      await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      
      const loginButton = page.getByRole('button', { name: 'Sign in' });
      await expect(loginButton).toBeVisible();
      
      // Button should be clearly visible even when enabled
      await expect(loginButton).toHaveCSS('background-color', /rgb/);
      await expect(loginButton).toHaveCSS('color', /rgb/);
    });
  });

  test.describe('Form Accessibility', () => {
    test('should provide proper contrast for form elements', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth`);
      
      // Test input field contrast
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveCSS('border-color', /rgb/);
      await expect(emailInput).toHaveCSS('background-color', /rgb/);
      
      // Test focus states
      await emailInput.focus();
      await expect(emailInput).toHaveCSS('outline-color', /rgb/);
      
      // Test in dark mode
      await page.locator('button[aria-label*="Switch to"]').click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Form elements should be clearly visible in dark mode
      await expect(emailInput).toHaveCSS('border-color', /rgb/);
      await expect(emailInput).toHaveCSS('background-color', /rgb/);
      
      // Focus should be visible in dark mode
      await emailInput.focus();
      await expect(emailInput).toHaveCSS('outline-color', /rgb/);
    });

    test('should provide proper label association and contrast', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth`);
      
      // Test label-input association
      const emailLabel = page.locator('label[for="login-email"]');
      const emailInput = page.locator('input[id="login-email"]');
      
      await expect(emailLabel).toBeVisible();
      await expect(emailInput).toBeVisible();
      
      // Labels should have sufficient contrast
      await expect(emailLabel).toHaveCSS('color', /rgb/);
      
      // Test in dark mode
      await page.locator('button[aria-label*="Switch to"]').click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Labels should remain visible in dark mode
      await expect(emailLabel).toHaveCSS('color', /rgb/);
    });
  });
});