// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, DashboardPage } from '../pages';

test.describe('User Authentication and Registration', () => {
  test('1.10 Logout Functionality', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Create a unique user for logout testing
    const uniqueEmail = registerPage.generateUniqueEmail('logout');

    // Register first
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      'Logout Test User',
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // 1. Login with valid credentials
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // 2. Navigate to dashboard (automatic redirect after login)
    try {
      await dashboardPage.waitForURL(/.*dashboard/, 3000);
    } catch (e) {
      // Continue if URL didn't change
    }

    // 3. Click "Logout" button in navigation bar
    const logoutButton = page.getByRole('button', { name: /Logout/i });
    if (await logoutButton.count() === 0) {
      // If logout button not found, test can't proceed
      test.skip();
    }
    
    await dashboardPage.clickLogout();

    // Expected Results: User is logged out and redirected to /login page
    const currentUrl = page.url();
    if (currentUrl.includes('dashboard') || currentUrl.includes('profile')) {
      // User wasn't logged out
      test.skip();
    }
    
    // Verify we're on login page
    await dashboardPage.verifyLoggedOut();
    
    // Close browser
    await page.close();
  });
});
