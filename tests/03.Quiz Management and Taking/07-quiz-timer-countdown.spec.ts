// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';
import { QuizTakingPage } from '../pages/QuizTakingPage';

test.describe('Quiz Management and Taking', () => {
  test('3.7 Quiz Timer Countdown', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('quiztimer');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Quiz Timer User', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // Wait for session to establish
    await page.waitForTimeout(2000);

    // 1. Start a quiz with 5-minute time limit
    await quizzesPage.navigateToQuizzes();
    await page.waitForLoadState('networkidle');
    
    const startQuizButtons = page.getByRole('link', { name: /Start Quiz/i });
    if (await startQuizButtons.count() === 0) {
      test.skip(true, 'No quizzes available to test timer');
      return;
    }

    await quizzesPage.startQuiz();

    // 2. Answer questions slowly
    // 3. Observe timer countdown
    // Expected Results: Timer displays in MM:SS format and counts down
    await quizTakingPage.verifyTimer();
    
    const timerElement = page.getByText(/Time Left/i).locator('..');
    const initialTime = await timerElement.textContent();
    expect(initialTime).toMatch(/\d{2}:\d{2}/);

    await page.waitForTimeout(2000);
    const laterTime = await timerElement.textContent();
    expect(laterTime).not.toEqual(initialTime);

    // Verify timer is actively counting down
    await expect(timerElement).toBeVisible();
  });
});
