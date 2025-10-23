// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage } from '../pages';

test.describe('Subject Management', () => {
  test('9.3 Teacher - Subject Selection During Registration', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    
    // Expected Results: Teacher can select exactly one subject
    const uniqueEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.registerTeacher(
      'Test Teacher',
      uniqueEmail,
      'SecurePass123!',
      'Physics'
    );
    
    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    // Wait for successful login redirect to teacher dashboard
    await page.waitForURL('**/teacher');
    
    // Expected Results: TeacherSubject record created for the selected subject
  });
});
