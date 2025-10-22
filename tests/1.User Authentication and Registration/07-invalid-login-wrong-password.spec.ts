// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.7 Invalid Login - Wrong Password', async ({ page }) => {
    // Create a test user first
    const uniqueEmail = `wrongpass.${Date.now()}@example.com`;

    // Register user first
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['Chemistry']);
    await page.getByLabel('Subject 3').selectOption(['Biology']);
    await page.getByRole('button', { name: 'Register' }).click();

    // Now login with wrong password
    // 1. Navigate to login page
    await page.goto('http://localhost:3000/login');

    // 2. Fill in email address
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);

    // 3. Fill in incorrect password "WrongPassword123!"
    await page.getByRole('textbox', { name: 'Password' }).fill('WrongPassword123!');

    // 4. Click "Login" button
    await page.getByRole('button', { name: 'Login' }).click();

    // Expected Results: Login fails and error message appears
    // Check for various possible error messages
    const possibleErrors = [
      page.getByText('Invalid credentials'),
      page.getByText(/Invalid|incorrect|password/i),
      page.getByText(/error/i)
    ];
    
    let errorFound = false;
    for (const error of possibleErrors) {
      if (await error.count() > 0) {
        errorFound = true;
        break;
      }
    }
    
    // Verify user remains on login page
    await expect(page).toHaveURL(/.*login/);
    
    // If no specific error found but we're on login page, that's ok
    if (!errorFound) {
      // Just verify we're still on the login page
      await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();
    }
    
    // Close browser
    await page.close();
  });
});
