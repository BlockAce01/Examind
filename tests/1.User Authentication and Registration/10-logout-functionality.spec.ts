// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.10 Logout Functionality', async ({ page }) => {
    // 1. Login with valid credentials (john.doe@example.com / SecurePass123!)
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email Address' }).fill('john.doe@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Navigate to dashboard (automatic redirect after login)
    await expect(page.getByRole('heading', { name: 'Welcome back, John Doe!' })).toBeVisible();

    // 3. Click "Logout" button in navigation bar
    await page.getByRole('button', { name: 'Logout' }).click();

    // Expected Results: User is logged out and redirected to /login page
    await expect(page.getByRole('heading', { name: 'Login to Examind' })).toBeVisible();
    
    // Verify URL is /login
    await expect(page).toHaveURL(/.*login/);
    
    // Verify logged out navigation (no user-specific links)
    await expect(page.getByRole('link', { name: 'Login', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register', exact: true })).toBeVisible();
    
    // Close browser
    await page.close();
  });
});
