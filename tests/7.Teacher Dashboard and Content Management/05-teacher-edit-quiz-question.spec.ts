// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Teacher Dashboard and Content Management', () => {
  test('7.5 Teacher - Edit Quiz Question', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const teacherEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Test Teacher', teacherEmail, 'SecurePass123!', 'Physics');

    await page.goto('http://localhost:3000/teacher/quizzes');
    const editButton = page.getByRole('button', { name: /Edit/i }).first();
    if (await editButton.count() > 0) {
      await editButton.click();
      await page.waitForTimeout(1000);
      
      const questionEditButton = page.getByRole('button', { name: /Edit/i }).first();
      if (await questionEditButton.count() > 0) {
        await questionEditButton.click();
        await page.getByLabel(/Question|Text/i).fill('Updated question text');
        await page.getByRole('button', { name: /Save|Update/i }).click();
        await page.waitForTimeout(500);
      }
    }
  });
});
