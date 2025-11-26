// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('User Authentication and Registration', () => {
  test('1.3 Student Registration - Password Mismatch', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // 1. Navigate to registration page
    await registerPage.navigateDirectly();

    // 2-6. Fill in form with mismatched passwords
    await registerPage.fillFullName('Test User');
    await registerPage.fillEmail('test@example.com');
    await registerPage.fillPassword('Password123!');
    await registerPage.fillConfirmPassword('DifferentPass123!');
    await registerPage.selectRole('Student');

    // 7. Click "Register" button
    await registerPage.clickRegister();

    // Expected Results: Validation error appears: "Passwords must match"
    await registerPage.verifyValidationError('Passwords must match');
    
    // Verify form is not submitted - still on registration page
    await expect(page).toHaveURL(/.*register/);
    
    // Close browser
    await page.close();
  });
});
