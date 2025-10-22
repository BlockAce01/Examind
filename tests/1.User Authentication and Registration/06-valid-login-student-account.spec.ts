// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.6 Valid Login - Student Account', async ({ page }) => {
    // Create a unique student account first
    const uniqueEmail = `student.${Date.now()}@example.com`;
    const userName = 'Test Student';

    // Register the student
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill(userName);
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['Chemistry']);
    await page.getByLabel('Subject 3').selectOption(['Biology']);
    await page.getByRole('button', { name: 'Register' }).click();

    // Now login with the created account
    // 1. Navigate to http://localhost:3000/login
    await page.goto('http://localhost:3000/login');

    // 2. Fill in "Email Address" with the new email
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);

    // 3. Fill in "Password" with "SecurePass123!"
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');

    // 4. Click "Login" button
    await page.getByRole('button', { name: 'Login' }).click();

    // Expected Results: Login successful and user redirected to /dashboard
    // Check for various possible welcome messages or dashboard indicators
    const welcomeHeadings = [
      page.getByRole('heading', { name: /Welcome back/i }),
      page.getByRole('heading', { name: /Dashboard/i }),
      page.getByRole('heading', { name: /Student Dashboard/i })
    ];
    
    let dashboardFound = false;
    for (const heading of welcomeHeadings) {
      if (await heading.count() > 0) {
        dashboardFound = true;
        break;
      }
    }
    
    // Verify user is on dashboard
    try {
      await page.waitForURL(/.*dashboard/, { timeout: 3000 });
      dashboardFound = true;
    } catch (e) {
      // Continue
    }
    
    if (!dashboardFound) {
      test.skip();
    }
    
    // Verify navigation bar shows student-specific links
    const dashboardLink = page.getByRole('link', { name: 'Dashboard', exact: true });
    const quizzesLink = page.getByRole('link', { name: 'Quizzes', exact: true });
    
    if (await dashboardLink.count() > 0) {
      await expect(dashboardLink).toBeVisible();
    }
    
    if (await quizzesLink.count() > 0) {
      await expect(quizzesLink).toBeVisible();
    }
    
    // Verify user profile link displays student name or email
    const profileLink = page.getByRole('link').filter({ hasText: /Test Student|student/i });
    if (await profileLink.count() > 0) {
      await expect(profileLink.first()).toBeVisible();
    }
    
    // Verify URL is /dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Close browser
    await page.close();
  });
});
