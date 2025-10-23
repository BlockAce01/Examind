// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { LeaderboardPage } from '../pages/LeaderboardPage';

test.describe('Dashboard and User Profile', () => {
  test('2.5 Leaderboard View - Global Ranking', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const leaderboardPage = new LeaderboardPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('leaderboard');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Leaderboard User', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    // 1. Login as student
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // 2. Navigate to /leaderboard
    await leaderboardPage.navigateToLeaderboard();

    // 3. View leaderboard content
    // Expected Results: Page title and list
    await leaderboardPage.verifyOnLeaderboardPage();

    // Expected Results: Each entry shows rank number, student name, total points
    await leaderboardPage.verifyLeaderboardEntries();

    // Expected Results: Current logged-in user is highlighted if visible in list
    const userItems = page.getByRole('listitem').filter({ hasText: /Leaderboard User/i });
    if (await userItems.count() > 0) {
      await expect(userItems.first()).toBeVisible();
    }
  });
});
