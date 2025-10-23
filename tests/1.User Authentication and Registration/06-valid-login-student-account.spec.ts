// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, DashboardPage } from '../pages';

test.describe('User Authentication and Registration', () => {
  test('1.6 Valid Login - Student Account', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Create a unique student account first
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    const userName = 'Test Student';

    // Register the student
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      userName,
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // Now login with the created account
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    // Wait for successful login and redirect
    await loginPage.verifyLoginSuccess();

    // Expected Results: Login successful and user redirected to /dashboard
    const isLoggedIn = await dashboardPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
    // Verify welcome message with student name
    await dashboardPage.verifyWelcomeMessage(userName);
    // Verify initial stats (points, badges, quizzes)
    await dashboardPage.verifyStatsSection();

    // Verify navigation bar shows student-specific links
    await dashboardPage.verifyStudentNavigation();

    // Verify user profile link displays student name or email
    await dashboardPage.verifyProfileLink(userName);

    // Verify URL is /dashboard
    await dashboardPage.verifyOnDashboard();
  });
});
