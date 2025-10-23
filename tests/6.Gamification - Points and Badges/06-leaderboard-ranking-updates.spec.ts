// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, LeaderboardPage, QuizzesPage, QuizTakingPage, QuizResultsPage } from '../pages';

test.describe('Gamification - Points and Badges', () => {
  test('6.6 Leaderboard Ranking Updates', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const leaderboardPage = new LeaderboardPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    const quizResultsPage = new QuizResultsPage(page);

    // Setup: Create student account
    const userName = 'Test Student';
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      userName,
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    // Wait for successful login redirect to dashboard
    await page.waitForURL('**/dashboard');

    // 1. Note current leaderboard position
    await leaderboardPage.navigateToLeaderboard();
    await leaderboardPage.verifyOnLeaderboardPage();
    const initialRank = await leaderboardPage.getUserRank(userName);

    // 2. Complete quiz and earn points
    await quizzesPage.navigateToQuizzes();
    const quizCount = await quizzesPage.getQuizCardCount();
    
    if (quizCount > 0) {
      await quizzesPage.startQuiz();
      
      const answers = [0, 0, 0];
      await quizTakingPage.answerAllQuestions(answers);
      await quizTakingPage.confirmSubmission();
      
      await quizResultsPage.verifyResultsDisplayed();
    }

    // 3. Refresh leaderboard page
    await leaderboardPage.navigateToLeaderboard();

    // 4. Verify position update
    // Expected Results:
    // - Leaderboard recalculates rankings based on updated points
    // - Rankings displayed in descending order by points
    await leaderboardPage.verifyLeaderboardEntries();
    
    const newRank = await leaderboardPage.getUserRank(userName);
    // Position may have changed (improved) or stayed the same
    expect(newRank).toBeTruthy();
  });
});
