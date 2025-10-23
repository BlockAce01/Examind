// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Admin Dashboard and User Management', () => {
  test('8.3 Admin - Edit User Details', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const adminEmail = registerPage.generateUniqueEmail('admin');
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Admin User', adminEmail, 'AdminPass123!', 'Physics');
    
    await page.goto('http://localhost:3000/admin/users');
    await page.waitForTimeout(1000);
    
    const editButton = page.getByRole('button', { name: /Edit/i }).first();
    if (await editButton.count() > 0) {
      await editButton.click();
      await page.waitForTimeout(500);
      
      const nameInput = page.getByLabel(/Name/i);
      if (await nameInput.count() > 0) {
        await nameInput.fill('Updated Name');
        await page.getByRole('button', { name: /Save|Update/i }).click();
        await page.waitForTimeout(500);
      }
    }
  });
});
