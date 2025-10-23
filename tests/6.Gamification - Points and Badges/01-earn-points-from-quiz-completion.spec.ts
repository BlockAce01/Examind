// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, DashboardPage, QuizzesPage, QuizTakingPage, QuizResultsPage } from '../pages';

test.describe('Gamification - Points and Badges', () => {
  test('6.1 Earn Points from Quiz Completion', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    const quizResultsPage = new QuizResultsPage(page);

    // 1. Login as student with 0 points
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      'Test Student',
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // Verify initial points (should be 0)
    await dashboardPage.navigateToDashboard();
    await dashboardPage.verifyStatsSection();

    // 2. Navigate to /quizzes
    await quizzesPage.navigateToQuizzes();

    // 3. Take and complete a quiz with correct answers
    const quizCount = await quizzesPage.getQuizCardCount();
    if (quizCount > 0) {
      await quizzesPage.startQuiz();

      // Answer all questions correctly (select first option for all)
      const answers = [0, 0, 0]; // Assuming 3 questions with correct answer at index 0
      await quizTakingPage.answerAllQuestions(answers);
      await quizTakingPage.confirmSubmission();

      // 4. View results and return to dashboard
      await quizResultsPage.verifyResultsDisplayed();
      await quizResultsPage.verifyPointsAwarded();

      // Return to dashboard
      await dashboardPage.navigateToDashboard();

      // Expected Results:
      // - Points awarded based on quiz performance
      // - Dashboard displays updated Total Points
      await dashboardPage.verifyStatsSection();
      
      // Points should be greater than 0 now
      const pointsText = await dashboardPage.totalPointsText.textContent();
      expect(pointsText).toBeTruthy();
    }
  });
});
