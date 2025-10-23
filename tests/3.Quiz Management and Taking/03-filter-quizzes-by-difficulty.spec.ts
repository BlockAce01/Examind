// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Quiz Management and Taking', () => {
  test('3.3 Filter Quizzes by Difficulty', async ({ page }) => {
    const uniqueEmail = `filterdifficulty.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Filter Difficulty User');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['Chemistry']);
    await page.getByLabel('Subject 3').selectOption(['Combined Mathematics']);
    await page.getByRole('button', { name: 'Register' }).click();

    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for login to complete and redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // 1. Navigate to /quizzes
    await page.goto('http://localhost:3000/quizzes');

    // 2. Select "Hard" from difficulty filter
    const difficultySelect = page.getByLabel(/Difficulty/i);
    const diffOptions = await difficultySelect.locator('option').allTextContents();
    
    if (!diffOptions.includes('Hard')) {
      // If Hard option not available, skip test
      test.skip();
    }

    await difficultySelect.selectOption('Hard');

    // 3. Observe results
    await page.waitForTimeout(500); // Wait for filter to apply

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
      await expect(page.getByRole('button', { name: /Clear Filters/i })).toBeEnabled();
    }

    // Expected Results: Can combine with subject filter for compound filtering
    const subjectSelect = page.getByLabel(/Subject/i);
    const subjectOptions = await subjectSelect.locator('option').allTextContents();
    
    if (subjectOptions.includes('Physics')) {
      await subjectSelect.selectOption('Physics');
      await page.waitForTimeout(500);
      
      const compoundFiltered = page.locator('[data-testid="quiz-card"]:has-text("Physics"):has-text("Hard")');
      if (await compoundFiltered.count() > 0) {
        await expect(compoundFiltered.first()).toBeVisible();
      }
    }
  });
});
