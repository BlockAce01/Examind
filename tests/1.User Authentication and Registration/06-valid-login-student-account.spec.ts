// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.6 Valid Login - Student Account', async ({ page }) => {
    // 1. Navigate to http://localhost:3000/login
    await page.goto('http://localhost:3000/login');

    // 2. Fill in "Email Address" with "john.doe@example.com"
    await page.getByRole('textbox', { name: 'Email Address' }).fill('john.doe@example.com');

    // 3. Fill in "Password" with "SecurePass123!"
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');

    // 4. Click "Login" button
    await page.getByRole('button', { name: 'Login' }).click();

    // Expected Results: Login successful and user redirected to /dashboard
    await expect(page.getByRole('heading', { name: 'Welcome back, John Doe!' })).toBeVisible();
    
    // Verify navigation bar shows student-specific links
    await expect(page.getByRole('link', { name: 'Dashboard', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Quizzes', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Resources', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Discussions', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Challenges', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Leaderboard', exact: true })).toBeVisible();
    
    // Verify user profile link displays student name
    await expect(page.getByRole('link', { name: 'John Doe' })).toBeVisible();
    
    // Verify URL is /dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Close browser
    await page.close();
  });
});
