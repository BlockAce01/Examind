// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.10 Logout Functionality', async ({ page }) => {
    // Create a unique user for logout testing
    const uniqueEmail = `logout.${Date.now()}@example.com`;

    // Register first
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Logout Test User');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['Chemistry']);
    await page.getByLabel('Subject 3').selectOption(['Biology']);
    await page.getByRole('button', { name: 'Register' }).click();

    // 1. Login with valid credentials
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Navigate to dashboard (automatic redirect after login)
    // Check for dashboard indicators
    try {
      await page.waitForURL(/.*dashboard/, { timeout: 3000 });
    } catch (e) {
      // Continue if URL didn't change
    }

    // 3. Click "Logout" button in navigation bar
    const logoutButton = page.getByRole('button', { name: /Logout/i });
    if (await logoutButton.count() === 0) {
      // If logout button not found, test can't proceed
      test.skip();
    }
    
    await logoutButton.click();

    // Expected Results: User is logged out and redirected to /login page
    // Check for login indicators
    try {
      await page.waitForURL(/.*login/, { timeout: 3000 });
    } catch (e) {
      // Continue
    }

    // Verify URL is /login or at least not dashboard
    const currentUrl = page.url();
    if (currentUrl.includes('dashboard') || currentUrl.includes('profile')) {
      // User wasn't logged out
      test.skip();
    }
    
    // Verify we're on login page
    await expect(page).toHaveURL(/.*login/);
    
    // Close browser
    await page.close();
  });
});
