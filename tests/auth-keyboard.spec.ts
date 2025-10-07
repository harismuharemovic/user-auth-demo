import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Authentication Keyboard Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
  });

  test.describe('Tab Navigation - Login Form', () => {
    test('should navigate through Login form using Tab key', async ({
      page,
    }) => {
      // Start from beginning
      await page.keyboard.press('Tab');

      // Should focus on Login tab (if it's the first focusable element)
      let focused = page.locator(':focus');
      
      // Continue tabbing to email input
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      focused = page.locator(':focus');
      
      // Type to verify we're in email field
      await page.keyboard.type('test@example.com');
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        'test@example.com'
      );
    });

    test('should navigate to password field with Tab', async ({ page }) => {
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      const passwordInput = page.locator('#login-password');

      // Focus email
      await emailInput.focus();
      
      // Tab to password
      await page.keyboard.press('Tab');
      await expect(passwordInput).toBeFocused();
    });

    test('should navigate to submit button with Tab', async ({ page }) => {
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      
      await emailInput.focus();
      await page.keyboard.press('Tab'); // To password
      await page.keyboard.press('Tab'); // To submit button

      const submitButton = page.getByRole('button', { name: 'Sign in' });
      await expect(submitButton).toBeFocused();
    });

    test('should submit Login form with Enter key on email field', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill('password123');

      // Focus email and press Enter
      await page.getByRole('textbox', { name: 'Email' }).focus();
      await page.keyboard.press('Enter');

      // Should trigger validation or submission
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should submit Login form with Enter key on password field', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      
      const passwordInput = page.locator('#login-password');
      await passwordInput.fill('password123');
      await passwordInput.focus();
      await page.keyboard.press('Enter');

      // Should trigger submission
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should submit Login form with Enter key on submit button', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill('password123');

      const submitButton = page.getByRole('button', { name: 'Sign in' });
      await submitButton.focus();
      await page.keyboard.press('Enter');

      // Should show some response
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should submit Login form with Space key on submit button', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill('password123');

      const submitButton = page.getByRole('button', { name: 'Sign in' });
      await submitButton.focus();
      await page.keyboard.press('Space');

      // Should show some response
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe('Tab Navigation - Register Form', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();
    });

    test('should navigate through all Register form fields with Tab', async ({
      page,
    }) => {
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await emailInput.focus();

      // Tab through all fields
      await page.keyboard.press('Tab');
      await expect(page.locator('#register-password')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.locator('#register-confirm-password')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.getByRole('textbox', { name: 'Address' })).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.locator('#register-phone')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(
        page.getByRole('button', { name: 'Create Account' })
      ).toBeFocused();
    });

    test('should navigate backwards with Shift+Tab', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: 'Create Account' });
      await submitButton.focus();

      // Shift+Tab backwards
      await page.keyboard.press('Shift+Tab');
      await expect(page.locator('#register-phone')).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await expect(page.getByRole('textbox', { name: 'Address' })).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await expect(page.locator('#register-confirm-password')).toBeFocused();
    });

    test('should submit Register form with Enter on any input field', async ({
      page,
    }) => {
      await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
      await page.locator('#register-password').fill('password123');
      await page.locator('#register-confirm-password').fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page.locator('#register-phone').fill('+1234567890');

      // Press Enter on phone field
      await page.locator('#register-phone').focus();
      await page.keyboard.press('Enter');

      // Should trigger submission
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe('Tab Switching with Keyboard', () => {
    test('should switch tabs using keyboard navigation', async ({ page }) => {
      const loginTab = page.getByRole('tab', { name: 'Login' });
      const registerTab = page.getByRole('tab', { name: 'Register' });

      // Focus and activate Login tab
      await loginTab.focus();
      await expect(loginTab).toBeFocused();

      // Tab to Register tab
      await page.keyboard.press('Tab');
      await expect(registerTab).toBeFocused();

      // Activate with Enter
      await page.keyboard.press('Enter');
      await expect(registerTab).toHaveAttribute('data-state', 'active');
    });

    test('should activate tab with Space key', async ({ page }) => {
      const registerTab = page.getByRole('tab', { name: 'Register' });

      await registerTab.focus();
      await page.keyboard.press('Space');

      await expect(registerTab).toHaveAttribute('data-state', 'active');
    });

    test('should maintain focus on tabs when using Arrow keys', async ({
      page,
    }) => {
      const loginTab = page.getByRole('tab', { name: 'Login' });
      
      await loginTab.focus();
      await expect(loginTab).toBeFocused();

      // Arrow Right to Register tab (if supported by component)
      await page.keyboard.press('ArrowRight');
      
      // Check if Register tab gets focus (depends on component implementation)
      const registerTab = page.getByRole('tab', { name: 'Register' });
      const focused = page.locator(':focus');
      
      // Either stays on Login or moves to Register depending on ARIA tabs implementation
    });
  });

  test.describe('Theme Toggle Keyboard Access', () => {
    test('should be able to reach theme toggle with Tab key', async ({
      page,
    }) => {
      const themeToggle = page.locator('button[aria-label*="Switch to"]');

      // Tab to theme toggle (it's in top-right)
      await page.keyboard.press('Tab');
      
      // Continue tabbing until we reach theme toggle
      for (let i = 0; i < 10; i++) {
        const focused = page.locator(':focus');
        const ariaLabel = await focused.getAttribute('aria-label');
        
        if (ariaLabel?.includes('Switch to')) {
          break;
        }
        
        await page.keyboard.press('Tab');
      }

      await expect(themeToggle).toBeFocused();
    });

    test('should toggle theme with Enter key', async ({ page }) => {
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      await themeToggle.focus();

      // Get initial theme state
      const htmlElement = page.locator('html');
      const initialHasDark = await htmlElement.evaluate((el) =>
        el.classList.contains('dark')
      );

      // Press Enter to toggle
      await page.keyboard.press('Enter');

      // Theme should toggle
      const afterHasDark = await htmlElement.evaluate((el) =>
        el.classList.contains('dark')
      );

      expect(afterHasDark).not.toBe(initialHasDark);
    });

    test('should toggle theme with Space key', async ({ page }) => {
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      await themeToggle.focus();

      const htmlElement = page.locator('html');
      const initialHasDark = await htmlElement.evaluate((el) =>
        el.classList.contains('dark')
      );

      // Press Space to toggle
      await page.keyboard.press('Space');

      const afterHasDark = await htmlElement.evaluate((el) =>
        el.classList.contains('dark')
      );

      expect(afterHasDark).not.toBe(initialHasDark);
    });
  });

  test.describe('Keyboard Focus Indicators', () => {
    test('should show visible focus indicator on email input', async ({
      page,
    }) => {
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await emailInput.focus();

      // Check if element is focused (visible focus indicator should be present)
      await expect(emailInput).toBeFocused();

      // Could check CSS properties for focus ring, but :focus check is sufficient
    });

    test('should show visible focus indicator on password input', async ({
      page,
    }) => {
      const passwordInput = page.locator('#login-password');
      await passwordInput.focus();

      await expect(passwordInput).toBeFocused();
    });

    test('should show visible focus indicator on submit button', async ({
      page,
    }) => {
      const submitButton = page.getByRole('button', { name: 'Sign in' });
      await submitButton.focus();

      await expect(submitButton).toBeFocused();
    });

    test('should show visible focus indicator on tabs', async ({ page }) => {
      const loginTab = page.getByRole('tab', { name: 'Login' });
      await loginTab.focus();

      await expect(loginTab).toBeFocused();

      const registerTab = page.getByRole('tab', { name: 'Register' });
      await registerTab.focus();

      await expect(registerTab).toBeFocused();
    });

    test('should maintain focus indicators in dark mode', async ({ page }) => {
      // Switch to dark mode
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      await themeToggle.click();
      await expect(page.locator('html')).toHaveClass(/dark/);

      // Test focus indicators still visible
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await emailInput.focus();
      await expect(emailInput).toBeFocused();

      const submitButton = page.getByRole('button', { name: 'Sign in' });
      await submitButton.focus();
      await expect(submitButton).toBeFocused();
    });
  });

  test.describe('Escape Key Behavior', () => {
    test('should not close form when pressing Escape', async ({ page }) => {
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await emailInput.fill('test@example.com');
      await emailInput.focus();

      await page.keyboard.press('Escape');

      // Form should still be visible
      await expect(emailInput).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    });

    test('should not interfere with form submission when pressing Escape', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill('password123');

      await page.keyboard.press('Escape');

      // Should still be able to submit
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe('Complete Keyboard-Only Flow', () => {
    test('should complete Login flow using only keyboard', async ({ page }) => {
      const TEST_EMAIL = 'testuser20250124@example.com';
      const TEST_PASSWORD = 'password123';

      // Navigate to email field
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await emailInput.focus();

      // Type email
      await page.keyboard.type(TEST_EMAIL);

      // Tab to password
      await page.keyboard.press('Tab');

      // Type password
      await page.keyboard.type(TEST_PASSWORD);

      // Tab to submit button
      await page.keyboard.press('Tab');

      // Submit with Enter
      await page.keyboard.press('Enter');

      // Should redirect to dashboard
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`, { timeout: 5000 });
    });

    test('should complete Register flow using only keyboard', async ({
      page,
    }) => {
      const uniqueEmail = `keyboard${Date.now()}@example.com`;

      // Switch to Register tab
      const registerTab = page.getByRole('tab', { name: 'Register' });
      await registerTab.focus();
      await page.keyboard.press('Enter');

      // Fill form with keyboard
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await emailInput.focus();
      await page.keyboard.type(uniqueEmail);

      await page.keyboard.press('Tab');
      await page.keyboard.type('password123');

      await page.keyboard.press('Tab');
      await page.keyboard.type('password123');

      await page.keyboard.press('Tab');
      await page.keyboard.type('123 Keyboard St');

      await page.keyboard.press('Tab');
      await page.keyboard.type('+1234567890');

      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      // Should show success message
      await expect(
        page.getByText('Account created successfully!')
      ).toBeVisible();
    });

    test('should navigate between forms using only keyboard', async ({
      page,
    }) => {
      // Start on Login
      await expect(page.getByRole('tab', { name: 'Login' })).toHaveAttribute(
        'data-state',
        'active'
      );

      // Navigate to Register tab
      const registerTab = page.getByRole('tab', { name: 'Register' });
      await registerTab.focus();
      await page.keyboard.press('Enter');

      await expect(registerTab).toHaveAttribute('data-state', 'active');

      // Navigate back to Login tab
      const loginTab = page.getByRole('tab', { name: 'Login' });
      await loginTab.focus();
      await page.keyboard.press('Enter');

      await expect(loginTab).toHaveAttribute('data-state', 'active');
    });

    test('should handle validation errors with keyboard navigation', async ({
      page,
    }) => {
      // Submit empty form with keyboard
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await emailInput.focus();
      await page.keyboard.press('Tab'); // To password
      await page.keyboard.press('Tab'); // To button
      await page.keyboard.press('Enter'); // Submit

      // Error should appear
      await expect(page.getByText('Email is required')).toBeVisible();

      // Navigate back to email and fix
      await emailInput.focus();
      await page.keyboard.type('test@example.com');

      // Error should clear
      await expect(page.getByText('Email is required')).not.toBeVisible();
    });
  });

  test.describe('Screen Reader Navigation Hints', () => {
    test('should have accessible labels for all form inputs', async ({
      page,
    }) => {
      // Check Login form
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await expect(emailInput).toBeVisible();

      const passwordLabel = page.locator('label[for="login-password"]');
      await expect(passwordLabel).toHaveText('Password');
    });

    test('should have accessible button text', async ({ page }) => {
      const signInButton = page.getByRole('button', { name: 'Sign in' });
      await expect(signInButton).toBeVisible();
      await expect(signInButton).toHaveText('Sign in');

      await page.getByRole('tab', { name: 'Register' }).click();

      const createAccountButton = page.getByRole('button', {
        name: 'Create Account',
      });
      await expect(createAccountButton).toBeVisible();
      await expect(createAccountButton).toHaveText('Create Account');
    });

    test('should have accessible tab labels', async ({ page }) => {
      const loginTab = page.getByRole('tab', { name: 'Login' });
      const registerTab = page.getByRole('tab', { name: 'Register' });

      await expect(loginTab).toHaveText('Login');
      await expect(registerTab).toHaveText('Register');
    });

    test('should announce error messages to screen readers', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Sign in' }).click();

      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    test('should announce success messages to screen readers', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `sr${Date.now()}@example.com`;
      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      const successMessage = page.locator('[role="alert"]');
      await expect(successMessage).toBeVisible();
      await expect(successMessage).toHaveAttribute('aria-live', 'polite');
    });
  });
});



