// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';

test.describe('Quiz Management and Taking', () => {
  test('3.1 Browse Available Quizzes', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('quizbrowse');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Quiz Browser', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    // 1. Login as student
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // Wait for session to establish
    await page.waitForTimeout(2000);

    // 2. Navigate to /quizzes directly
    await quizzesPage.navigateToQuizzes();

    // 3. Observe quiz listing
    // Expected Results: Page title: "Available Quizzes"
    await quizzesPage.verifyOnQuizzesPage();

    // Expected Results: Filter options displayed
    await quizzesPage.verifyFilterOptions();

    // Expected Results: Each quiz card displays required information (if quizzes exist)
    const quizCount = await quizzesPage.getQuizCardCount();
    if (quizCount > 0) {
      await quizzesPage.verifyQuizCard();
    }
  });
});
