import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Extended Authentication Validation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
  });

  test.describe('Login Form - Detailed Email Validation', () => {
    test('should reject email with no @ symbol', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Email' }).fill('testuser.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Invalid email format')).toBeVisible();
    });

    test('should reject email with only @ symbol', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Email' }).fill('@');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Invalid email format')).toBeVisible();
    });

    test('should reject email missing domain extension', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Email' }).fill('test@domain');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Invalid email format')).toBeVisible();
    });

    test('should reject email with space', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test user@example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Invalid email format')).toBeVisible();
    });

    test('should accept valid email with subdomain', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@mail.example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should not show email format error (will show invalid credentials instead)
      await expect(page.getByText('Invalid email format')).not.toBeVisible();
    });

    test('should accept email with plus sign', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test+tag@example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should not show email format error
      await expect(page.getByText('Invalid email format')).not.toBeVisible();
    });
  });

  test.describe('Login Form - Password Validation', () => {
    test('should show error when password is empty', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      // Leave password empty
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByText('Password is required')).toBeVisible();
    });

    test('should accept password with special characters', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page
        .getByRole('textbox', { name: 'Password' })
        .fill('P@ssw0rd!#$%');
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Should not show validation error (will show invalid credentials)
      await expect(page.getByText('Password is required')).not.toBeVisible();
    });
  });

  test.describe('Registration Form - Multiple Field Validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();
    });

    test('should validate email before password', async ({ page }) => {
      // Fill invalid email but valid other fields
      await page.getByRole('textbox', { name: 'Email' }).fill('bademail');
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

      await expect(page.getByText('Invalid email format')).toBeVisible();
    });

    test('should show password length error before mismatch error', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('123'); // Less than 6 chars
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('456'); // Different and less than 6 chars
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Should show password length error first
      await expect(
        page.getByText('Password must be at least 6 characters long')
      ).toBeVisible();
    });

    test('should validate all fields sequentially', async ({ page }) => {
      // Submit empty form
      await page.getByRole('button', { name: 'Create Account' }).click();
      await expect(page.getByText('Email is required')).toBeVisible();

      // Fill email, submit
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.getByRole('button', { name: 'Create Account' }).click();
      await expect(page.getByText('Password is required')).toBeVisible();

      // Fill password, submit
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page.getByRole('button', { name: 'Create Account' }).click();
      await expect(
        page.getByText('Confirm password is required')
      ).toBeVisible();

      // Fill confirm password, submit
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page.getByRole('button', { name: 'Create Account' }).click();
      await expect(page.getByText('Address is required')).toBeVisible();

      // Fill address, submit
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page.getByRole('button', { name: 'Create Account' }).click();
      await expect(page.getByText('Phone is required')).toBeVisible();
    });
  });

  test.describe('Registration Form - Phone Format Validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();
      // Fill valid data for other fields
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
    });

    test('should accept phone with international code', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Invalid phone format')).not.toBeVisible();
    });

    test('should accept phone with spaces', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1 234 567 8900');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Invalid phone format')).not.toBeVisible();
    });

    test('should accept phone with dashes', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('123-456-7890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Invalid phone format')).not.toBeVisible();
    });

    test('should accept phone with parentheses', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('(123) 456-7890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Invalid phone format')).not.toBeVisible();
    });

    test('should accept UK format phone', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+44 20 7123 4567');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Invalid phone format')).not.toBeVisible();
    });

    test('should reject phone with letters', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('abc123def');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Invalid phone format')).toBeVisible();
    });

    test('should reject phone with special characters (except allowed)', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('123@456#7890');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Invalid phone format')).toBeVisible();
    });

    test('should reject email-like phone input', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('user@phone.com');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Invalid phone format')).toBeVisible();
    });
  });

  test.describe('Registration Form - Password Requirements', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill('test@example.com');
      await page.getByRole('textbox', { name: 'Address' }).fill('123 Test St');
      await page
        .getByRole('textbox', { name: 'Phone' })
        .fill('+1234567890');
    });

    test('should accept password with exactly 6 characters', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('123456');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('123456');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(
        page.getByText('Password must be at least 6 characters long')
      ).not.toBeVisible();
    });

    test('should reject password with 5 characters', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('12345');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('12345');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(
        page.getByText('Password must be at least 6 characters long')
      ).toBeVisible();
    });

    test('should reject single character password', async ({ page }) => {
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('a');
      await page.getByRole('textbox', { name: 'Confirm Password' }).fill('a');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(
        page.getByText('Password must be at least 6 characters long')
      ).toBeVisible();
    });

    test('should accept very long password', async ({ page }) => {
      const longPassword = 'a'.repeat(100);
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill(longPassword);
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill(longPassword);
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(
        page.getByText('Password must be at least 6 characters long')
      ).not.toBeVisible();
    });

    test('should detect password mismatch with similar passwords', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password124'); // One character different
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Passwords do not match')).toBeVisible();
    });

    test('should detect password mismatch with case difference', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: 'Password', exact: true })
        .fill('Password123');
      await page
        .getByRole('textbox', { name: 'Confirm Password' })
        .fill('password123');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Passwords do not match')).toBeVisible();
    });
  });

  test.describe('Error Message Display and Styling', () => {
    test('should display error with red color in light mode', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Sign in' }).click();

      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveClass(/text-red-600/);
    });

    test('should display error with XCircle icon', async ({ page }) => {
      await page.getByRole('button', { name: 'Sign in' }).click();

      const errorMessage = page.locator('[role="alert"]');
      const icon = errorMessage.locator('svg[aria-hidden="true"]');
      await expect(icon).toBeVisible();
    });

    test('should display error with "Error: " prefix', async ({ page }) => {
      await page.getByRole('button', { name: 'Sign in' }).click();

      const errorMessage = page.locator('[role="alert"]');
      await expect(errorMessage.locator('span')).toContainText('Error:');
    });

    test('should display success with green color', async ({ page }) => {
      // Switch to register and create successful registration
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `success${Date.now()}@example.com`;
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
      await expect(successMessage).toHaveClass(/text-green-600/);
    });

    test('should display success with CheckCircle icon', async ({ page }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `success${Date.now()}@example.com`;
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
      const icon = successMessage.locator('svg[aria-hidden="true"]');
      await expect(icon).toBeVisible();
    });

    test('should display success with "Success: " prefix', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();

      const uniqueEmail = `success${Date.now()}@example.com`;
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
      await expect(successMessage.locator('span')).toContainText('Success:');
    });
  });

  test.describe('Error Message Clearing Behavior', () => {
    test('should clear login error when typing in email field', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Email is required')).toBeVisible();

      await page.getByRole('textbox', { name: 'Email' }).fill('t');
      await expect(page.getByText('Email is required')).not.toBeVisible();
    });

    test('should clear login error when typing in password field', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Email is required')).toBeVisible();

      await page.getByRole('textbox', { name: 'Password' }).fill('p');
      await expect(page.getByText('Email is required')).not.toBeVisible();
    });

    test('should clear registration error when typing in any field', async ({
      page,
    }) => {
      await page.getByRole('tab', { name: 'Register' }).click();
      await page.getByRole('button', { name: 'Create Account' }).click();
      await expect(page.getByText('Email is required')).toBeVisible();

      await page.getByRole('textbox', { name: 'Phone' }).fill('1');
      await expect(page.getByText('Email is required')).not.toBeVisible();
    });

    test('should not carry error messages between tabs', async ({ page }) => {
      // Trigger error on login
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Email is required')).toBeVisible();

      // Switch to register
      await page.getByRole('tab', { name: 'Register' }).click();
      await expect(page.getByText('Email is required')).not.toBeVisible();

      // Switch back to login
      await page.getByRole('tab', { name: 'Login' }).click();
      await expect(page.getByText('Email is required')).not.toBeVisible();
    });
  });
});



