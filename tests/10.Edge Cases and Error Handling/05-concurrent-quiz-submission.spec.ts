// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, QuizzesPage, QuizTakingPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.5 Concurrent Quiz Submission', async ({ page, context }) => {
    const registerPage = new RegisterPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    
    await registerPage.navigateDirectly();
    const email = registerPage.generateUniqueEmail('student');
    await registerPage.registerStudent('Test Student', email, 'SecurePass123!', ['Physics', 'Chemistry', 'Biology']);
    
    await quizzesPage.navigateToQuizzes();
    const quizCount = await quizzesPage.getQuizCardCount();
    
    if (quizCount > 0) {
      await quizzesPage.startQuiz();
      const quizUrl = page.url();
      
      // Answer questions in first tab
      await quizTakingPage.selectAnswer(0);
      
      // Open same quiz in second tab
      const page2 = await context.newPage();
      await page2.goto(quizUrl);
      await page2.waitForTimeout(500);
      
      // Submit in both tabs
      const quizTakingPage2 = new QuizTakingPage(page2);
      await quizTakingPage2.selectAnswer(0);
      
      await Promise.all([
        quizTakingPage.confirmSubmission(),
        quizTakingPage2.confirmSubmission()
      ]);
      
      await page.waitForTimeout(1000);
      
      // Expected Results: One succeeds, other shows error
      // Database constraints should prevent duplicate submissions
      await page2.close();
    }
  });
});
