// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Quiz Management and Taking', () => {
  test('3.9 View Quiz Results', async ({ page }) => {
    const uniqueEmail = `viewresults.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('View Results User');
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

    // Complete a quiz
    await page.goto('http://localhost:3000/quizzes');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    const startQuizButtons = page.locator('a[href*="/quizzes/"][href*="/take"]');
    const buttonCount = await startQuizButtons.count();
    
    if (buttonCount === 0) {
      test.skip();
    }

    await startQuizButtons.first().click();

    // Answer questions and submit
    const questionCount = await page.getByText(/Question 1 of (\d+)/i).textContent();
    const totalQuestions = parseInt(questionCount?.match(/\d+$/)?.[0] || '3');

    for (let i = 0; i < totalQuestions; i++) {
      const answerButtons = page.getByRole('button').filter({ hasText: /^\d+%$|^[A-Za-z0-9\s\-\.]+$/ });
      const firstAnswer = answerButtons.first();
      if (await firstAnswer.isVisible()) {
        await firstAnswer.click();
      }
      if (i < totalQuestions - 1) {
        await page.getByRole('button', { name: /Next/i }).click();
      }
    }

    await page.getByRole('button', { name: /Submit|Finish/i }).click();

    // 1. Complete and submit a quiz
    // 2. Observe results page
    // 3. Review result details
    
    // Expected Results: Results page displays score
    await expect(page.getByRole('heading', { name: /Quiz Results/i })).toBeVisible();
    await expect(page.getByText('Your Score')).toBeVisible();
    await expect(page.getByText(/\d+ \/ \d+/)).toBeVisible(); // Score format like "2 / 3"

    // Expected Results: Percentage score
    await expect(page.getByText(/\(\d+%\)/)).toBeVisible(); // Percentage like "(67%)"

    // Expected Results: Points earned - check for submission message
    await expect(page.getByText('Good Job!')).toBeVisible();
    await expect(page.getByText(/Submitted on:/)).toBeVisible();

    // Expected Results: Question-by-question review
    await expect(page.getByRole('heading', { name: 'Answer Review' })).toBeVisible();

    // Expected Results: User's selected answer and correct answer shown
    await expect(page.locator('text="(Your Answer)"').first()).toBeVisible();

    // Expected Results: "Back to Quizzes" button
    await expect(page.getByRole('link', { name: /Back to Quizzes/i })).toBeVisible();

    // Expected Results: Option to view AI chatbot explanation (if implemented)
    await expect(page.getByRole('heading', { name: 'AI Assistant', level: 2 })).toBeVisible();
  });
});
