// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.1 Student Registration - Valid Data', async ({ page }) => {
    // Generate unique email for this test run
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;

    // 1. Navigate to http://localhost:3000
    await page.goto('http://localhost:3000');

    // 3. Click "Register here" link
    await page.getByRole('link', { name: 'Register', exact: true }).click();

    // 4. Fill in "Full Name" field with "John Doe"
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');

    // 5. Fill in "Email Address" field with unique email
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);

    // 6. Fill in "Password" field with "SecurePass123!"
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');

    // 7. Fill in "Confirm Password" field with "SecurePass123!"
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');

    // 8. Select "Student" from "Register As" dropdown
    await page.getByLabel('Register As').selectOption(['Student']);

    // 9. Select "Combined Mathematics" from "Subject 1" dropdown
    await page.getByLabel('Subject').selectOption(['Combined Mathematics']);

    // 10. Select "Physics" from "Subject 2" dropdown
    await page.getByLabel('Subject 2').selectOption(['Physics']);

    // 11. Select "Chemistry" from "Subject 3" dropdown
    await page.getByLabel('Subject 3').selectOption(['Chemistry']);

    // 12. Click "Register" button
    await page.getByRole('button', { name: 'Register' }).click();

    // Expected Results: Success message appears and form is cleared
    await expect(page.getByText('Registration successful! You can now log in.')).toBeVisible();
    
    // Verify form fields are cleared
    await expect(page.getByRole('textbox', { name: 'Full Name' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Email Address' })).toHaveValue('');
    
    // Close browser
    await page.close();
  });
});
