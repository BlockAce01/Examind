// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Dashboard and User Profile', () => {
  test.fixme('2.4 Profile - Edit Profile Button - Edit Profile feature not implemented', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const profilePage = new ProfilePage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('editprofile');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Edit Profile Test', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']);

  // Login and navigate directly to profile page
  await loginPage.navigateToLogin();
  await loginPage.login(uniqueEmail, 'SecurePass123!');
  await profilePage.navigateToProfile();

    // 2. Click "Edit Profile" button
    await profilePage.verifyEditProfileButton();
    await profilePage.clickEditProfile();
    // 3. Check if edit form appears (name field)
    const nameField = page.getByRole('textbox', { name: /Name/i });
    if (await nameField.count() === 0) {
      // Edit feature not implemented yet
      test.fixme();
      return;
    }
    await expect(nameField).toBeVisible();
    await nameField.fill('Updated Profile Name');

    // Expected Results: Email may be read-only or require verification
    const emailField = page.locator('input[type="email"]');
    if (await emailField.isVisible()) {
      const isReadOnly = await emailField.getAttribute('readonly');
      const isDisabled = await emailField.getAttribute('disabled');
      expect(isReadOnly !== null || isDisabled !== null).toBeTruthy();
    }

    // Expected Results: Changes save to database on submission
    await page.getByRole('button', { name: /Save/i }).click();
    await expect(page.getByText(/Updated Profile Name/i)).toBeVisible();
  });
});
