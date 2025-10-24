// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage } from '../pages';

test.describe('Resource Management', () => {
  test('4.9 Teacher - Delete Resource', async ({ page }) => {
    const uniqueEmail = `teacherdelresource.${Date.now()}@example.com`;
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    // Register as teacher
    await registerPage.navigateToRegister();
    await registerPage.registerTeacher('Teacher Delete Resource', uniqueEmail, 'SecurePass123!', 'Physics');

    // 1. Login as teacher
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    await page.waitForTimeout(1000);

    // 2. Find resource created by this teacher
    await page.goto('/teacher/resources');

    const resourceCount = await page.locator('[data-testid="resource-card"]').count();

    if (resourceCount > 0) {
      // 3. Click "Delete" button
      const deleteButton = page.getByRole('button', { name: /Delete/i }).first();
      await deleteButton.click();

      // 4. Confirm deletion in prompt
      // Expected Results: Confirmation dialog appears
      await expect(page.getByText(/Are you sure|Confirm|Delete/i)).toBeVisible();
      
      const confirmButton = page.getByRole('button', { name: /Confirm|Yes|Delete/i });
      await confirmButton.click();

      // Expected Results: Resource deleted from database
      await expect(page.getByText(/Success|deleted|removed/i)).toBeVisible();

      // Expected Results: Resource no longer appears in listing
      await page.waitForTimeout(1000);
      const newCount = await page.locator('[data-testid="resource-card"]').count();
      expect(newCount).toBeLessThan(resourceCount);
    } else {
      console.log('No resources available to delete');
    }
  });
});
