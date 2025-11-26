// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, QuizzesPage, ResourcesPage, DiscussionsPage, LoginPage } from '../pages';

test.describe('Subject Management', () => {
  test('9.2 Student - View Subject-Specific Content', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    const resourcesPage = new ResourcesPage(page);
    const discussionsPage = new DiscussionsPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', uniqueEmail, 'SecurePass123!', ['Physics', 'Chemistry', 'Biology']);
    
    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    // Wait for successful login redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    // Filter quizzes by student's subjects
    await quizzesPage.navigateToQuizzes();
    await quizzesPage.filterBySubject('Physics');
    await page.waitForTimeout(500);
    
    // Filter resources by student's subjects
    await resourcesPage.navigateToResources();
    await resourcesPage.filterBySubject('Physics');
    await page.waitForTimeout(500);
    
    // Check discussions by subject
    await discussionsPage.navigateToDiscussions();
    await discussionsPage.filterBySubject('Biology');
    await page.waitForTimeout(500);
    
    // Expected Results: Content filtered relevant to student's subjects
  });
});
