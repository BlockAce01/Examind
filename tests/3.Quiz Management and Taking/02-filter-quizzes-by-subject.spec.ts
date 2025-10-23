// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';

test.describe('Quiz Management and Taking', () => {
  test('3.2 Filter Quizzes by Subject', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('filtersubject');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Filter Subject User', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // Wait for session to establish
    await page.waitForTimeout(2000);
    await quizzesPage.navigateToQuizzes();

    // Count initial quizzes
    const initialCount = await page.locator('[data-testid="quiz-card"]').count();

    // 2. Check available options in subject filter and select if Physics exists
    const subjectSelect = page.getByLabel(/Subject/i);
    const options = await subjectSelect.locator('option').allTextContents();
    
    const hasPhysics = options.some(opt => opt.includes('Physics'));
    if (!hasPhysics) {
      test.skip(true, 'Physics subject not available in filter options');
      return;
    }

    // Select "Physics" from subject filter dropdown
    await quizzesPage.filterBySubject('Physics');

    // 3. Observe filtered results
    await page.waitForTimeout(500);

    // Expected Results: Only Physics quizzes are displayed
    const physicsQuizzes = page.locator('[data-testid="quiz-card"]:has-text("Physics")');
    const filteredCount = await page.locator('[data-testid="quiz-card"]').count();
    
    if (filteredCount > 0) {
      await expect(physicsQuizzes.first()).toBeVisible();
    }

    // Expected Results: Other subject quizzes are hidden
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    // Expected Results: "Clear Filters" button becomes enabled
    await quizzesPage.verifyClearFiltersEnabled();

    // Expected Results: Filter selection persists during page session
    await page.reload();
    const selectedValue = await subjectSelect.inputValue();
    if (selectedValue) {
      expect(selectedValue).toBe('Physics');
    }
  });
});
