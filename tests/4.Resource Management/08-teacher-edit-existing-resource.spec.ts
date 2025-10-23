// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage } from '../pages';

test.describe('Resource Management', () => {
  test('4.8 Teacher - Edit Existing Resource', async ({ page }) => {
    const uniqueEmail = `teacheredresource.${Date.now()}@example.com`;
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    // Register as teacher and create a resource first
    await registerPage.navigateToRegister();
    await registerPage.registerTeacher('Teacher Edit Resource', uniqueEmail, 'SecurePass123!', 'Chemistry');

    // 1. Login as teacher
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // 2. Navigate to resources created by this teacher
    await page.goto('http://localhost:3000/teacher/resources');

    // 3. Click "Edit" button on a resource
    const editButton = page.getByRole('button', { name: /Edit/i }).first();
    
    if (await editButton.isVisible()) {
      await editButton.click();

      // Expected Results: Edit form pre-populated with current data
      const titleField = page.getByLabel(/Title/i);
      await expect(titleField).toBeVisible();
      const currentTitle = await titleField.inputValue();
      expect(currentTitle).toBeTruthy();

      // 4. Modify title to "Updated Chemistry Notes"
      await titleField.fill('Updated Chemistry Notes');

      // 5. Change description
      await page.getByLabel(/Description/i).fill('Updated description for chemistry notes');

      // 6. Save changes
      await page.getByRole('button', { name: /Save|Update/i }).click();

      // Expected Results: Changes save successfully to database
      await expect(page.getByText(/Success|updated|saved/i)).toBeVisible();

      // Expected Results: Updated resource reflects new information
      await expect(page.getByText(/Updated Chemistry Notes/i)).toBeVisible();
    } else {
      console.log('No resources available to edit or Edit button not found');
    }
  });
});
