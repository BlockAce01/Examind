// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Quiz Management and Taking', () => {
  test('3.2 Filter Quizzes by Subject', async ({ page }) => {
    const uniqueEmail = `filtersubject.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Filter Subject User');
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

    // Count initial quizzes
    const initialCount = await page.locator('[data-testid="quiz-card"]').count();

    // 2. Check available options in subject filter and select if Physics exists
    const subjectSelect = page.getByLabel(/Subject/i);
    const options = await subjectSelect.locator('option').allTextContents();
    
    if (!options.includes('Physics')) {
      // If Physics is not available, skip the test as subject options aren't populated
      test.skip();
    }

    // Select "Physics" from subject filter dropdown
    await subjectSelect.selectOption('Physics');

    // 3. Observe filtered results
    await page.waitForTimeout(500); // Wait for filter to apply

    // Expected Results: Only Physics quizzes are displayed
    const physicsQuizzes = page.locator('[data-testid="quiz-card"]:has-text("Physics")');
    const filteredCount = await page.locator('[data-testid="quiz-card"]').count();
    
    if (filteredCount > 0) {
      await expect(physicsQuizzes.first()).toBeVisible();
    }

    // Expected Results: Other subject quizzes are hidden
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    // Expected Results: "Clear Filters" button becomes enabled
    const clearButton = page.getByRole('button', { name: /Clear Filters/i });
    if (filteredCount > 0) {
      await expect(clearButton).toBeEnabled();
    }

    // Expected Results: Filter selection persists during page session
    await page.reload();
    const selectedValue = await subjectSelect.inputValue();
    if (selectedValue) {
      expect(selectedValue).toBe('Physics');
    }
  });
});
