// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Quiz Management and Taking', () => {
  test('3.8 Submit Quiz Before Time Expires', async ({ page }) => {
    const uniqueEmail = `submitquiz.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Submit Quiz User');
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

    // 1. Start a quiz
    await page.goto('http://localhost:3000/quizzes');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    const startQuizButtons = page.locator('a[href*="/quizzes/"][href*="/take"]');
    const buttonCount = await startQuizButtons.count();
    
    if (buttonCount === 0) {
      test.skip();
    }

    await startQuizButtons.first().click();

    // 2. Answer all questions
    const questionCount = await page.getByText(/Question 1 of (\d+)/i).textContent();
    const totalQuestions = parseInt(questionCount?.match(/\d+$/)?.[0] || '3');

    for (let i = 0; i < totalQuestions; i++) {
      // Select first answer option by clicking any answer button
      const answerButtons = page.getByRole('button').filter({ hasText: /^\d+%$|^[A-Za-z0-9\s\-\.]+$/ });
      const firstAnswer = answerButtons.first();
      if (await firstAnswer.isVisible()) {
        await firstAnswer.click();
      }
      
      // Click Next or Submit on last question
      if (i < totalQuestions - 1) {
        await page.getByRole('button', { name: /Next/i }).click();
      }
    }

    // 3. Navigate to last question
    // 4. Click "Next" or "Submit" button on final question
    const submitButton = page.getByRole('button', { name: /Submit|Finish/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // 5. Confirm submission if prompted
    const confirmButton = page.getByRole('button', { name: /Confirm|Yes|Submit/i });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    // Expected Results: User redirected to results page
    await expect(page).toHaveURL(/.*results|.*score/i);

    // Expected Results: Quiz submission confirmation appears
    await expect(page.getByRole('heading', { name: /Quiz Results/i })).toBeVisible();

    // Expected Results: Score calculated and displayed
    await expect(page.getByText('Your Score')).toBeVisible();
    await expect(page.getByText(/\d+ \/ \d+/)).toBeVisible(); // Score format like "2 / 3"

    // Expected Results: Timer stops and points awarded
    await expect(page.getByText(/\(\d+%\)/)).toBeVisible(); // Percentage like "(67%)"
  });
});
