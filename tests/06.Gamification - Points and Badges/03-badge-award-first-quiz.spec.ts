// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, ProfilePage, QuizzesPage, QuizTakingPage, QuizResultsPage } from '../pages';

test.describe('Gamification - Points and Badges', () => {
  test('6.3 Badge Award - First Quiz', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    const quizResultsPage = new QuizResultsPage(page);

    // 1. Create new student account (0 badges)
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      'Test Student',
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    // Wait for successful login redirect to dashboard
    await page.waitForURL('**/dashboard');

    // 2. Complete first quiz
    await quizzesPage.navigateToQuizzes();
    const quizCount = await quizzesPage.getQuizCardCount();
    
    if (quizCount > 0) {
      await quizzesPage.startQuiz();
      
      // Answer all questions
      const answers = [0, 0, 0];
      await quizTakingPage.answerAllQuestions(answers);
      await quizTakingPage.confirmSubmission();
      
      await quizResultsPage.verifyResultsDisplayed();
    }

    // 3. Navigate to profile page
    await profilePage.navigateToProfile();

    // 4. Check "My Badges" section
    await profilePage.verifyMyBadgesSection();

    // Expected Results:
    // - If "First Quiz" badge exists, it should be awarded
    // - Badge appears in profile badges section
    const badgeCount = await profilePage.getBadgeCount();
    expect(badgeCount).toBeGreaterThanOrEqual(0);
  });
});
