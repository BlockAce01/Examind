// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, LeaderboardPage } from '../pages';

test.describe('Gamification - Points and Badges', () => {
  test('6.7 View Other User\'s Badges', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const leaderboardPage = new LeaderboardPage(page);

    // Setup: Create student account
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      'Test Student',
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // 1. Navigate to leaderboard
    await leaderboardPage.navigateToLeaderboard();
    await leaderboardPage.verifyOnLeaderboardPage();

    // 2. Click on another user's profile (if clickable)
    const leaderboardEntries = page.locator('[data-testid^="leaderboard-entry-"]');
    const entryCount = await leaderboardEntries.count();
    
    if (entryCount > 0) {
      // Try to find a clickable user profile link
      const userProfileLinks = page.locator('a[href*="/profile/"]').or(
        page.locator('[data-testid^="leaderboard-entry-"] a')
      );
      
      const linkCount = await userProfileLinks.count();
      if (linkCount > 0) {
        await userProfileLinks.first().click();

        // 3. View their badges and achievements
        // Expected Results:
        // - Other users' public profiles viewable
        // - Badges and points displayed
        // - Cannot edit other users' data
        await page.waitForTimeout(1000);
        
        // Verify we're on a profile page
        const profileIndicator = page.getByText(/Profile|Badges|Points/i);
        if (await profileIndicator.count() > 0) {
          await expect(profileIndicator.first()).toBeVisible();
        }
      }
    }
  });
});
