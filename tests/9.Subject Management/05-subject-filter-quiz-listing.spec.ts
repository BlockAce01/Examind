// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, QuizzesPage, LoginPage } from '../pages';

test.describe('Subject Management', () => {
  test('9.5 Subject Filter - Quiz Listing', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const quizzesPage = new QuizzesPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', uniqueEmail, 'SecurePass123!', ['Chemistry', 'Physics', 'Biology']);
    
    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    // Wait for successful login redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    await quizzesPage.navigateToQuizzes();
    
    // Subject filter dropdown displays all subjects with available quizzes
    await expect(quizzesPage.subjectFilter).toBeVisible();
    
    // Select "Chemistry"
    await quizzesPage.filterBySubject('Chemistry');
    await page.waitForTimeout(500);
    
    // Expected Results: Only Chemistry quizzes displayed
    await quizzesPage.verifyQuizFiltered('Chemistry');
  });
});
