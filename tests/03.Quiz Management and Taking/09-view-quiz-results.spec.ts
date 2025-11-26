// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';
import { QuizTakingPage } from '../pages/QuizTakingPage';
import { QuizResultsPage } from '../pages/QuizResultsPage';

test.describe('Quiz Management and Taking', () => {
  test('3.9 View Quiz Results', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    const quizResultsPage = new QuizResultsPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('viewresults');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('View Results User', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    await loginPage.verifyLoginSuccess();

    // Wait for session to establish
    await page.waitForTimeout(2000);

    // Complete a quiz
    await quizzesPage.navigateToQuizzes();
    await page.waitForLoadState('networkidle');
    
    const startQuizButtons = page.locator('a[href*="/quizzes/"][href*="/take"]');
    if (await startQuizButtons.count() === 0) {
      test.skip();
    }

    await quizzesPage.startQuiz();

    // Answer questions and submit
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

    await quizTakingPage.clickSubmit();

    // 1-3. Complete and submit a quiz, observe results page
    // Expected Results: Results page displays score, percentage, points
    await quizResultsPage.verifyResultsDisplayed();
    await quizResultsPage.verifyPercentage();

    // Expected Results: Good Job message and submission timestamp
    await expect(page.getByText('Good Job!')).toBeVisible();
    await expect(page.getByText(/Submitted on:/)).toBeVisible();

    // Expected Results: Question-by-question review
    await quizResultsPage.verifyQuestionReview();

    // Expected Results: User's selected answer and correct answer shown
    await expect(page.locator('text="(Your Answer)"').first()).toBeVisible();

    // Expected Results: "Back to Quizzes" button
    await expect(page.getByRole('link', { name: /Back to Quizzes/i })).toBeVisible();

    // Expected Results: Option to view AI chatbot explanation
    await quizResultsPage.verifyAIChatAvailable();
  });
});
