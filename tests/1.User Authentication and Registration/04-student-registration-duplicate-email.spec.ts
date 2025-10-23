// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('User Authentication and Registration', () => {
  test('1.4 Student Registration - Duplicate Email', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // 1. Register a user with email "duplicate@example.com"
    await registerPage.navigateDirectly();
    await registerPage.registerStudent(
      'First User',
      'duplicate@example.com',
      'Password123!',
      ['Biology', 'Chemistry', 'Physics']
    );

    // 2. Logout and return to registration page (navigate directly to register)
    await registerPage.navigateDirectly();

    // 3. Attempt to register another user with the same email "duplicate@example.com"
    await registerPage.fillFullName('Second User');
    await registerPage.fillEmail('duplicate@example.com');
    await registerPage.fillPassword('DifferentPass123!');
    await registerPage.fillConfirmPassword('DifferentPass123!');
    await registerPage.selectRole('Student');
    
    // 4. Fill in all other required fields
    await registerPage.selectStudentSubjects('ICT', 'Economics', 'Accounting');

    // 5. Click "Register" button
    await registerPage.clickRegister();

    // Expected Results: Error message appears: "Email already in use"
    await registerPage.verifyErrorMessage('Email already in use');
    
    // Verify registration fails - user remains on registration page
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('heading', { name: 'Create Your Account' })).toBeVisible();
    
    // Close browser
    await page.close();
  });
});
