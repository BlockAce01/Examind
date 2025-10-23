// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, QuizzesPage, QuizTakingPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.14 Browser Back Button During Quiz', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', registerPage.generateUniqueEmail('student'), 'SecurePass123!', ['Physics', 'Chemistry', 'Biology']);
    
    await quizzesPage.navigateToQuizzes();
    const quizCount = await quizzesPage.getQuizCardCount();
    
    if (quizCount > 0) {
      await quizzesPage.startQuiz();
      
      // Answer first question
      await quizTakingPage.selectAnswer(0);
      
      // Click browser back button
      await page.goBack();
      await page.waitForTimeout(500);
      
      // Expected Results: User navigated away OR warning shown
      const warningDialog = page.locator('[role="dialog"]').or(
        page.getByText(/Are you sure|Quiz in progress|Leave page/i)
      );
      
      if (await warningDialog.count() > 0) {
        // Warning shown - quiz protection working
        await expect(warningDialog.first()).toBeVisible();
      } else {
        // User navigated away - verify not on quiz page
        expect(page.url()).not.toMatch(/\/quizzes\/.*\/take/);
      }
    }
  });
});
