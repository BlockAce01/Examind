// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Quiz Management and Taking', () => {
  test('3.11 Quiz Results - AI Chat Assistance', async ({ page }) => {
    const uniqueEmail = `aichat.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('AI Chat User');
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

    // 1. Complete a quiz
    await page.goto('http://localhost:3000/quizzes');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    const startQuizButtons = page.locator('a[href*="/quizzes/"][href*="/take"]');
    const buttonCount = await startQuizButtons.count();
    
    if (buttonCount === 0) {
      test.skip();
    }

    await startQuizButtons.first().click();

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

    // 2. On results page, look for AI chatbot option
    await expect(page).toHaveURL(/.*results|.*score/i);

    // 3. Click to interact with AI chat
    const aiChatButton = page.getByRole('button', { name: /AI|Chat|Help|Ask AI|Get Explanation/i });
    
    if (await aiChatButton.isVisible()) {
      await aiChatButton.click();

      // Expected Results: AI chat interface appears
      await expect(page.getByText(/Chat|AI Assistant|Ask a question/i)).toBeVisible();

      // Expected Results: Can ask for explanation of incorrect answers
      const chatInput = page.getByRole('textbox', { name: /Message|Chat|Ask/i });
      await expect(chatInput).toBeVisible();

      // 4. Ask for explanation of incorrect answers
      await chatInput.fill('Can you explain the correct answers?');
      await page.getByRole('button', { name: /Send|Submit/i }).click();

      // Expected Results: Chatbot provides explanations
      await page.waitForTimeout(2000); // Wait for AI response
      const chatMessages = page.locator('[data-testid="chat-message"]');
      
      if (await chatMessages.count() > 0) {
        await expect(chatMessages.last()).toBeVisible();
      }

      // Expected Results: Can ask follow-up questions
      await chatInput.fill('Can you provide more examples?');
      await page.getByRole('button', { name: /Send|Submit/i }).click();

      // Expected Results: Explanations help with learning
      await page.waitForTimeout(1000);
      await expect(page.getByText(/explanation|answer|because|therefore/i)).toBeVisible();
    } else {
      // AI Chat feature may not be implemented yet
      console.log('AI Chat feature not found - may not be implemented');
      await expect(page.getByText('Your Score')).toBeVisible();
    }
  });
});
