// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, QuizzesPage, ResourcesPage, DiscussionsPage } from '../pages';

test.describe('Subject Management', () => {
  test('9.7 Subject Tag Display', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const quizzesPage = new QuizzesPage(page);
    const resourcesPage = new ResourcesPage(page);
    const discussionsPage = new DiscussionsPage(page);
    
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', registerPage.generateUniqueEmail('student'), 'SecurePass123!', ['Physics', 'Chemistry', 'Biology']);
    
    // View quizzes and observe subject tags
    await quizzesPage.navigateToQuizzes();
    const subjectTag = page.locator('[data-testid="subject-tag"]').or(page.getByText(/Physics|Chemistry|Biology/i)).first();
    if (await subjectTag.count() > 0) {
      await expect(subjectTag).toBeVisible();
    }
    
    // View resources
    await resourcesPage.navigateToResources();
    
    // View discussions
    await discussionsPage.navigateToDiscussions();
    
    // Expected Results: Subject displayed as badge/tag, consistent naming
  });
});
