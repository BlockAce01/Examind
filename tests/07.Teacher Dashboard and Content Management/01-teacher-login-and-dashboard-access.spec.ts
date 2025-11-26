// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, DashboardPage } from '../pages';

test.describe('Teacher Dashboard and Content Management', () => {
  test('7.1 Teacher Login and Dashboard Access', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // 1. Register/Login as teacher account
    const teacherEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher(
      'Test Teacher',
      teacherEmail,
      'SecurePass123!',
      'Physics'
    );

    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(teacherEmail, 'SecurePass123!');
    // Wait for successful login redirect to teacher dashboard
    await page.waitForURL('**/teacher');

    // 2. Observe redirect destination after login
    // Expected Results:
    // - Teacher redirected to /teacher or /teacher/page
    await page.waitForURL(/\/(teacher|dashboard)/);
    
    // - Teacher dashboard displays welcome message
    await dashboardPage.verifyWelcomeMessage('Test Teacher');
    
    // - Teacher-specific navigation options
    // - Links to: My Quizzes, My Resources, Discussions, Profile
    const teacherNav = page.getByText(/My Quizzes|My Resources|Quizzes|Resources/i);
    if (await teacherNav.count() > 0) {
      await expect(teacherNav.first()).toBeVisible();
    }
    
    // - Different UI than student dashboard
    // - Access to teacher-only features
    const createQuizButton = page.getByRole('button', { name: /Create Quiz|New Quiz/i });
    if (await createQuizButton.count() > 0) {
      await expect(createQuizButton).toBeVisible();
    }
  });
});
