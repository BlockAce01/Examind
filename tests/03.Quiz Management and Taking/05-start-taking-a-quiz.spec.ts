// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';
import { QuizTakingPage } from '../pages/QuizTakingPage';

test.describe('Quiz Management and Taking', () => {
  test('3.5 Start Taking a Quiz', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('startquiz');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Start Quiz User', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    // Wait a bit for registration to process
    await page.waitForTimeout(2000);

    // Navigate to login page
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    await loginPage.verifyLoginSuccess();

    // Wait for session to establish
    await page.waitForTimeout(2000);

    // 1. Navigate to /quizzes
    await quizzesPage.navigateToQuizzes();
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // 2. Locate "Physics MCQ past papers" quiz as specified in test plan
    const physicsQuiz = page.getByRole('heading', { name: 'Physics MCQ past papers' }).first();
    await expect(physicsQuiz).toBeVisible({ timeout: 10000 });

    // 3. Click "Start Quiz" button for Physics quiz
    await quizzesPage.startQuiz();

    // 4. Observe quiz interface
    // Expected Results: Redirect to /quizzes/[quizId]/take
    await quizTakingPage.verifyOnQuizPage();

    // Expected Results: Quiz title displayed at top
    await quizTakingPage.verifyQuizTitle();

    // Expected Results: Timer starts counting down
    await quizTakingPage.verifyTimer();

    // Expected Results: Question counter shows current question
    await quizTakingPage.verifyQuestionCounter(1, 3);

    // Expected Results: Question text displayed clearly
    await quizTakingPage.verifyQuestionDisplayed();

    // Expected Results: Answer options shown as selectable buttons
    const answerButtons = page.getByRole('button').filter({ hasText: /^\d+%$|^[A-Za-z0-9\s\-\.]+$/ });
    expect(await answerButtons.count()).toBeGreaterThan(0);

    // Expected Results: Navigation buttons
    await quizTakingPage.verifyPreviousDisabled();
    await quizTakingPage.verifyNextEnabled();
  });
});
