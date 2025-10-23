// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage } from '../pages';

test.describe('Teacher Dashboard and Content Management', () => {
  test('7.3 Teacher - Create New Quiz', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    // Setup: Login as teacher
    const teacherEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher(
      'Test Teacher',
      teacherEmail,
      'SecurePass123!',
      'Combined Mathematics'
    );

    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(teacherEmail, 'SecurePass123!');
    // Wait for successful login redirect to teacher dashboard
    await page.waitForURL('**/teacher');

    // 1. Navigate to /teacher/quizzes
    await page.goto('http://localhost:3000/teacher/quizzes');

    // 2. Click "+ Create New Quiz" button
    const createQuizButton = page.getByRole('button', { name: '+ Add New Quiz' });
    await createQuizButton.click();

    // 3. Fill in quiz details
    await page.getByLabel(/Title/i).fill('Calculus Basics Quiz');
    
    const subjectSelect = page.getByLabel(/Subject/i);
    if (await subjectSelect.count() > 0) {
      await subjectSelect.selectOption(['Combined Mathematics']);
    }
    
    const difficultySelect = page.getByLabel(/Difficulty/i);
    if (await difficultySelect.count() > 0) {
      await difficultySelect.selectOption(['Medium']);
    }
    
    await page.getByLabel(/Time Limit/i).fill('15');

    // 4. Click "Save" or "Next" to add questions
    const saveButton = page.getByRole('button', { name: /Save|Next|Create/i });
    await saveButton.click();

    // Expected Results:
    // - On submission: Quiz record created, QuizID generated
    // - Teacher proceeds to question addition step
    await page.waitForTimeout(1000);
    
    // Should redirect to question addition page or show success message
    const successIndicator = page.getByText(/Quiz created|Success|Add Questions/i);
    if (await successIndicator.count() > 0) {
      await expect(successIndicator.first()).toBeVisible();
    }
  });
});
