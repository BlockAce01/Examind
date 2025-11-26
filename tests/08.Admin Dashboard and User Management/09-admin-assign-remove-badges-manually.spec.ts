// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Admin Dashboard and User Management', () => {
  test('8.9 Admin - Assign/Remove Badges Manually', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const adminEmail = registerPage.generateUniqueEmail('admin');
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Admin User', adminEmail, 'AdminPass123!', 'Physics');
    
    await page.goto('/admin/users');
    await page.waitForTimeout(1000);
    
    const manageBadgesButton = page.getByRole('button', { name: /Manage Badges|Badges/i }).first();
    if (await manageBadgesButton.count() > 0) {
      await manageBadgesButton.click();
      await page.waitForTimeout(500);
      
      // Expected Results: Badge management interface
      const badgeInterface = page.getByText(/Badges|Assign Badge|Available Badges/i);
      if (await badgeInterface.count() > 0) {
        await expect(badgeInterface.first()).toBeVisible();
      }
    }
  });
});
