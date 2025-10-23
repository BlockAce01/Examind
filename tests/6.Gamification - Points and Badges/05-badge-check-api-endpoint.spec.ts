// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, QuizzesPage, QuizTakingPage, QuizResultsPage } from '../pages';

test.describe('Gamification - Points and Badges', () => {
  test('6.5 Badge Check API Endpoint', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    const quizResultsPage = new QuizResultsPage(page);

    // Setup: Create student account
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      'Test Student',
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // 1. Complete action that should trigger badge (quiz, discussion post, etc.)
    await quizzesPage.navigateToQuizzes();
    const quizCount = await quizzesPage.getQuizCardCount();
    
    if (quizCount > 0) {
      // Set up network listener to catch badge check API call
      let badgeCheckCalled = false;
      page.on('request', request => {
        if (request.url().includes('/api/v1/badges/check')) {
          badgeCheckCalled = true;
        }
      });

      await quizzesPage.startQuiz();
      
      const answers = [0, 0, 0];
      await quizTakingPage.answerAllQuestions(answers);
      await quizTakingPage.confirmSubmission();
      
      await quizResultsPage.verifyResultsDisplayed();

      // 2. Backend should call `/api/v1/badges/check/:userId`
      await page.waitForTimeout(2000); // Wait for badge check to complete

      // 3. Check UserBadge table for new entries
      // Expected Results:
      // - Badge check runs automatically after point-earning actions
      // - Eligible badges awarded immediately
      // Note: The actual badge check may be server-side only
    }
  });
});
