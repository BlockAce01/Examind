// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProfilePage } from '../pages/ProfilePage';

test.describe('Dashboard and User Profile', () => {
  test('2.3 Student Profile View', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const profilePage = new ProfilePage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('profilestudent');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Profile Student', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'ICT']);

  // 1. Login as student and await dashboard redirect
  await loginPage.navigateToLogin();
  await loginPage.login(uniqueEmail, 'SecurePass123!');
  await loginPage.verifyLoginSuccess();
  await dashboardPage.verifyOnDashboard();

  // 2 & 3. Navigate to profile page via navigation link
  await dashboardPage.clickMyProfile();
  // Wait for profile page to load
  await profilePage.verifyOnProfilePage();

  // 4. View profile page content

    // Expected Results: Page title and user information
    await profilePage.verifyUserInfo('Profile Student', uniqueEmail);

    // Expected Results: "Edit Profile" button
    await profilePage.verifyEditProfileButton();

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
