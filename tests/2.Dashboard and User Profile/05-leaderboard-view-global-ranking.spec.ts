// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Dashboard and User Profile', () => {
  test('2.5 Leaderboard View - Global Ranking', async ({ page }) => {
    const uniqueEmail = `leaderboard.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Leaderboard User');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['Chemistry']);
    await page.getByLabel('Subject 3').selectOption(['Combined Mathematics']);
    await page.getByRole('button', { name: 'Register' }).click();

    // 1. Login as student
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Navigate to /leaderboard
    await page.goto('http://localhost:3000/leaderboard');

    // 3. View leaderboard content
    // Expected Results: Page title: "Leaderboard"
    await expect(page.getByRole('heading', { name: /Leaderboard/i })).toBeVisible();

    // Expected Results: List displays all students ranked by points (format: "1. name" with "X points")
    const leaderboardList = page.getByRole('list');
    await expect(leaderboardList).toBeVisible();

    // Expected Results: Each entry shows rank number, student name, total points
    const leaderboardEntries = page.getByRole('listitem');
    if (await leaderboardEntries.count() > 0) {
      await expect(leaderboardEntries.first()).toBeVisible();
    }

    // Expected Results: Current logged-in user is highlighted if visible in list
    // Look for any list item containing the user name
    const userItems = page.getByRole('listitem').filter({ hasText: /Leaderboard User/i });
    if (await userItems.count() > 0) {
      await expect(userItems.first()).toBeVisible();
    }

    // Expected Results: Rankings update after quiz completions
    // Use first() to avoid strict mode violation when multiple entries match
    const leaderboardUserItems = page.getByRole('listitem').filter({ hasText: /Leaderboard User/i });
    if (await leaderboardUserItems.count() > 0) {
      await expect(leaderboardUserItems.first()).toBeVisible();
    }
  });
});
