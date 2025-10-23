// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Dashboard and User Profile', () => {
  test('2.2 Dashboard - After Taking Quiz', async ({ page }) => {
    test.setTimeout(120000);
    
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('quizstudent');

    // Register and login as student
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Quiz Student', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    // 1. Login as student
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    await page.waitForTimeout(1000);

    // 2. Take and complete a quiz
    await page.goto('http://localhost:3000/quizzes');
    await page.getByRole('link', { name: /Start Quiz/i }).first().click();
    
    // Answer quiz questions
    while (true) {
      const answerButtons = page.locator('[data-testid="answer-option"]');
      if (await answerButtons.count() > 0) {
        await answerButtons.first().click();
      }
      
      const nextButton = page.getByRole('button', { name: /Next/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      } else {
        break;
      }
    }
    
    // Submit the quiz
    const submitButton = page.getByRole('button', { name: /Submit/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
    }

    // 3. Return to dashboard
    await dashboardPage.navigateToDashboard();

    // 4. Check updated statistics
    await dashboardPage.verifyStatsSection();
    await expect(page.getByText(/Total Points/i)).toBeVisible();
    await expect(page.getByText(/Recent Activity/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Leaderboard Snapshot' })).toBeVisible();
  });
});

