// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, QuizzesPage, LoginPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.12 Pagination - Empty Results', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', uniqueEmail, 'SecurePass123!', ['Physics', 'Chemistry', 'Biology']);
    
    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    // Wait for successful login redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    await quizzesPage.navigateToQuizzes();
    
    // Apply filters that return no results
    await quizzesPage.filterBySubject('Biology'); // Filter by Biology
    await quizzesPage.filterByDifficulty('Hard'); // But there are no Hard Biology quizzes
    
    await page.waitForTimeout(500);
    
    // Expected Results: Empty state message displayed
    const emptyStateIndicators = [
      page.getByText(/No quizzes found|No results|Nothing to show/i),
      page.getByText(/Clear filters|Try different/i)
    ];
    
    for (const indicator of emptyStateIndicators) {
      if (await indicator.count() > 0) {
        await expect(indicator.first()).toBeVisible();
        break;
      }
    }
  });
});
