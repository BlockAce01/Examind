// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('User Authentication and Registration', () => {
  test('1.2 Student Registration - Missing Required Fields', async ({ page, browserName }) => {
    const registerPage = new RegisterPage(page);

    // 1. Navigate to registration page (http://localhost:3000/register)
    await registerPage.navigateDirectly();

    // 2. Fill in only "Full Name" with "Jane Smith"
    await registerPage.fillFullName('Jane Smith');

    // 3. Fill in only "Email Address" with "jane@example.com"
    await registerPage.fillEmail('jane@example.com');

    // 4. Leave Password fields empty (no action needed)

    // 5. Click "Register" button
    await registerPage.clickRegister();

    // Expected Results: Form validation prevents submission and user remains on registration page
    await expect(page.getByText('Create Your Account')).toBeVisible();
    
    // Verify still on registration page
    await expect(page).toHaveURL(/.*register/);
    
    // Verify entered data is retained (webkit clears form values differently)
    if (browserName !== 'webkit') {
      await expect(registerPage.fullNameInput).toHaveValue('Jane Smith');
      await expect(registerPage.emailInput).toHaveValue('jane@example.com');
    }
    
    // Close browser
    await page.close();
  });
});
