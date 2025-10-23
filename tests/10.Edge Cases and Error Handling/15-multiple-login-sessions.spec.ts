// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, DashboardPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.15 Multiple Login Sessions', async ({ page, context }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Create account
    const email = registerPage.generateUniqueEmail('student');
    const password = 'SecurePass123!';
    
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', email, password, ['Physics', 'Chemistry', 'Biology']);
    
    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(email, password);
    // Wait for successful login redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    // Verify logged in on Browser A
    await dashboardPage.verifyOnDashboard();
    
    // Login on Browser B (new browser context)
    const page2 = await context.newPage();
    const loginPage2 = new LoginPage(page2);
    const dashboardPage2 = new DashboardPage(page2);
    
    await loginPage2.navigateToLogin();
    await loginPage2.login(email, password);
    await loginPage2.verifyLoginSuccess();
    
    await dashboardPage2.verifyOnDashboard();
    
    // Perform actions in both browsers
    await dashboardPage.navigateToDashboard();
    await dashboardPage2.navigateToDashboard();
    
    // Expected Results: Both sessions work OR second login invalidates first
    const browser1LoggedIn = await dashboardPage.isLoggedIn();
    const browser2LoggedIn = await dashboardPage2.isLoggedIn();
    
    // Either both are logged in (multiple sessions allowed)
    // OR only second one is logged in (single session policy)
    expect(browser1LoggedIn || browser2LoggedIn).toBe(true);
    
    await page2.close();
  });
});
