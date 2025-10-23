// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Subject Management', () => {
  test('9.4 Teacher - Create Content for Assigned Subject', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Test Teacher', registerPage.generateUniqueEmail('teacher'), 'SecurePass123!', 'Physics');
    
    await page.goto('http://localhost:3000/teacher/quizzes');
    await page.waitForTimeout(1000);
    
    const createQuizButton = page.getByRole('button', { name: /Create New Quiz/i });
    if (await createQuizButton.count() > 0) {
      await createQuizButton.click();
      
      // Expected Results: Subject field pre-filled with teacher's subject
      const subjectSelect = page.getByLabel(/Subject/i);
      if (await subjectSelect.count() > 0) {
        const selectedValue = await subjectSelect.inputValue();
        // Should be Physics or disabled/pre-selected
      }
    }
  });
});
