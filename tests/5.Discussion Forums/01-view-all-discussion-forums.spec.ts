// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, DiscussionsPage } from '../pages';

test.describe('Discussion Forums', () => {
  test('5.1 View All Discussion Forums', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const discussionsPage = new DiscussionsPage(page);

    // Setup: Create a student account and login
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

    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();
    await discussionsPage.clickCreateTopic();
    await discussionsPage.createDiscussion(
      'Understanding Newton\'s Laws',
      'Physics',
      'Can someone explain the difference between the three laws?'
    );

    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();
    await discussionsPage.clickCreateTopic();
    await discussionsPage.createDiscussion(
      'Organic Chemistry Reactions',
      'Chemistry',
      'Help with understanding reaction mechanisms.'
    );

    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();
    await discussionsPage.clickCreateTopic();
    await discussionsPage.createDiscussion(
      'Cell Biology Fundamentals',
      'Biology',
      'Questions about cellular respiration.'
    );

    // 1. Navigate to /discussions
    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();

    // 2. Observe forum listing
    await discussionsPage.verifyOnDiscussionsPage();

    // Expected Results:
    // - Page title: "Discussion Forums"
    await expect(discussionsPage.pageTitle).toBeVisible();

    // - "+ Create New Topic" button visible in top right
    await discussionsPage.verifyCreateTopicButton();

    // - Forum list displays each discussion with:
    //   - Forum title (clickable)
    const discussionCount = await discussionsPage.getDiscussionCount();
    expect(discussionCount).toBeGreaterThanOrEqual(3); // We created 3 discussions

    // Verify each discussion has the required elements
    const discussionItems = page.locator('main a[href*="/discussions/"]');
    const count = await discussionItems.count();

    for (let i = 0; i < count; i++) {
      const item = discussionItems.nth(i);

      // Forum title (clickable)
      const title = item.locator('h3').first();
      await expect(title).toBeVisible();
      await expect(title).toHaveClass(/text-blue-700/); // Should be styled as link

      // Creator name
      await expect(item.locator('text=/Created by/')).toBeVisible();

      // Description/excerpt
      const description = item.locator('p').nth(1); // Second paragraph should be description
      await expect(description).toBeVisible();

      // Subject tag
      const subjectTag = item.locator('[class*="bg-blue-100"]').first();
      await expect(subjectTag).toBeVisible();

      // Post count
      await expect(item.locator('text=/Posts/')).toBeVisible();

      // Last activity timestamp
      await expect(item.locator('text=/Last activity/')).toBeVisible();
    }

    // - Forums sorted by last activity (most recent first)
    // Verify that the most recently created discussion appears first
    const firstDiscussionTitle = await discussionItems.nth(0).locator('h3').textContent();
    expect(firstDiscussionTitle).toBe('Cell Biology Fundamentals'); // Most recent we created

    const secondDiscussionTitle = await discussionItems.nth(1).locator('h3').textContent();
    expect(secondDiscussionTitle).toBe('Organic Chemistry Reactions');

    const thirdDiscussionTitle = await discussionItems.nth(2).locator('h3').textContent();
    expect(thirdDiscussionTitle).toBe('Understanding Newton\'s Laws');
  });
});
