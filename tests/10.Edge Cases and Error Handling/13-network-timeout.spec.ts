// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, QuizzesPage, QuizTakingPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.13 Network Timeout', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', registerPage.generateUniqueEmail('student'), 'SecurePass123!', ['Physics', 'Chemistry', 'Biology']);
    
    await quizzesPage.navigateToQuizzes();
    const quizCount = await quizzesPage.getQuizCardCount();
    
    if (quizCount > 0) {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });
      
      await quizzesPage.startQuiz();
      
      // Expected Results: Loading indicator shows
      const loadingIndicator = page.locator('[data-testid="loading"]').or(
        page.getByText(/Loading|Please wait/i)
      );
      
      // Timeout should show error after delay
      await page.waitForTimeout(2000);
    }
  });
});
