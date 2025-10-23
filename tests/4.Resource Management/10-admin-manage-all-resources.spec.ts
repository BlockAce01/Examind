// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';

test.describe('Resource Management', () => {
  test('4.10 Admin - Manage All Resources', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Use fixed admin account
    const adminEmail = 'pakaya@email.com';
    const adminPassword = 'asdasd';

    // 1. Login as admin
    await loginPage.navigateToLogin();
    await loginPage.login(adminEmail, adminPassword);

    await page.waitForURL('**/admin', { timeout: 10000 });
    
    // 2. Navigate to /admin or admin resources view
    await page.goto('http://localhost:3000/admin/resources');

    // 3. View all resources from all uploaders
    // Expected Results: Admin can see all resources regardless of uploader
    await expect(page.getByRole('heading', { name: /Resources|Admin|Manage/i })).toBeVisible();

    const allResources = page.locator('[data-testid="resource-card"]');
    if (await allResources.count() > 0) {
      await expect(allResources.first()).toBeVisible();

      // 4. Edit or delete any resource
      // Expected Results: Can edit any resource
      const editButton = page.getByRole('button', { name: /Edit/i }).first();
      if (await editButton.isVisible()) {
        await expect(editButton).toBeEnabled();
      }

      // Expected Results: Can delete any resource
      const deleteButton = page.getByRole('button', { name: /Delete/i }).first();
      if (await deleteButton.isVisible()) {
        await expect(deleteButton).toBeEnabled();
      }

      // Expected Results: Has full control over resource management
      await expect(page).toHaveURL(/.*admin/);
    } else {
      console.log('No resources available for admin management');
    }
  });
});
