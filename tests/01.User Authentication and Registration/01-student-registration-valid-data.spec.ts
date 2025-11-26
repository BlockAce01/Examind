// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('User Authentication and Registration', () => {
  test('1.1 Student Registration - Valid Data', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Generate unique email for this test run
    const uniqueEmail = registerPage.generateUniqueEmail('john.doe');

    // 1. Navigate to http://localhost:3000 and click "Register here" link
    await registerPage.navigateToRegister();

    // 4-12. Fill registration form and submit
    await registerPage.registerStudent(
      'John Doe',
      uniqueEmail,
      'SecurePass123!',
      ['Combined Mathematics', 'Physics', 'Chemistry']
    );

    // Expected Results: Success message appears and form is cleared
    await registerPage.verifySuccessMessage();
    await registerPage.verifyFormCleared();
    
    // Close browser
    await page.close();
  });
});
