// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';
import { QuizTakingPage } from '../pages/QuizTakingPage';

test.describe('Quiz Management and Taking', () => {
  test('3.6 Answer Quiz Questions - Navigate Between Questions', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('navigatequiz');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Navigate Quiz User', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    await loginPage.verifyLoginSuccess();

    // Wait for session to establish
    await page.waitForTimeout(2000);

    // 1. Start a quiz with multiple questions
    await quizzesPage.navigateToQuizzes();
    await page.waitForLoadState('networkidle');
    
    const startQuizButtons = page.locator('a[href*="/quizzes/"][href*="/take"]');
    if (await startQuizButtons.count() === 0) {
      test.skip();
    }

    await quizzesPage.startQuiz();

    // 2. On Question 1, select an answer option
    await quizTakingPage.verifyQuestionDisplayed();
    await quizTakingPage.selectAnswer(0);

    // 3. Click "Next" button
    await quizTakingPage.clickNext();

    // 4. Observe Question 2 appears
    await expect(page.getByText(/Question 2 of/i)).toBeVisible();

    // 5. Click "Previous" button
    await quizTakingPage.clickPrevious();

    // 6. Verify return to Question 1
    await expect(page.getByText(/Question 1 of/i)).toBeVisible();

    // Expected Results: "Previous" button disabled on Question 1
    await quizTakingPage.verifyPreviousDisabled();

    // Expected Results: "Next" button advances to next question
    await quizTakingPage.clickNext();
    await expect(page.getByText(/Question 2 of/i)).toBeVisible();
  });
});
