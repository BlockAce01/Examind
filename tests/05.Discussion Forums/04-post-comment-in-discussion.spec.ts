// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, DiscussionsPage } from '../pages';

test.describe('Discussion Forums', () => {
  test('5.4 Post Comment in Discussion', async ({ page }) => {
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
    const uniqueTopic = `Projectile Motion Question ${Date.now()}`;
    await discussionsPage.createDiscussion(
      uniqueTopic,
      'Physics',
      'What is the formula for maximum height?'
    );

    // Navigate to the discussion detail page
    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();
    await discussionsPage.clickDiscussion(uniqueTopic);

    // 1. Navigate to discussion detail page
    // Now on the discussion detail page

    // 2. Click in "Add your contribution:" text area
    await discussionsPage.commentTextarea.click();

    // 3. Type comment
    const commentText = 'The maximum height is calculated using h = (v² sin²θ) / (2g)';
    await discussionsPage.commentTextarea.fill(commentText);

    // Verify "Post Reply" button enables when text is entered
    await discussionsPage.verifyPostReplyEnabled();

    // 4. Click "Post Reply" button
    await discussionsPage.postReplyButton.click();

    // Expected Results:
    // - Comment appears immediately in comment list
    await discussionsPage.verifyCommentPosted(commentText);

    // - Text area cleared for next comment
    await expect(discussionsPage.commentTextarea).toHaveValue('');
  });
});
