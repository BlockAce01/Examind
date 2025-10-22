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
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    
    // Verify user remains on login page
    await expect(page).toHaveURL(/.*login/);
    
    // Close browser
    await page.close();
  });
});
