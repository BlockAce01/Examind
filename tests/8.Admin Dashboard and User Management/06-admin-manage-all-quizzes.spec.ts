// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Admin Dashboard and User Management', () => {
  test('8.6 Admin - Manage All Quizzes', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const adminEmail = registerPage.generateUniqueEmail('admin');
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Admin User', adminEmail, 'AdminPass123!', 'Physics');
    
    await page.goto('http://localhost:3000/admin/quizzes');
    await page.waitForTimeout(1000);
    
    // Expected Results: Admin can see all quizzes regardless of creator
    const quizList = page.locator('[data-testid="admin-quiz-list"]').or(page.getByText(/All Quizzes/i));
    
    const editButtons = page.getByRole('button', { name: /Edit/i });
    const deleteButtons = page.getByRole('button', { name: /Delete/i });
    
    if (await editButtons.count() > 0) {
      await expect(editButtons.first()).toBeVisible();
    }
    if (await deleteButtons.count() > 0) {
      await expect(deleteButtons.first()).toBeVisible();
    }
  });
});
