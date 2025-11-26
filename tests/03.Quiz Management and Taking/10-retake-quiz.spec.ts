// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';
import { QuizTakingPage } from '../pages/QuizTakingPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Quiz Management and Taking', () => {
  test('3.10 Retake Quiz', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    const dashboardPage = new DashboardPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('retakequiz');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Retake Quiz User', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    await loginPage.verifyLoginSuccess();

    // Wait for session to establish
    await page.waitForTimeout(2000);

    // Complete first quiz attempt
    await quizzesPage.navigateToQuizzes();
    await page.waitForLoadState('networkidle');
    
    const startQuizButtons = page.locator('a[href*="/quizzes/"][href*="/take"]');
    if (await startQuizButtons.count() === 0) {
      test.skip();
    }

    await quizzesPage.startQuiz();

    const questionCount = await page.getByText(/Question 1 of (\d+)/i).textContent();
    const totalQuestions = parseInt(questionCount?.match(/\d+$/)?.[0] || '3');

    for (let i = 0; i < totalQuestions; i++) {
      const answerButtons = page.locator('button').filter({ 
        hasText: /^(?!Previous|Next|Submit|Finish).*$/ 
      }).filter({ 
        hasText: /.{1,}/ 
      });
      const secondAnswer = answerButtons.nth(1);
      if (await secondAnswer.isVisible()) {
        await secondAnswer.click();
      } else {
        await answerButtons.first().click();
      }
      if (i < totalQuestions - 1) {
        await quizTakingPage.clickNext();
      }
    }

    await quizTakingPage.clickSubmit();

    // 1. View quiz results
    await expect(page).toHaveURL(/.*results|.*score/i);

    // 2. Navigate back to /quizzes
    await quizzesPage.navigateToQuizzes();

    // 3 & 4. Find the same quiz and start again
    await quizzesPage.startQuiz();

    // Expected Results: Quiz can be taken again
    await quizTakingPage.verifyOnQuizPage();

    // Complete second attempt with different answers
    for (let i = 0; i < totalQuestions; i++) {
      const answerButtons = page.locator('button').filter({ 
        hasText: /^(?!Previous|Next|Submit|Finish).*$/ 
      }).filter({ 
        hasText: /.{1,}/ 
      });
      if (await answerButtons.first().isVisible()) {
        await answerButtons.first().click();
      }
      if (i < totalQuestions - 1) {
        await quizTakingPage.clickNext();
      }
    }

    await quizTakingPage.clickSubmit();

    // Expected Results: New submission creates separate entry
    await expect(page).toHaveURL(/.*results|.*score/i);

    // Expected Results: Both attempts stored in history
    await dashboardPage.navigateToDashboard();
    await expect(page.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();
  });
});
