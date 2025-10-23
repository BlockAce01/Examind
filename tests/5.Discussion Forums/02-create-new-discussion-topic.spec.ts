// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, DiscussionsPage } from '../pages';

test.describe('Discussion Forums', () => {
  test('5.2 Create New Discussion Topic', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const discussionsPage = new DiscussionsPage(page);

    // Setup: Create and login as student
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      'Test Student',
      uniqueEmail,
      'SecurePass123!',
      ['Combined Mathematics', 'Physics', 'Chemistry']
    );

    // Wait for redirect to login page and then login
    await page.waitForURL('**/login');
    const loginPage = new LoginPage(page);
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    await loginPage.verifyLoginSuccess();

    // 1. Navigate to /discussions
    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();

    // 2. Click "+ Create New Topic" button
    await discussionsPage.clickCreateTopic();

    // 3. Fill in form
    const uniqueTopic = `How to solve quadratic equations? ${Date.now()}`;
    await discussionsPage.createDiscussion(
      uniqueTopic,
      'Combined Mathematics',
      "I'm having trouble understanding the concept of complex roots."
    );

    // 4. Submit form
    // Expected Results:
    // - Discussion creation form submitted successfully
    // - User may stay on discussions page or be redirected to new discussion page
    // - Topic appears in forum listing
    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();
    await discussionsPage.verifyDiscussionCreated(uniqueTopic);
  });
});
