// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, DiscussionsPage } from '../pages';

test.describe('Discussion Forums', () => {
  test.fixme('5.8 Admin/Teacher - Delete Discussion - Delete functionality not implemented for teachers in UI', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    const discussionsPage = new DiscussionsPage(page);

    // Setup: Login as teacher
    const teacherEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher(
      'Test Teacher',
      teacherEmail,
      'SecurePass123!',
      'Physics'
    );

    await discussionsPage.navigateToDiscussions();
    await discussionsPage.clickCreateTopic();
    await discussionsPage.createDiscussion(
      'Discussion to Delete',
      'Physics',
      'This discussion will be deleted'
    );

    // 1. Login as admin or teacher
    // 2. Navigate to discussions list
    await discussionsPage.navigateToDiscussions();

    // 3. Click "Delete" button
    discussionsPage.confirmDeletion();
    await discussionsPage.deleteDiscussion('Discussion to Delete');

    // 4. Confirm deletion
    // Expected Results:
    // - Forum removed from listing
    await page.waitForTimeout(1000);
    await discussionsPage.verifyDiscussionDeleted('Discussion to Delete');
  });
});
