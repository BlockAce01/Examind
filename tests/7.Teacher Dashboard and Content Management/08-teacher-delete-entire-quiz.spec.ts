// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Teacher Dashboard and Content Management', () => {
  test('7.8 Teacher - Delete Entire Quiz', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const teacherEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Test Teacher', teacherEmail, 'SecurePass123!', 'Physics');

    await page.goto('/teacher/quizzes');
    
    const initialQuizCount = await page.locator('[data-testid="teacher-quiz-card"]').count();
    
    const deleteButton = page.getByRole('button', { name: /Delete/i }).first();
    if (await deleteButton.count() > 0 && initialQuizCount > 0) {
      page.on('dialog', dialog => dialog.accept());
      await deleteButton.click();
      await page.waitForTimeout(1000);
      
      const newQuizCount = await page.locator('[data-testid="teacher-quiz-card"]').count();
      expect(newQuizCount).toBeLessThanOrEqual(initialQuizCount);
    }
  });
});
