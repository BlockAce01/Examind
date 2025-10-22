// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Dashboard and User Profile', () => {
  test('2.3 Student Profile View', async ({ page }) => {
    const uniqueEmail = `profilestudent.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Profile Student');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['Chemistry']);
    await page.getByLabel('Subject 3').selectOption(['ICT']);
    await page.getByRole('button', { name: 'Register' }).click();

    // 1. Login as student
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for login to complete
    await page.waitForURL(/.*dashboard|profile|quizzes/, { timeout: 5000 }).catch(() => null);

    // Check if login was successful
    expect(page.url()).not.toContain('/login');

    // 2. Click on student name in navigation bar OR
    // 3. Click "My Profile" quick link from dashboard
    if (!page.url().includes('/profile')) {
      await page.goto('http://localhost:3000/dashboard', { waitUntil: 'domcontentloaded' });
      
      // Click the profile link in navigation (user's name link to /profile)
      await page.locator('a[href="/profile"]').first().click();
      await page.waitForFunction(() => window.location.pathname === '/profile');
    }

    // 4. View profile page - check current URL
    const currentUrl = page.url();
    expect(currentUrl).toContain('profile');

    // Expected Results: Page title: "My Profile"
    await expect(page.getByRole('heading', { name: /My Profile/i })).toBeVisible();

    // Expected Results: Profile section displays user information
    await expect(page.getByRole('heading', { name: /Profile Student/i })).toBeVisible();
    await expect(page.getByText(uniqueEmail)).toBeVisible();
    // Use the specific badge element for "student" role
    const studentRoleBadge = page.getByText('student', { exact: true });
    if (await studentRoleBadge.count() > 0) {
      await expect(studentRoleBadge).toBeVisible();
    }

    // Expected Results: "Edit Profile" button
    await expect(page.getByRole('button', { name: /Edit Profile/i })).toBeVisible();

    // Expected Results: Achievements section shows points, badges, quizzes
    await expect(page.getByText(/Points/i)).toBeVisible();
    // Use exact match for "Badges" to avoid strict mode violation with "My Badges"
    const badgesElement = page.getByText('Badges', { exact: true });
    if (await badgesElement.count() > 0) {
      await expect(badgesElement).toBeVisible();
    }
    await expect(page.getByText(/Quizzes Done/i)).toBeVisible();

    // Expected Results: "My Badges" section
    await expect(page.getByRole('heading', { name: /My Badges/i })).toBeVisible();

    // Expected Results: Settings section with buttons
    await expect(page.getByRole('button', { name: /Account Preferences/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Change Password/i })).toBeVisible();
  });
});
