// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.9 Login Session Persistence', async ({ page }) => {
    // 1. Login with valid credentials
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email Address' }).fill('john.doe@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Navigate to /dashboard (automatic redirect after login)
    await expect(page.getByRole('heading', { name: 'Welcome back, John Doe!' })).toBeVisible();

    // 3. Refresh the browser page
    await page.goto('http://localhost:3000/dashboard');

    // Expected Results: User remains logged in after refresh
    await expect(page.getByRole('heading', { name: 'Welcome back, John Doe!' })).toBeVisible();
    
    // Verify dashboard loads without requiring re-login
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('link', { name: 'John Doe' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    
    // Close browser
    await page.close();
  });
});
