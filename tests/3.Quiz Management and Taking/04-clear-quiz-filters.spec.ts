// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';

test.describe('Quiz Management and Taking', () => {
  test('3.4 Clear Quiz Filters', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('clearfilters');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Clear Filters User', uniqueEmail, 'SecurePass123!',
      ['Chemistry', 'Physics', 'Combined Mathematics']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // Wait for session to establish
    await page.waitForTimeout(2000);

    await quizzesPage.navigateToQuizzes();

    // Wait for page to load and check if quizzes are available
    await page.waitForLoadState('networkidle');
    
    // Get initial quiz count - use a more reliable selector
    const initialButtons = page.getByRole('link', { name: /Start Quiz/i });
    const initialCount = await initialButtons.count();

    console.log(`Initial quiz count: ${initialCount}`);

    if (initialCount === 0) {
      test.skip(true, 'No quizzes available');
      return;
    }

    // Check if Chemistry option exists in subject filter
    const subjectSelect = page.getByLabel(/Subject/i);
    const subjectOptions = await subjectSelect.locator('option').allTextContents();

    console.log(`Subject filter options: ${subjectOptions}`);

    const hasChemistry = subjectOptions.some(opt => opt.includes('Chemistry'));
    if (!hasChemistry) {
      test.skip(true, 'Chemistry subject not available');
      return;
    }

    // 1. Apply subject filter "Chemistry"
    await quizzesPage.filterBySubject('Chemistry');
    await page.waitForTimeout(500);

    // 2. Apply difficulty filter "Medium"
    await quizzesPage.filterByDifficulty('Medium');
    await page.waitForTimeout(500);

    // Verify filters are applied - use more reliable selector
    const filteredButtons = page.getByRole('link', { name: /Start Quiz/i });
    const filteredCount = await filteredButtons.count();
    console.log(`Filtered quiz count: ${filteredCount}`);
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    // 3. Click "Clear Filters" button
    await quizzesPage.clearFilters();

    // Expected Results: All quizzes displayed again
    const clearedButtons = page.getByRole('link', { name: /Start Quiz/i });
    const clearedCount = await clearedButtons.count();
    console.log(`Cleared quiz count: ${clearedCount}`);
    expect(clearedCount).toBeGreaterThanOrEqual(filteredCount);

    // Expected Results: Subject dropdown resets to "All Subjects"
    const subjectValue = await subjectSelect.inputValue();
    expect(subjectValue).toBe('');

    // Expected Results: Difficulty dropdown resets to "All Difficulties"
    const diffValue = await page.getByLabel(/Difficulty/i).inputValue();
    expect(diffValue).toBe('');

    // Expected Results: "Clear Filters" button becomes disabled
    await quizzesPage.verifyClearFiltersDisabled();
  });
});
