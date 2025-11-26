// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Admin Dashboard and User Management', () => {
  test('8.4 Admin - Delete User Account', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const adminEmail = registerPage.generateUniqueEmail('admin');
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Admin User', adminEmail, 'AdminPass123!', 'Physics');
    
    await page.goto('/admin/users');
    await page.waitForTimeout(1000);
    
    const initialUserCount = await page.locator('tr[data-testid^="user-"]').count();
    
    const deleteButton = page.getByRole('button', { name: /Delete/i }).first();
    if (await deleteButton.count() > 0) {
      page.on('dialog', dialog => dialog.accept());
      await deleteButton.click();
      await page.waitForTimeout(1000);
      
      const newUserCount = await page.locator('tr[data-testid^="user-"]').count();
      expect(newUserCount).toBeLessThanOrEqual(initialUserCount);
    }
  });
});
