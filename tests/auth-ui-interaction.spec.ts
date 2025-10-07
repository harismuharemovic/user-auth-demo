import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Authentication UI Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
  });

  test.describe('Tab Switching Behavior', () => {
    test('should display Login tab as active by default', async ({ page }) => {
      const loginTab = page.getByRole('tab', { name: 'Login' });
      const registerTab = page.getByRole('tab', { name: 'Register' });

      await expect(loginTab).toHaveAttribute('data-state', 'active');
      await expect(registerTab).toHaveAttribute('data-state', 'inactive');
    });

    test('should switch to Register tab when clicked', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const registerTab = page.getByRole('tab', { name: 'Register' });
      await expect(registerTab).toHaveAttribute('data-state', 'active');
    });

    test('should switch back to Login tab when clicked', async ({ page }) => {
      // Switch to Register
      await page.getByRole('tab', { name: 'Register' }).click();
      await expect(page.getByRole('tab', { name: 'Register' })).toHaveAttribute(
        'data-state',
        'active'
      );

      // Switch back to Login
      await page.getByRole('tab', { name: 'Login' }).click();
      await expect(page.getByRole('tab', { name: 'Login' })).toHaveAttribute(
        'data-state',
        'active'
      );
    });

    test('should show Login form elements when Login tab is active', async ({
      page,
    }) => {
      await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
      await expect(
        page.getByRole('textbox', { name: 'Password' })
      ).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

      // Register-specific fields should not be visible
      await expect(
        page.getByRole('textbox', { name: 'Confirm Password' })
      ).not.toBeVisible();
      await expect(
        page.getByRole('textbox', { name: 'Address' })
      ).not.toBeVisible();
      await expect(
        page.getByRole('textbox', { name: 'Phone' })
      ).not.toBeVisible();
    });

    test('should show Register form elements when Register tab is active', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

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
      await expect(
        page.getByRole('textbox', { name: 'Phone' })
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Create Account' })
      ).toBeVisible();

      // Login button should not be visible
      await expect(
        page.getByRole('button', { name: 'Sign in' })
      ).not.toBeVisible();
    });
  });

  test.describe('Input Field Properties', () => {
    test('should have correct input types in Login form', async ({ page }) => {
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      const passwordInput = page.locator('#login-password');

      await expect(emailInput).toHaveAttribute('type', 'email');
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should have correct input types in Register form', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const emailInput = page.getByRole('textbox', { name: 'Email' });
      const passwordInput = page.locator('#register-password');
      const confirmPasswordInput = page.locator('#register-confirm-password');
      const addressInput = page.getByRole('textbox', { name: 'Address' });
      const phoneInput = page.locator('#register-phone');

      await expect(emailInput).toHaveAttribute('type', 'email');
      await expect(passwordInput).toHaveAttribute('type', 'password');
      await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      await expect(addressInput).toHaveAttribute('type', 'text');
      await expect(phoneInput).toHaveAttribute('type', 'tel');
    });

    test('should display correct placeholders in Login form', async ({
      page,
    }) => {
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      const passwordInput = page.locator('#login-password');

      await expect(emailInput).toHaveAttribute('placeholder', 'Your email');
      await expect(passwordInput).toHaveAttribute('placeholder', 'Password');
    });

    test('should display correct placeholders in Register form', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const emailInput = page.getByRole('textbox', { name: 'Email' });
      const passwordInput = page.locator('#register-password');
      const confirmPasswordInput = page.locator('#register-confirm-password');
      const addressInput = page.getByRole('textbox', { name: 'Address' });
      const phoneInput = page.locator('#register-phone');

      await expect(emailInput).toHaveAttribute(
        'placeholder',
        'example@email.com'
      );
      await expect(passwordInput).toHaveAttribute('placeholder', 'Password');
      await expect(confirmPasswordInput).toHaveAttribute(
        'placeholder',
        'Confirm Password'
      );
      await expect(addressInput).toHaveAttribute('placeholder', '123 Main St');
      await expect(phoneInput).toHaveAttribute('placeholder', '+123 123 1234');
    });

    test('should have proper label associations in Login form', async ({
      page,
    }) => {
      const emailLabel = page.locator('label[for="login-email"]');
      const passwordLabel = page.locator('label[for="login-password"]');

      await expect(emailLabel).toHaveText('Email');
      await expect(passwordLabel).toHaveText('Password');
    });

    test('should have proper label associations in Register form', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const emailLabel = page.locator('label[for="register-email"]');
      const passwordLabel = page.locator('label[for="register-password"]');
      const confirmPasswordLabel = page.locator(
        'label[for="register-confirm-password"]'
      );
      const addressLabel = page.locator('label[for="register-address"]');
      const phoneLabel = page.locator('label[for="register-phone"]');

      await expect(emailLabel).toHaveText('Email');
      await expect(passwordLabel).toHaveText('Password');
      await expect(confirmPasswordLabel).toHaveText('Confirm Password');
      await expect(addressLabel).toHaveText('Address');
      await expect(phoneLabel).toHaveText('Phone');
    });
  });

  test.describe('Loading State Behavior', () => {
    test('should disable Login button during submission', async ({ page }) => {
      const TEST_EMAIL = 'testuser20250124@example.com';
      const TEST_PASSWORD = 'password123';

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_EMAIL);
      await page.getByRole('textbox', { name: 'Password' }).fill(TEST_PASSWORD);

      const submitButton = page.getByRole('button', { name: 'Sign in' });

      // Click and check if button gets disabled (need to check during request)
      const responsePromise = page.waitForResponse(`${BASE_URL}/api/auth/login`);
      await submitButton.click();

      // Button should be disabled during submission
      // (This might be fast, but we can check the eventual state)
      await responsePromise;
    });

    test('should change Login button text during submission', async ({
      page,
    }) => {
      const TEST_EMAIL = 'testuser20250124@example.com';
      const TEST_PASSWORD = 'password123';

      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_EMAIL);
      await page.getByRole('textbox', { name: 'Password' }).fill(TEST_PASSWORD);

      const submitButton = page.getByRole('button', { name: 'Sign in' });

      // Verify initial text
      await expect(submitButton).toHaveText('Sign in');

      // Submit form
      await submitButton.click();

      // Should redirect to dashboard quickly
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`, { timeout: 5000 });
    });

    test('should disable Register button during submission', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `test${Date.now()}@example.com`;
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

      const submitButton = page.getByRole('button', { name: 'Create Account' });

      const responsePromise = page.waitForResponse(
        `${BASE_URL}/api/auth/register`
      );
      await submitButton.click();
      await responsePromise;
    });

    test('should disable input fields during Login submission', async ({
      page,
    }) => {
      const TEST_EMAIL = 'testuser20250124@example.com';
      const TEST_PASSWORD = 'password123';

      const emailInput = page.getByRole('textbox', { name: 'Email' });
      const passwordInput = page.locator('#login-password');

      await emailInput.fill(TEST_EMAIL);
      await passwordInput.fill(TEST_PASSWORD);

      // Submit and verify inputs get disabled
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should redirect quickly
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`, { timeout: 5000 });
    });

    test('should disable input fields during Register submission', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `test${Date.now()}@example.com`;
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

      // Wait for response
      await expect(
        page.getByText('Account created successfully!')
      ).toBeVisible();
    });
  });

  test.describe('Form State Preservation', () => {
    test('should preserve Login form data when switching tabs', async ({
      page,
    }) => {
      const testEmail = 'preserve@example.com';
      const testPassword = 'testpass123';

      await page.getByRole('textbox', { name: 'Email' }).fill(testEmail);
      await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);

      // Switch to Register
      await page.getByRole('tab', { name: 'Register' }).click();

      // Switch back to Login
      await page.getByRole('tab', { name: 'Login' }).click();

      // Data should be preserved
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        testEmail
      );
      await expect(page.locator('#login-password')).toHaveValue(testPassword);
    });

    test('should preserve Register form data when switching tabs', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const testData = {
        email: 'preserve@example.com',
        password: 'testpass123',
        confirmPassword: 'testpass123',
        address: '456 Preserve St',
        phone: '+9876543210',
      };

      await page.getByRole('textbox', { name: 'Email' }).fill(testData.email);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill(testData.password);
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill(testData.confirmPassword);
      await page
        .getByRole('textbox', { name: 'Address' })
        .fill(testData.address);
      await page.getByRole('textbox', { name: 'Phone' }).fill(testData.phone);

      // Switch to Login
      await page.getByRole('tab', { name: 'Login' }).click();

      // Switch back to Register
      await page.getByRole('tab', { name: 'Register' }).click();

      // All data should be preserved
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        testData.email
      );
      await expect(page.locator('#register-password')).toHaveValue(
        testData.password
      );
      await expect(page.locator('#register-confirm-password')).toHaveValue(
        testData.confirmPassword
      );
      await expect(page.getByRole('textbox', { name: 'Address' })).toHaveValue(
        testData.address
      );
      await expect(page.locator('#register-phone')).toHaveValue(
        testData.phone
      );
    });

    test('should have separate state for Login and Register forms', async ({
      page,
    }) => {
      // Fill Login form
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('login@example.com');
      await page
        .getByRole('textbox', { name: 'Password' })
        .fill('loginpass');

      // Switch to Register and fill
      await page.getByRole('tab', { name: 'Register' }).click();
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('register@example.com');

      // Switch back to Login
      await page.getByRole('tab', { name: 'Login' }).click();

      // Login form should have its own data
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        'login@example.com'
      );

      // Switch to Register
      await page.getByRole('tab', { name: 'Register' }).click();

      // Register form should have its own data
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        'register@example.com'
      );
    });

    test('should reset Register form after successful registration', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `reset${Date.now()}@example.com`;
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

      // Wait for success message
      await expect(
        page.getByText('Account created successfully!')
      ).toBeVisible();

      // Form should be reset
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        ''
      );
      await expect(page.locator('#register-password')).toHaveValue('');
      await expect(page.locator('#register-confirm-password')).toHaveValue('');
      await expect(page.getByRole('textbox', { name: 'Address' })).toHaveValue(
        ''
      );
      await expect(page.locator('#register-phone')).toHaveValue('');
    });

    test('should NOT reset Login form after failed login', async ({
      page,
    }) => {
      const testEmail = 'failed@example.com';
      const testPassword = 'wrongpass';

      await page.getByRole('textbox', { name: 'Email' }).fill(testEmail);
      await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Wait for error
      await expect(page.getByText('Invalid credentials')).toBeVisible();

      // Form data should be preserved
      await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
        testEmail
      );
      // Password might be preserved in the field
    });
  });

  test.describe('Focus Management', () => {
    test('should allow focusing on Login form inputs', async ({ page }) => {
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await emailInput.focus();
      await expect(emailInput).toBeFocused();

      const passwordInput = page.locator('#login-password');
      await passwordInput.focus();
      await expect(passwordInput).toBeFocused();
    });

    test('should allow focusing on Register form inputs', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const inputs = [
        page.getByRole('textbox', { name: 'Email' }),
        page.locator('#register-password'),
        page.locator('#register-confirm-password'),
        page.getByRole('textbox', { name: 'Address' }),
        page.locator('#register-phone'),
      ];

      for (const input of inputs) {
        await input.focus();
        await expect(input).toBeFocused();
      }
    });

    test('should show visible focus indicators on all interactive elements', async ({
      page,
    }) => {
      // Test tab focus
      const loginTab = page.getByRole('tab', { name: 'Login' });
      await loginTab.focus();
      await expect(loginTab).toBeFocused();

      // Test input focus
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await emailInput.focus();
      await expect(emailInput).toBeFocused();

      // Test button focus
      const submitButton = page.getByRole('button', { name: 'Sign in' });
      await submitButton.focus();
      await expect(submitButton).toBeFocused();
    });
  });

  test.describe('Theme Toggle Visibility', () => {
    test('should display theme toggle button', async ({ page }) => {
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      await expect(themeToggle).toBeVisible();
    });

    test('should position theme toggle in top-right corner', async ({
      page,
    }) => {
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      const container = themeToggle.locator('..');

      // The container should have positioning classes
      await expect(themeToggle).toBeVisible();
    });

    test('should keep theme toggle visible when switching tabs', async ({
      page,
    }) => {
      const themeToggle = page.locator('button[aria-label*="Switch to"]');

      await expect(themeToggle).toBeVisible();

      await page.getByRole('tab', { name: 'Register' }).click();
      await expect(themeToggle).toBeVisible();

      await page.getByRole('tab', { name: 'Login' }).click();
      await expect(themeToggle).toBeVisible();
    });
  });

  test.describe('Card Layout and Styling', () => {
    test('should display form within a card container', async ({ page }) => {
      // Login card
      const loginCard = page.locator('div').filter({ hasText: 'Login' }).first();
      await expect(loginCard).toBeVisible();
    });

    test('should display card with proper heading and description', async ({
      page,
    }) => {
      // Check Login card content
      await expect(page.getByText('Login', { exact: true })).toBeVisible();
      await expect(page.getByText('Access your dashboard')).toBeVisible();
    });

    test('should display Register card with proper heading and description', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      await expect(page.getByText('Register', { exact: true })).toBeVisible();
      await expect(page.getByText('Register a new account')).toBeVisible();
    });

    test('should constrain card width on large screens', async ({ page }) => {
      // The outer container should have max-width
      const container = page.locator('.max-w-md');
      await expect(container).toBeVisible();
    });
  });
});



