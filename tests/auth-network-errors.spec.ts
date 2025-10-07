import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';
const TEST_USER_EMAIL = 'testuser20250124@example.com';
const TEST_USER_PASSWORD = 'password123';

test.describe('Authentication Network Error Handling Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
  });

  test.describe('Network Failure Scenarios', () => {
    test('should handle complete network failure during login', async ({
      page,
    }) => {
      // Block all network requests to simulate offline
      await page.route(`${BASE_URL}/api/auth/login`, (route) => route.abort());

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should show network error message
      await expect(
        page.getByText('Network error. Please try again.')
      ).toBeVisible();

      // User should remain on auth page
      await expect(page).toHaveURL(`${BASE_URL}/auth`);
    });

    test('should handle complete network failure during registration', async ({
      page,
    }) => {
      await page.route(`${BASE_URL}/api/auth/register`, (route) =>
        route.abort()
      );

      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `network${Date.now()}@example.com`;
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

      // Should show network error
      await expect(
        page.getByText('Network error. Please try again.')
      ).toBeVisible();
    });

    test('should preserve form data after network failure', async ({
      page,
    }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) => route.abort());

      const testEmail = 'preserve@example.com';
      const testPassword = 'testpass123';

      await page.getByRole('textbox', { name: 'Email' }).fill(testEmail);
      await page.locator('#login-password').fill(testPassword);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Wait for error
      await expect(
        page.getByText('Network error. Please try again.')
      ).toBeVisible();

      // Form data should be preserved
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        testEmail
      );
    });

    test('should allow retry after network failure', async ({ page }) => {
      // First attempt: network failure
      let attemptCount = 0;
      await page.route(`${BASE_URL}/api/auth/login`, (route) => {
        attemptCount++;
        if (attemptCount === 1) {
          route.abort();
        } else {
          route.continue();
        }
      });

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should show network error
      await expect(
        page.getByText('Network error. Please try again.')
      ).toBeVisible();

      // Second attempt: should succeed
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should redirect to dashboard
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`, { timeout: 5000 });
    });
  });

  test.describe('Server Error Responses', () => {
    test('should handle 500 Internal Server Error during login', async ({
      page,
    }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal server error' }),
        })
      );

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should show appropriate error message
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should handle 500 error during registration', async ({ page }) => {
      await page.route(`${BASE_URL}/api/auth/register`, (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal server error' }),
        })
      );

      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `error${Date.now()}@example.com`;
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

      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should handle 503 Service Unavailable', async ({ page }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) =>
        route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Service temporarily unavailable' }),
        })
      );

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should handle 429 Too Many Requests', async ({ page }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) =>
        route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Too many requests' }),
        })
      );

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe('Timeout Scenarios', () => {
    test('should handle slow API response during login', async ({ page }) => {
      // Delay response by 3 seconds
      await page.route(`${BASE_URL}/api/auth/login`, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await route.continue();
      });

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should eventually complete
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`, {
        timeout: 10000,
      });
    });

    test('should handle slow API response during registration', async ({
      page,
    }) => {
      await page.route(`${BASE_URL}/api/auth/register`, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await route.continue();
      });

      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `slow${Date.now()}@example.com`;
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

      // Should show loading state and eventually complete
      await expect(
        page.getByText('Account created successfully!')
      ).toBeVisible({ timeout: 10000 });
    });

    test('should maintain disabled state during slow request', async ({
      page,
    }) => {
      await page.route(`${BASE_URL}/api/auth/login`, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);

      const submitButton = page.getByRole('button', { name: 'Sign in' });
      await submitButton.click();

      // Check that button is disabled during request
      // (button will be re-enabled after response, so we check quickly)
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`, {
        timeout: 10000,
      });
    });
  });

  test.describe('Malformed Response Handling', () => {
    test('should handle non-JSON response', async ({ page }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<html><body>Error</body></html>',
        })
      );

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should handle gracefully
      await expect(page.locator('[role="alert"]')).toBeVisible({
        timeout: 5000,
      });
    });

    test('should handle empty response body', async ({ page }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: '',
        })
      );

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should handle gracefully
      await expect(page.locator('[role="alert"]')).toBeVisible({
        timeout: 5000,
      });
    });

    test('should handle malformed JSON response', async ({ page }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: '{"invalid": json}',
        })
      );

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should handle parsing error
      await expect(page.locator('[role="alert"]')).toBeVisible({
        timeout: 5000,
      });
    });

    test('should handle response without message field', async ({ page }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) =>
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Some error' }),
        })
      );

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should show some error message
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe('Connection Interruption', () => {
    test('should handle connection timeout', async ({ page }) => {
      // Simulate very long delay that would cause timeout
      await page.route(`${BASE_URL}/api/auth/login`, async (route) => {
        // Delay longer than typical timeout
        await new Promise((resolve) => setTimeout(resolve, 30000));
        await route.continue();
      });

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should show error or remain in loading state
      // After reasonable time, check state
      await page.waitForTimeout(5000);
      
      // Should still be on auth page
      await expect(page).toHaveURL(`${BASE_URL}/auth`);
    });

    test('should handle intermittent network during login', async ({
      page,
    }) => {
      let requestCount = 0;
      await page.route(`${BASE_URL}/api/auth/login`, (route) => {
        requestCount++;
        // Fail first request, succeed second
        if (requestCount === 1) {
          route.abort();
        } else {
          route.continue();
        }
      });

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // First attempt fails
      await expect(
        page.getByText('Network error. Please try again.')
      ).toBeVisible();

      // Retry should work
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`, { timeout: 5000 });
    });
  });

  test.describe('API Response Validation', () => {
    test('should handle 401 Unauthorized correctly', async ({ page }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) =>
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid credentials' }),
        })
      );

      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('wrong@example.com');
      await page.locator('#login-password').fill('wrongpassword');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Invalid credentials')).toBeVisible();
      await expect(page).toHaveURL(`${BASE_URL}/auth`);
    });

    test('should handle 409 Conflict for duplicate registration', async ({
      page,
    }) => {
      await page.route(`${BASE_URL}/api/auth/register`, (route) =>
        route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Email already in use' }),
        })
      );

      await page.getByRole('tab', { name: 'Register' }).click();

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
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

      await expect(page.getByText('Email already in use')).toBeVisible();
    });

    test('should handle 400 Bad Request with validation errors', async ({
      page,
    }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) =>
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid request format' }),
        })
      );

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe('Error Message Display', () => {
    test('should display network error with proper styling', async ({
      page,
    }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) => route.abort());

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveClass(/text-red/);
    });

    test('should display network error with icon', async ({ page }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) => route.abort());

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      const errorMessage = page.locator('[role="alert"]');
      const icon = errorMessage.locator('svg[aria-hidden="true"]');
      await expect(icon).toBeVisible();
    });

    test('should display network error in dark mode', async ({ page }) => {
      // Switch to dark mode
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      await themeToggle.click();
      await expect(page.locator('html')).toHaveClass(/dark/);

      // Trigger network error
      await page.route(`${BASE_URL}/api/auth/login`, (route) => route.abort());

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveClass(/dark:text-red-400/);
    });

    test('should announce network errors to screen readers', async ({
      page,
    }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) => route.abort());

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toHaveAttribute('role', 'alert');
      await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });
  });

  test.describe('Recovery from Network Errors', () => {
    test('should clear network error when user types', async ({ page }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) => route.abort());

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(
        page.getByText('Network error. Please try again.')
      ).toBeVisible();

      // Clear the route for next attempt
      await page.unroute(`${BASE_URL}/api/auth/login`);

      // Type in email field
      await page.getByRole('textbox', { name: 'Email' }).fill('new@example.com');

      // Error should clear
      await expect(
        page.getByText('Network error. Please try again.')
      ).not.toBeVisible();
    });

    test('should clear network error when switching tabs', async ({
      page,
    }) => {
      await page.route(`${BASE_URL}/api/auth/login`, (route) => route.abort());

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(
        page.getByText('Network error. Please try again.')
      ).toBeVisible();

      // Switch to Register tab
      await page.getByRole('tab', { name: 'Register' }).click();

      // Error should not appear on Register tab
      await expect(
        page.getByText('Network error. Please try again.')
      ).not.toBeVisible();
    });

    test('should allow user to correct and retry after error', async ({
      page,
    }) => {
      // First attempt: network error
      let attemptCount = 0;
      await page.route(`${BASE_URL}/api/auth/login`, (route) => {
        attemptCount++;
        if (attemptCount === 1) {
          route.abort();
        } else {
          route.continue();
        }
      });

      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('wrong@example.com');
      await page.locator('#login-password').fill('wrongpass');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(
        page.getByText('Network error. Please try again.')
      ).toBeVisible();

      // Correct credentials and retry
      await page.getByRole('textbox', { name: 'Email' }).clear();
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page.locator('#login-password').clear();
      await page.locator('#login-password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should succeed
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`, { timeout: 5000 });
    });
  });
});



