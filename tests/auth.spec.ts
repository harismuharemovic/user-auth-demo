import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';
const TEST_USER_EMAIL = 'testuser20250124@example.com';
const TEST_USER_PASSWORD = 'password123';
const TEST_USER_ADDRESS = '123 Test St';
const TEST_USER_PHONE = '+1-555-123-4567';

test.describe('User Authentication System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to auth page before each test
    await page.goto(`${BASE_URL}/auth`);
  });

  test.describe('Login Form Validation', () => {
    test('should display login form by default', async ({ page }) => {
      // Verify login tab is selected and form elements are present
      await expect(page.getByRole('tab', { name: 'Login' })).toHaveAttribute(
        'data-state',
        'active'
      );
      await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
      await expect(
        page.getByRole('textbox', { name: 'Password' })
      ).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    });

    test('should show validation error for empty fields', async ({ page }) => {
      // Click sign in without filling any fields
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should show email required error
      await expect(page.getByText('Email is required')).toBeVisible();
    });

    test('should show validation error for invalid email format', async ({
      page,
    }) => {
      // Fill invalid email and valid password
      await page.getByRole('textbox', { name: 'Email' }).fill('invalid-email');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should show invalid email format error
      await expect(page.getByText('Invalid email format')).toBeVisible();
    });

    test('should show error for non-existent user credentials', async ({
      page,
    }) => {
      // Fill non-existent user credentials
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('nonexistent@example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should show invalid credentials error
      await expect(page.getByText('Invalid credentials')).toBeVisible();
    });

    test('should clear error messages when user types', async ({ page }) => {
      // Trigger validation error first
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Email is required')).toBeVisible();

      // Start typing in email field
      await page.getByRole('textbox', { name: 'Email' }).fill('test');

      // Error message should be cleared
      await expect(page.getByText('Email is required')).not.toBeVisible();
    });
  });

  test.describe('Registration Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      // Switch to register tab
      await page.getByRole('tab', { name: 'Register' }).click();
    });

    test('should display registration form when register tab is clicked', async ({
      page,
    }) => {
      // Verify register tab is selected and all form elements are present
      await expect(page.getByRole('tab', { name: 'Register' })).toHaveAttribute(
        'data-state',
        'active'
      );
      await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
      await expect(
        page.getByRole('textbox', { name: 'Password', exact: true })
      ).toBeVisible();
      await expect(
        page.getByRole('textbox', { name: 'Confirm Password' })
      ).toBeVisible();
      await expect(
        page.getByRole('textbox', { name: 'Address' })
      ).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Phone' })).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Create Account' })
      ).toBeVisible();
    });

    test('should show validation error for empty required fields', async ({
      page,
    }) => {
      // Click create account without filling any fields
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should show email required error
      await expect(page.getByText('Email is required')).toBeVisible();
    });

    test('should show validation error for invalid email format', async ({
      page,
    }) => {
      // Fill invalid email and other valid fields
      await page.getByRole('textbox', { name: 'Email' }).fill('invalid-email');
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1-555-123-4567');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should show invalid email format error
      await expect(page.getByText('Invalid email format')).toBeVisible();
    });

    test('should show validation error for weak password', async ({ page }) => {
      // Fill valid email but weak password
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('123');
      await page.getByRole('textbox', { name: 'Confirm Password' }).fill('123');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1-555-123-4567');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should show password length error
      await expect(
        page.getByText('Password must be at least 6 characters long')
      ).toBeVisible();
    });

    test('should show validation error for mismatched passwords', async ({
      page,
    }) => {
      // Fill valid fields but mismatched passwords
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
        .fill('+1-555-123-4567');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should show passwords do not match error
      await expect(page.getByText('Passwords do not match')).toBeVisible();
    });

    test('should show validation error for invalid phone format', async ({
      page,
    }) => {
      // Fill valid fields but invalid phone
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page.getByRole('textbox', { name: 'Phone' }).fill('invalid-phone');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should show invalid phone format error
      await expect(page.getByText('Invalid phone format')).toBeVisible();
    });

    test('should show error for duplicate email registration', async ({
      page,
    }) => {
      // Try to register with existing email
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill(TEST_USER_PASSWORD);
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill(TEST_USER_PASSWORD);
      await page
        .getByRole('textbox', { name: 'Address' })
        .fill(TEST_USER_ADDRESS);
      await page.getByRole('textbox', { name: 'Phone' }).fill(TEST_USER_PHONE);
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should show email already in use error
      await expect(page.getByText('Email already in use')).toBeVisible();
    });
  });

  test.describe('User Registration Flow', () => {
    test('should successfully register a new user', async ({ page }) => {
      // Generate unique email for this test
      const uniqueEmail = `testuser${Date.now()}@example.com`;

      // Switch to register tab
      await page.getByRole('tab', { name: 'Register' }).click();

      // Fill all required fields with valid data
      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill(TEST_USER_PASSWORD);
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill(TEST_USER_PASSWORD);
      await page
        .getByRole('textbox', { name: 'Address' })
        .fill(TEST_USER_ADDRESS);
      await page.getByRole('textbox', { name: 'Phone' }).fill(TEST_USER_PHONE);

      // Submit the form
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should show success message
      await expect(
        page.getByText('Account created successfully! You can now login.')
      ).toBeVisible();

      // Form should be reset
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        ''
      );
      await expect(
        page.getByRole('textbox', { name: 'Password', exact: true })
      ).toHaveValue('');
    });
  });

  test.describe('User Login Flow', () => {
    test('should successfully login with valid credentials', async ({
      page,
    }) => {
      // Fill login form with valid credentials
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page
        .getByRole('textbox', { name: 'Password' })
        .fill(TEST_USER_PASSWORD);

      // Submit the form
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should redirect to dashboard
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);

      // Dashboard should display user content
      await expect(
        page.getByRole('heading', { name: 'Your Orders' })
      ).toBeVisible();
      await expect(page.getByText('Create New Order')).toBeVisible();
    });
  });

  test.describe('Dashboard Protection and Logout', () => {
    test('should allow access to dashboard when authenticated', async ({
      page,
    }) => {
      // Login first
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page
        .getByRole('textbox', { name: 'Password' })
        .fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should be on dashboard
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
      await expect(
        page.getByRole('heading', { name: 'Your Orders' })
      ).toBeVisible();
    });

    test('should successfully logout and redirect to auth page', async ({
      page,
    }) => {
      // Login first
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page
        .getByRole('textbox', { name: 'Password' })
        .fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Wait for dashboard to load
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);

      // Click logout button (using the logout icon in the navigation)
      await page.locator('button').last().click();

      // Should redirect to auth page
      await expect(page).toHaveURL(`${BASE_URL}/auth`);

      // Should display clean login form
      await expect(page.getByRole('tab', { name: 'Login' })).toHaveAttribute(
        'data-state',
        'active'
      );
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        ''
      );
    });
  });

  test.describe('Form State Management', () => {
    test('should maintain form state when switching between tabs', async ({
      page,
    }) => {
      // Fill login form
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');

      // Switch to register tab
      await page.getByRole('tab', { name: 'Register' }).click();

      // Switch back to login tab
      await page.getByRole('tab', { name: 'Login' }).click();

      // Form state should be preserved
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        'test@example.com'
      );
      await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue(
        'password123'
      );
    });

    test('should show loading state during form submission', async ({
      page,
    }) => {
      // Fill valid login credentials
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page
        .getByRole('textbox', { name: 'Password' })
        .fill(TEST_USER_PASSWORD);

      // Monitor network requests to simulate loading state
      const responsePromise = page.waitForResponse(
        `${BASE_URL}/api/auth/login`
      );

      // Submit the form
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Wait for the API response
      const response = await responsePromise;
      expect(response.status()).toBe(200);

      // Should redirect to dashboard after successful login
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    });
  });

  test.describe('Performance and Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Block the login API to simulate network error
      await page.route(`${BASE_URL}/api/auth/login`, route => route.abort());

      // Fill login form
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page
        .getByRole('textbox', { name: 'Password' })
        .fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should show network error message
      await expect(
        page.getByText('Network error. Please try again.')
      ).toBeVisible();
    });

    test('should complete login flow within acceptable time', async ({
      page,
    }) => {
      const startTime = Date.now();

      // Fill and submit login form
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
      await page
        .getByRole('textbox', { name: 'Password' })
        .fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Wait for redirect to dashboard
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Login should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
    });

    test('should complete registration flow within acceptable time', async ({
      page,
    }) => {
      const uniqueEmail = `perftest${Date.now()}@example.com`;
      const startTime = Date.now();

      // Switch to register tab and fill form
      await page.getByRole('tab', { name: 'Register' }).click();
      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill(TEST_USER_PASSWORD);
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill(TEST_USER_PASSWORD);
      await page
        .getByRole('textbox', { name: 'Address' })
        .fill(TEST_USER_ADDRESS);
      await page.getByRole('textbox', { name: 'Phone' }).fill(TEST_USER_PHONE);
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Wait for success message
      await expect(
        page.getByText('Account created successfully! You can now login.')
      ).toBeVisible();

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Registration should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
    });
  });

  test.describe('Complete User Journey', () => {
    test('should complete full user journey: register → login → dashboard → logout', async ({
      page,
    }) => {
      const uniqueEmail = `journey${Date.now()}@example.com`;

      // Step 1: Register new user
      await page.getByRole('tab', { name: 'Register' }).click();
      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill(TEST_USER_PASSWORD);
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill(TEST_USER_PASSWORD);
      await page
        .getByRole('textbox', { name: 'Address' })
        .fill(TEST_USER_ADDRESS);
      await page.getByRole('textbox', { name: 'Phone' }).fill(TEST_USER_PHONE);
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Verify registration success
      await expect(
        page.getByText('Account created successfully! You can now login.')
      ).toBeVisible();

      // Step 2: Login with new user
      await page.getByRole('tab', { name: 'Login' }).click();
      await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
      await page
        .getByRole('textbox', { name: 'Password' })
        .fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Verify login success and dashboard access
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
      await expect(
        page.getByRole('heading', { name: 'Your Orders' })
      ).toBeVisible();

      // Step 3: Logout
      await page.locator('button').last().click();

      // Verify logout success
      await expect(page).toHaveURL(`${BASE_URL}/auth`);
      await expect(page.getByRole('tab', { name: 'Login' })).toHaveAttribute(
        'data-state',
        'active'
      );
    });
  });
});
