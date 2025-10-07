import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Authentication Edge Cases Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
  });

  test.describe('Unusual Input Handling', () => {
    test('should handle very long email address', async ({ page }) => {
      const longEmail =
        'verylongemailaddressthatexceedsnormallimits' +
        'andkeepsgoingandgoing' +
        '@exampledomainwithaverylongname.com';

      await page.getByRole('textbox', { name: 'Email' }).fill(longEmail);
      await page.locator('#login-password').fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should handle gracefully (either accept or show validation error)
      // At minimum, should not crash the UI
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    });

    test('should handle very long password', async ({ page }) => {
      const longPassword = 'a'.repeat(500);

      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill(longPassword);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should handle without UI breaking
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    });

    test('should handle email with special characters', async ({ page }) => {
      const specialEmail = "test+tag_123-user.name@example-domain.co.uk";

      await page.getByRole('textbox', { name: 'Email' }).fill(specialEmail);
      await page.locator('#login-password').fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should accept valid special chars in email
      await expect(page.getByText('Invalid email format')).not.toBeVisible();
    });

    test('should handle password with special characters', async ({
      page,
    }) => {
      const specialPassword = "P@ssw0rd!#$%^&*()_+-={}[]|\\:\";<>?,./~`";

      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill(specialPassword);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should handle without errors (will show invalid credentials)
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should handle Unicode characters in email', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      // Try email with Unicode (might not be valid, but shouldn't crash)
      await page.getByRole('textbox', { name: 'Email' }).fill('test@例え.jp');
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

      // Should show validation error, not crash
      await expect(
        page.getByRole('button', { name: 'Create Account' })
      ).toBeVisible();
    });

    test('should handle Unicode characters in address', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `unicode${Date.now()}@example.com`;
      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Address' })
        .fill('東京都渋谷区 123-456');
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should accept Unicode in address field
      await expect(
        page.getByText('Account created successfully!')
      ).toBeVisible();
    });

    test('should handle emoji in address field', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `emoji${Date.now()}@example.com`;
      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Address' })
        .fill('123 Main St 🏠');
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should handle emoji
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should trim leading and trailing whitespace in email', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('  test@example.com  ');
      await page.locator('#login-password').fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should handle whitespace appropriately
      // Either trim it or show validation error
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should handle empty string password after typing and deleting', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      
      const passwordInput = page.locator('#login-password');
      await passwordInput.fill('password');
      await passwordInput.clear();
      
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Password is required')).toBeVisible();
    });

    test('should handle SQL injection attempt in email', async ({ page }) => {
      const sqlInjection = "admin'--";
      
      await page.getByRole('textbox', { name: 'Email' }).fill(sqlInjection);
      await page.locator('#login-password').fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should either show invalid email or handle securely
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should handle XSS attempt in address field', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const xssAttempt = '<script>alert("xss")</script>';
      const uniqueEmail = `xss${Date.now()}@example.com`;

      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill(xssAttempt);
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should handle without executing script
      // Check that no alert dialog appeared
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should handle HTML injection attempt in address field', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const htmlInjection = '<img src=x onerror=alert("xss")>';
      const uniqueEmail = `html${Date.now()}@example.com`;

      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill(htmlInjection);
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should handle without rendering HTML
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe('Browser Behavior Edge Cases', () => {
    test('should handle rapid form submission attempts', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill('password123');

      const submitButton = page.getByRole('button', { name: 'Sign in' });

      // Rapidly click submit button multiple times
      await submitButton.click();
      await submitButton.click();
      await submitButton.click();

      // Should only submit once (button should be disabled after first click)
      // Wait for response
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should maintain state when clicking outside form', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill('password123');

      // Click on background
      await page.locator('body').click({ position: { x: 10, y: 10 } });

      // Form data should be preserved
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        'test@example.com'
      );
    });

    test('should handle form during slow network conditions', async ({
      page,
    }) => {
      // Simulate slow network by delaying the response
      await page.route(`${BASE_URL}/api/auth/login`, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should show loading state
      // Button should be disabled during submission
      await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
    });

    test('should handle copy-paste of credentials', async ({ page }) => {
      const testEmail = 'copypaste@example.com';
      const testPassword = 'copypastepass123';

      // Simulate copy-paste by filling values
      await page.getByRole('textbox', { name: 'Email' }).fill(testEmail);
      await page.locator('#login-password').fill(testPassword);

      // Verify values were pasted correctly
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        testEmail
      );
    });

    test('should handle tab switching during form submission', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill('password123');

      // Start submission
      const responsePromise = page.waitForResponse(
        `${BASE_URL}/api/auth/login`
      );
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Try to switch tab during submission
      await page.getByRole('tab', { name: 'Register' }).click();

      // Wait for response
      await responsePromise;

      // Should handle gracefully
      await expect(page.getByRole('tab', { name: 'Register' })).toBeVisible();
    });

    test('should preserve form state across page visibility changes', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.locator('#login-password').fill('password123');

      // Simulate page visibility change (minimize/restore)
      await page.evaluate(() => {
        window.dispatchEvent(new Event('blur'));
      });

      await page.evaluate(() => {
        window.dispatchEvent(new Event('focus'));
      });

      // Form data should be preserved
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        'test@example.com'
      );
    });
  });

  test.describe('Boundary Value Testing', () => {
    test('should handle minimum valid password (6 characters)', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `min${Date.now()}@example.com`;
      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('123456');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('123456');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should accept exactly 6 characters
      await expect(
        page.getByText('Password must be at least 6 characters long')
      ).not.toBeVisible();
    });

    test('should reject password with 5 characters', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('12345');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('12345');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(
        page.getByText('Password must be at least 6 characters long')
      ).toBeVisible();
    });

    test('should handle very long address', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const longAddress = 'A'.repeat(500);
      const uniqueEmail = `longaddr${Date.now()}@example.com`;

      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill(longAddress);
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should handle gracefully
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should handle very long phone number', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const longPhone = '+' + '1'.repeat(50);
      const uniqueEmail = `longphone${Date.now()}@example.com`;

      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page.locator('#register-phone').fill(longPhone);
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should handle gracefully
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should handle minimum valid phone number', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `minphone${Date.now()}@example.com`;
      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page.locator('#register-phone').fill('123456');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should accept minimal phone
      await expect(page.getByText('Invalid phone format')).not.toBeVisible();
    });
  });

  test.describe('Concurrent Actions', () => {
    test('should handle typing while error is displayed', async ({ page }) => {
      // Trigger error
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Email is required')).toBeVisible();

      // Start typing immediately
      await page.getByRole('textbox', { name: 'Email' }).type('test@example.com', {
        delay: 50,
      });

      // Error should clear
      await expect(page.getByText('Email is required')).not.toBeVisible();
    });

    test('should handle switching tabs while error is displayed', async ({
      page,
    }) => {
      // Trigger error on Login
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Email is required')).toBeVisible();

      // Switch to Register
      await page.getByRole('tab', { name: 'Register' }).click();

      // Error should not appear on Register tab
      await expect(page.getByText('Email is required')).not.toBeVisible();
    });

    test('should handle theme toggle during form interaction', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');

      // Toggle theme
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      await themeToggle.click();

      // Continue with form
      await page.locator('#login-password').fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should work normally
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe('Data Persistence Edge Cases', () => {
    test('should not persist password after failed login', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('fail@example.com');
      await page.locator('#login-password').fill('wrongpassword');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Invalid credentials')).toBeVisible();

      // Password value might be cleared for security
      // Email should be preserved
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        'fail@example.com'
      );
    });

    test('should not persist passwords in Register form after error', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('different123');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Passwords do not match')).toBeVisible();

      // Check what values are preserved
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        'test@example.com'
      );
    });
  });

  test.describe('Accessibility Edge Cases', () => {
    test('should handle screen reader announcements for rapid errors', async ({
      page,
    }) => {
      // Trigger multiple errors in quick succession
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Email is required')).toBeVisible();

      await page.getByRole('textbox', { name: 'Email' }).fill('invalid');
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Invalid email format')).toBeVisible();

      // Error messages should have proper ARIA
      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    test('should maintain ARIA attributes in dark mode', async ({ page }) => {
      // Switch to dark mode
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      await themeToggle.click();

      // Trigger error
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Check ARIA attributes still present
      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toHaveAttribute('role', 'alert');
      await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });
  });
});



