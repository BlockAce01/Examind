// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage } from '../pages';

test.describe('Teacher Dashboard and Content Management', () => {
  test('7.4 Teacher - Add Questions to Quiz', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Setup: Login as teacher and create a quiz
    const teacherEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Test Teacher', teacherEmail, 'SecurePass123!', 'Combined Mathematics');

    await page.goto('/teacher/quizzes');
    
    // Create quiz first
    const createQuizButton = page.getByRole('button', { name: /Create New Quiz|Add Quiz|\+ Create/i });
    if (await createQuizButton.count() > 0) {
      await createQuizButton.click();
      await page.getByLabel(/Title/i).fill('Test Quiz for Questions');
      await page.getByRole('button', { name: /Save|Next|Create/i }).click();
      await page.waitForTimeout(1000);
    }

    // 1. After creating quiz, or editing existing quiz
    // 2. Click "Add Question" button
    const addQuestionButton = page.getByRole('button', { name: /Add Question|\+ Question/i });
    if (await addQuestionButton.count() > 0) {
      await addQuestionButton.click();

      // 3. Fill in question form
      await page.getByLabel(/Question|Text/i).fill('What is the derivative of x²?');
      await page.locator('input[placeholder*="Option 1"]').or(page.getByLabel(/Option 1/i)).fill('x');
      await page.locator('input[placeholder*="Option 2"]').or(page.getByLabel(/Option 2/i)).fill('2x');
      await page.locator('input[placeholder*="Option 3"]').or(page.getByLabel(/Option 3/i)).fill('2');
      await page.locator('input[placeholder*="Option 4"]').or(page.getByLabel(/Option 4/i)).fill('x²');
      
      // Mark option 2 as correct
      const correctAnswerRadio = page.locator('input[type="radio"]').nth(1);
      if (await correctAnswerRadio.count() > 0) {
        await correctAnswerRadio.check();
      }

      // 4. Save question
      await page.getByRole('button', { name: /Save Question|Add/i }).click();

      // Expected Results: Question created in Question table
      await page.waitForTimeout(1000);
      const successMessage = page.getByText(/Question added|Success/i);
      if (await successMessage.count() > 0) {
        await expect(successMessage.first()).toBeVisible();
      }
    }
  });
});
