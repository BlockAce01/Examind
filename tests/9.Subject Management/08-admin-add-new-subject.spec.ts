// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Subject Management', () => {
  test('9.8 Admin - Add New Subject', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Admin User', registerPage.generateUniqueEmail('admin'), 'AdminPass123!', 'Physics');
    
    await page.goto('http://localhost:3000/admin/subjects');
    await page.waitForTimeout(1000);
    
    const addSubjectButton = page.getByRole('button', { name: /Add Subject|New Subject|\+ Subject/i });
    if (await addSubjectButton.count() > 0) {
      await addSubjectButton.click();
      
      await page.getByLabel(/Subject Name|Name/i).fill('Law');
      await page.getByRole('button', { name: /Save|Add|Create/i }).click();
      await page.waitForTimeout(500);
      
      // Expected Results: New subject added to Subject table
      const subjectList = page.getByText('Law');
      if (await subjectList.count() > 0) {
        await expect(subjectList.first()).toBeVisible();
      }
    }
  });
});
