// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Dashboard and User Profile', () => {
  test('2.1 Student Dashboard - Initial View', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Generate unique email for new student
    const uniqueEmail = registerPage.generateUniqueEmail('newstudent');

    // Register new student with no activity
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('New Student', uniqueEmail, 'SecurePass123!', 
      ['Combined Mathematics', 'Physics', 'Chemistry']);

  // 1. Login as a new student with no activity
  await loginPage.navigateToLogin();
  await loginPage.login(uniqueEmail, 'SecurePass123!');
  // 2. Verify dashboard loaded by checking welcome message and other elements
  await dashboardPage.verifyWelcomeMessage();

    // 3. Observe dashboard content
    // Expected Results: Welcome message (may be generic)
    await dashboardPage.verifyWelcomeMessage();

    // Expected Results: Stats section displays Total Points: 0, Badges Earned: 0, Quizzes Taken: 0
    await dashboardPage.verifyStatsSection();
    await dashboardPage.verifyInitialStats(0, 0, 0);

  });
});
