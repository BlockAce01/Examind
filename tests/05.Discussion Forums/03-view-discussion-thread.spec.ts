// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, DiscussionsPage } from '../pages';

test.describe('Discussion Forums', () => {
  test('5.3 View Discussion Thread', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const discussionsPage = new DiscussionsPage(page);

    // Setup: Create and login as student
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      'Test Student',
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // Wait for redirect to login page and then login
    await page.waitForURL('**/login');
    const loginPage = new LoginPage(page);
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    await loginPage.verifyLoginSuccess();

    // Create a discussion for testing
    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();
    await discussionsPage.clickCreateTopic();
    const uniqueTopic = `Test discussion ${Date.now()}`;
    await discussionsPage.createDiscussion(
      uniqueTopic,
      'Physics',
      'I need help understanding projectile motion.'
    );

    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();

    // 1. Navigate to /discussions
    // 2. Click on an existing discussion topic
    await discussionsPage.clickDiscussion(uniqueTopic);

    // 3. View discussion detail page
    // Expected Results:
    // - Redirect to /discussions/[forumId]
    await expect(page).toHaveURL(/\/discussions\/\d+/);

    // - "Back to All Forums" link at top
    await discussionsPage.verifyBackToForums();

    // - Discussion title displayed prominently
    await discussionsPage.verifyDiscussionDetail(uniqueTopic);

    // - Comment section below with "Add your contribution:" text area
    await discussionsPage.verifyCommentTextarea();

    // - "Post Reply" button
    await discussionsPage.verifyPostReplyButton();
  });
});
