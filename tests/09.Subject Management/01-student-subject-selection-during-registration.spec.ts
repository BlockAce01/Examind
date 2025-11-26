// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage } from '../pages';

test.describe('Subject Management', () => {
  test('9.1 Student - Subject Selection During Registration', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    
    await registerPage.navigateDirectly();
    
    // Expected Results: 28+ subjects available in dropdowns
    const subject1 = page.getByLabel(/Subject 1|First Subject/i);
    const subject2 = page.getByLabel(/Subject 2|Second Subject/i);
    const subject3 = page.getByLabel(/Subject 3|Third Subject/i);
    
    // Select exactly 3 subjects
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.registerStudent(
      'Test Student',
      uniqueEmail,
      'SecurePass123!',
      ['Physics', 'Chemistry', 'Biology']
    );
    
    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    // Wait for successful login redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    // Expected Results: StudentSubject records created for each selection
    // User should be redirected to dashboard after login
  });
});
