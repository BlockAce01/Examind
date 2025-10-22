// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.3 Student Registration - Password Mismatch', async ({ page }) => {
    // 1. Navigate to registration page
    await page.goto('http://localhost:3000/register');

    // 2. Fill in "Full Name" with "Test User"
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Test User');

    // 3. Fill in "Email Address" with "test@example.com"
    await page.getByRole('textbox', { name: 'Email Address' }).fill('test@example.com');

    // 4. Fill in "Password" with "Password123!"
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Password123!');

    // 5. Fill in "Confirm Password" with "DifferentPass123!"
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('DifferentPass123!');

    // 6. Select "Student" from role dropdown
    await page.getByLabel('Register As').selectOption(['Student']);

    // 7. Click "Register" button
    await page.getByRole('button', { name: 'Register' }).click();

    // Expected Results: Validation error appears: "Passwords must match"
    await expect(page.getByText('Passwords must match')).toBeVisible();
    
    // Verify form is not submitted - still on registration page
    await expect(page).toHaveURL(/.*register/);
    
    // Close browser
    await page.close();
  });
});
