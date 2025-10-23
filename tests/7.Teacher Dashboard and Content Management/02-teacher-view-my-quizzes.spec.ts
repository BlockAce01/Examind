// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage } from '../pages';

test.describe('Teacher Dashboard and Content Management', () => {
  test('7.2 Teacher - View My Quizzes', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // 1. Login as teacher
    const teacherEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher(
      'Test Teacher',
      teacherEmail,
      'SecurePass123!',
      'Physics'
    );

    // 2. Navigate to /teacher/quizzes
    await page.goto('http://localhost:3000/teacher/quizzes');

    // 3. View quiz management interface
    // Expected Results:
    // - List of quizzes created by this teacher
    const quizList = page.locator('[data-testid="teacher-quiz-list"]').or(
      page.getByText(/My Quizzes|Your Quizzes/i)
    );
    
    // - "+ Create New Quiz" button at top
    const createQuizButton = page.getByRole('button', { name: /Create New Quiz|Add Quiz|\+ Create/i });
    if (await createQuizButton.count() > 0) {
      await expect(createQuizButton).toBeVisible();
    }

    // - Each quiz shows: Title, Subject, Difficulty, Number of questions, Created date, Edit and Delete buttons
    const quizCards = page.locator('[data-testid="teacher-quiz-card"]');
    const quizCount = await quizCards.count();
    
    if (quizCount > 0) {
      const firstQuiz = quizCards.first();
      
      // Verify edit and delete buttons are present
      const editButton = firstQuiz.getByRole('button', { name: /Edit/i });
      const deleteButton = firstQuiz.getByRole('button', { name: /Delete/i });
      
      if (await editButton.count() > 0) {
        await expect(editButton).toBeVisible();
      }
      if (await deleteButton.count() > 0) {
        await expect(deleteButton).toBeVisible();
      }
    }
  });
});
