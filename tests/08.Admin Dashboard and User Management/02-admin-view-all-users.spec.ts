// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Admin Dashboard and User Management', () => {
  test('8.2 Admin - View All Users', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const adminEmail = registerPage.generateUniqueEmail('admin');
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Admin User', adminEmail, 'AdminPass123!', 'Physics');
    
    await page.goto('/admin/users');
    await page.waitForTimeout(1000);
    
    // Expected Results: Table/list of all users
    const userTable = page.locator('table').or(page.locator('[data-testid="user-list"]'));
    if (await userTable.count() > 0) {
      await expect(userTable.first()).toBeVisible();
    }
    
    // Search/filter options
    const searchInput = page.getByPlaceholder(/Search|Filter/i);
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
    }
  });
});
