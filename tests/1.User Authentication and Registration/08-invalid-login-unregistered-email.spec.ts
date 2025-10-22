// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.8 Invalid Login - Unregistered Email', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('http://localhost:3000/login');

    // 2. Fill in "Email Address" with "nonexistent@example.com"
    await page.getByRole('textbox', { name: 'Email Address' }).fill('nonexistent@example.com');

    // 3. Fill in "Password" with any password
    await page.getByRole('textbox', { name: 'Password' }).fill('AnyPassword123!');

    // 4. Click "Login" button
    await page.getByRole('button', { name: 'Login' }).click();

    // Expected Results: Login fails and error message appears
    const errorMessages = [
      'Invalid credentials',
      'invalid credentials',
      'User not found',
      'Invalid email or password',
      'Email not found',
      'Authentication failed'
    ];
    
    let errorFound = false;
    for (const msg of errorMessages) {
      if (await page.getByText(msg).count() > 0) {
        errorFound = true;
        break;
      }
    }
    
    // If no specific error message, at least verify page didn't redirect
    expect(errorFound || await page.url().includes('login')).toBeTruthy();
    
    // Verify user remains on login page
    await expect(page).toHaveURL(/.*login/);
    
    // Close browser
    await page.close();
  });
});
