// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Quiz Management and Taking', () => {
  test('3.1 Browse Available Quizzes', async ({ page }) => {
    const uniqueEmail = `quizbrowse.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Quiz Browser');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['Chemistry']);
    await page.getByLabel('Subject 3').selectOption(['Combined Mathematics']);
    await page.getByRole('button', { name: 'Register' }).click();

    // 1. Login as student
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for login to complete and redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // 2. Navigate to /quizzes
    await page.goto('http://localhost:3000/quizzes');

    // 3. Observe quiz listing
    // Expected Results: Page title: "Available Quizzes"
    await expect(page.getByRole('heading', { name: /Available Quizzes/i })).toBeVisible();

    // Expected Results: Filter options displayed
    await expect(page.getByLabel(/Subject/i)).toBeVisible();
    await expect(page.getByLabel(/Difficulty/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear Filters/i })).toBeVisible();

    // Expected Results: Each quiz card displays required information
    const quizCards = page.locator('[data-testid="quiz-card"]');
    if (await quizCards.count() > 0) {
      const firstCard = quizCards.first();
      await expect(firstCard).toBeVisible();
      
      // Quiz title
      await expect(firstCard.locator('text=/Quiz/i')).toBeVisible();
      
      // Difficulty badge
      await expect(firstCard.locator('text=/Easy|Medium|Hard/i')).toBeVisible();
      
      // Subject name
      await expect(firstCard.locator('text=/Physics|Chemistry|Mathematics|ICT/i')).toBeVisible();
      
      // Number of questions
      await expect(firstCard.locator('text=/questions/i')).toBeVisible();
      
      // Time limit
      await expect(firstCard.locator('text=/minutes/i')).toBeVisible();
      
      // "Start Quiz" button
      await expect(firstCard.getByRole('button', { name: /Start Quiz/i })).toBeVisible();
    }
  });
});
