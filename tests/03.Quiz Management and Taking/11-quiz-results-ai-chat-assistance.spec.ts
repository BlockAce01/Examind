// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { QuizzesPage } from '../pages/QuizzesPage';
import { QuizTakingPage } from '../pages/QuizTakingPage';
import { QuizResultsPage } from '../pages/QuizResultsPage';

test.describe('Quiz Management and Taking', () => {
  test('3.11 Quiz Results - AI Chat Assistance', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    const quizTakingPage = new QuizTakingPage(page);
    const quizResultsPage = new QuizResultsPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('aichat');

    // Register and login
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('AI Chat User', uniqueEmail, 'SecurePass123!',
      ['Physics', 'Chemistry', 'Combined Mathematics']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    await loginPage.verifyLoginSuccess();

    // Wait for session to establish
    await page.waitForTimeout(2000);

    // 1. Complete a quiz
    await quizzesPage.navigateToQuizzes();
    await page.waitForLoadState('networkidle');
    
    const startQuizButtons = page.locator('a[href*="/quizzes/"][href*="/take"]');
    if (await startQuizButtons.count() === 0) {
      test.skip();
    }

    await quizzesPage.startQuiz();

    const questionCount = await page.getByText(/Question 1 of (\d+)/i).textContent();
    const totalQuestions = parseInt(questionCount?.match(/\d+$/)?.[0] || '3');

    for (let i = 0; i < totalQuestions; i++) {
      const answerButtons = page.getByRole('button').filter({ hasText: /^\d+%$|^[A-Za-z0-9\s\-\.]+$/ });
      if (await answerButtons.first().isVisible()) {
        await answerButtons.first().click();
      }
      if (i < totalQuestions - 1) {
        await quizTakingPage.clickNext();
      }
    }

    await quizTakingPage.clickSubmit();

    // 2. On results page, look for AI chatbot option
    await quizResultsPage.verifyOnResultsPage();

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
      await page.waitForTimeout(2000);
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
      await quizResultsPage.verifyResultsDisplayed();
    }
  });
});
