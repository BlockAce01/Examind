// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';
import { QuizTakingPage } from '../pages/QuizTakingPage';
import { QuizResultsPage } from '../pages/QuizResultsPage';

test.describe('Quiz Management and Taking', () => {
  test('3.8 Submit Quiz Before Time Expires', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    const quizResultsPage = new QuizResultsPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('submitquiz');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Submit Quiz User', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    await loginPage.verifyLoginSuccess();

    // Wait for session to establish
    await page.waitForTimeout(2000);

    // 1. Start a quiz
    await quizzesPage.navigateToQuizzes();
    await page.waitForLoadState('networkidle');
    
    const startQuizButtons = page.locator('a[href*="/quizzes/"][href*="/take"]');
    if (await startQuizButtons.count() === 0) {
      test.skip();
    }

    await quizzesPage.startQuiz();

    // 2. Answer all questions
    const questionCount = await page.getByText(/Question 1 of (\d+)/i).textContent();
    const totalQuestions = parseInt(questionCount?.match(/\d+$/)?.[0] || '3');

    for (let i = 0; i < totalQuestions; i++) {
      const answerButtons = page.getByRole('button').filter({ hasText: /^\d+%$|^[A-Za-z0-9\s\-\.]+$/ });
      if (await answerButtons.first().isVisible()) {
        await answerButtons.first().click();
      }
      
      if (i < totalQuestions - 1) {
        await quizTakingPage.clickNext();
      }
    }

    // 3 & 4. Navigate to last question and submit
    await quizTakingPage.clickSubmit();

    // 5. Confirm submission if prompted
    const confirmButton = page.getByRole('button', { name: /Confirm|Yes|Submit/i });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    // Expected Results: User redirected to results page
    await quizResultsPage.verifyOnResultsPage();

    // Expected Results: Quiz submission confirmation appears
    await quizResultsPage.verifyResultsDisplayed();

    // Expected Results: Score calculated and displayed
    await quizResultsPage.verifyPercentage();
  });
});
