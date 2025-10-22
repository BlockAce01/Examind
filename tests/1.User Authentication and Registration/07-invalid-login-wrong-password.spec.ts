// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.7 Invalid Login - Wrong Password', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('http://localhost:3000/login');

    // 2. Fill in valid email address "john.doe@example.com"
    await page.getByRole('textbox', { name: 'Email Address' }).fill('john.doe@example.com');

    // 3. Fill in incorrect password "WrongPassword123!"
    await page.getByRole('textbox', { name: 'Password' }).fill('WrongPassword123!');

    // 4. Click "Login" button
    await page.getByRole('button', { name: 'Login' }).click();

    // Expected Results: Login fails and error message appears
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    
    // Verify user remains on login page
    await expect(page).toHaveURL(/.*login/);
    
    // Verify login heading still visible
    await expect(page.getByRole('heading', { name: 'Login to Examind' })).toBeVisible();
    
    // Close browser
    await page.close();
  });
});
