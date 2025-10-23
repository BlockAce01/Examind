// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, DiscussionsPage } from '../pages';

test.describe('Discussion Forums', () => {
  test.fixme('5.9 Discussion - Search/Filter by Subject - Subject filtering not implemented in UI', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    const discussionsPage = new DiscussionsPage(page);

    // Setup: Login as student and create discussions in different subjects
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
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    await page.waitForURL('**/dashboard');

    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();
    
    // Create Physics discussion
    await discussionsPage.clickCreateTopic();
    await discussionsPage.createDiscussion(
      'Physics Discussion',
      'Physics',
      'About Newton laws'
    );

    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();
    
    // Create Chemistry discussion
    await discussionsPage.clickCreateTopic();
    await discussionsPage.createDiscussion(
      'Chemistry Discussion',
      'Chemistry',
      'About periodic table'
    );

    // 1. Navigate to /discussions
    await discussionsPage.navigateToDiscussions();
    await discussionsPage.waitForDiscussionsLoaded();

    // 2. Look for subject filter (if available)
    // 3. Select "Physics"
    await discussionsPage.filterBySubject('Physics');

    // Expected Results:
    // - Only Physics discussions shown
    await expect(page.getByText('Physics Discussion')).toBeVisible();
    // Chemistry discussion should be hidden
    const chemistryVisible = await page.getByText('Chemistry Discussion').isVisible().catch(() => false);
    expect(chemistryVisible).toBe(false);
  });
});
