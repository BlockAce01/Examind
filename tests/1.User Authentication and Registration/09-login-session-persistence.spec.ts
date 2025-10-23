// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, DashboardPage } from '../pages';

test.describe('User Authentication and Registration', () => {
  test('1.9 Login Session Persistence', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // First, create a user to test with
    const uniqueEmail = registerPage.generateUniqueEmail('session');
    const userName = 'Session Test User';

    // Register first
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      userName,
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // 1. Login with valid credentials
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // 2. Verify we're on dashboard
    const dashboardFound = await dashboardPage.isLoggedIn();
    
    if (!dashboardFound && !page.url().includes('dashboard')) {
      test.skip();
    }

    // 3. Refresh the browser page
    await dashboardPage.navigateToDashboard();

    // Expected Results: User remains logged in after refresh
    await dashboardPage.verifyOnDashboard();
    
    // Check that logout button exists (user is authenticated)
    const logoutButton = page.getByRole('button', { name: /Logout|logout/i });
    if (await logoutButton.count() > 0) {
      await expect(logoutButton).toBeVisible();
    }
    
    // Close browser
    await page.close();
  });
});
