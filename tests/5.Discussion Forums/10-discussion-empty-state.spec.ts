// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, DiscussionsPage } from '../pages';

test.describe('Discussion Forums', () => {
  test.fixme('5.10 Discussion - Empty State - Subject filtering not implemented, cannot test empty state after filtering', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    const discussionsPage = new DiscussionsPage(page);

    // Setup: Login as new student (no discussions yet)
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      'Test Student',
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );

    // 1. Navigate to /discussions when no forums exist OR
    await discussionsPage.navigateToDiscussions();

    // Create one discussion then filter to get no results
    await discussionsPage.clickCreateTopic();
    await discussionsPage.createDiscussion(
      'Physics Discussion',
      'Physics',
      'About physics'
    );

    await discussionsPage.navigateToDiscussions();

    // 2. Apply filters that return no results
    await discussionsPage.filterBySubject('Chemistry');

    // Expected Results:
    // - Message displayed: "No discussions found" or similar
    await discussionsPage.verifyEmptyState();

    // - Prompt to create new topic
    await discussionsPage.verifyCreateTopicButton();
  });
});
