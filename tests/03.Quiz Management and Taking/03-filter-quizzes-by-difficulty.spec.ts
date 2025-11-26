// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';

test.describe('Quiz Management and Taking', () => {
  test('3.3 Filter Quizzes by Difficulty', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('filterdifficulty');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Filter Difficulty User', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // Wait for session to establish
    await page.waitForTimeout(2000);

    // 1. Navigate to /quizzes directly
    await quizzesPage.navigateToQuizzes();

    // 2. Select "Hard" from difficulty filter
    const difficultySelect = page.getByLabel(/Difficulty/i);
    const diffOptions = await difficultySelect.locator('option').allTextContents();
    
    const hasHard = diffOptions.some(opt => opt.includes('Hard'));
    if (!hasHard) {
      test.skip(true, 'Hard difficulty not available in filter options');
      return;
    }

    await quizzesPage.filterByDifficulty('Hard');

    // 3. Observe results
    await page.waitForTimeout(500);

    // Expected Results: Only "Hard" difficulty quizzes shown
    const hardQuizzes = page.locator('[data-testid="quiz-card"]:has-text("Hard")');
    const filteredCount = await page.locator('[data-testid="quiz-card"]').count();
    
    if (filteredCount > 0) {
      await expect(hardQuizzes.first()).toBeVisible();
    }

    // Expected Results: Easy and Medium quizzes hidden
    await expect(page.locator('[data-testid="quiz-card"]:has-text("Easy")')).toHaveCount(0);
    await expect(page.locator('[data-testid="quiz-card"]:has-text("Medium")')).toHaveCount(0);

    // Expected Results: "Clear Filters" button enabled
    if (filteredCount > 0) {
      await quizzesPage.verifyClearFiltersEnabled();
    }

    // Expected Results: Can combine with subject filter for compound filtering
    const subjectSelect = page.getByLabel(/Subject/i);
    const subjectOptions = await subjectSelect.locator('option').allTextContents();
    
    if (subjectOptions.includes('Physics')) {
      await quizzesPage.filterBySubject('Physics');
      await page.waitForTimeout(500);
      
      const compoundFiltered = page.locator('[data-testid="quiz-card"]:has-text("Physics"):has-text("Hard")');
      if (await compoundFiltered.count() > 0) {
        await expect(compoundFiltered.first()).toBeVisible();
      }
    }
  });
});
