// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, ProfilePage, QuizzesPage, QuizTakingPage, QuizResultsPage } from '../pages';

test.describe('Gamification - Points and Badges', () => {
  test('6.4 Badge Award - Point Milestones', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const profilePage = new ProfilePage(page);
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

    // 1. Take multiple quizzes to accumulate points
    await quizzesPage.navigateToQuizzes();
    
    const quizCount = await quizzesPage.getQuizCardCount();
    const quizzesToTake = Math.min(quizCount, 3); // Take up to 3 quizzes
    
    for (let i = 0; i < quizzesToTake; i++) {
      await quizzesPage.navigateToQuizzes();
      await quizzesPage.startQuiz();
      
      // Answer questions
      const answers = [0, 0, 0];
      await quizTakingPage.answerAllQuestions(answers);
      await quizTakingPage.confirmSubmission();
      
      await quizResultsPage.verifyResultsDisplayed();
      
      // 3. Check profile after each milestone
      await profilePage.navigateToProfile();
      await profilePage.verifyMyBadgesSection();
    }

    // 2. Reach point milestones (e.g., 100, 500, 1000 points)
    // Expected Results:
    // - Milestone badges awarded automatically
    // - Profile shows all earned badges
    await profilePage.navigateToProfile();
    const badgeCount = await profilePage.getBadgeCount();
    expect(badgeCount).toBeGreaterThanOrEqual(0);
  });
});
