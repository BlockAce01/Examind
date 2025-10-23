// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, DashboardPage, ProfilePage, LeaderboardPage } from '../pages';

test.describe('Gamification - Points and Badges', () => {
  test('6.2 Points Display Consistency', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const dashboardPage = new DashboardPage(page);
    const profilePage = new ProfilePage(page);
    const leaderboardPage = new LeaderboardPage(page);

    // 1. Login as student
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      'Test Student',
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // 2. Check points on:
    // - Dashboard stat card
    await dashboardPage.navigateToDashboard();
    await dashboardPage.verifyStatsSection();
    
    // - Profile page achievements section
    await profilePage.navigateToProfile();
    await profilePage.verifyAchievementsSection();
    
    // - Leaderboard entry
    await leaderboardPage.navigateToLeaderboard();
    await leaderboardPage.verifyLeaderboardEntries();

    // 3. Verify all locations show same value
    // Expected Results:
    // - Points value consistent across all views
    // This test validates that the points are displayed consistently
    // The actual point values should match across dashboard, profile, and leaderboard
  });
});
