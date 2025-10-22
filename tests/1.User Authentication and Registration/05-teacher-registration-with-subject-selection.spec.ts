// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.5 Teacher Registration - With Subject Selection', async ({ page }) => {
    // Generate unique email for this test run
    const uniqueEmail = `prof.smith.${Date.now()}@example.com`;

    // 1. Navigate to registration page
    await page.goto('http://localhost:3000/register');

    // 2. Fill in "Full Name" with "Professor Smith"
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Professor Smith');

    // 3. Fill in "Email Address" with unique email
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);

    // 4. Fill in "Password" with "TeacherPass123!"
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('TeacherPass123!');

    // 5. Fill in "Confirm Password" with "TeacherPass123!"
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('TeacherPass123!');

    // 6. Select "Teacher" from "Register As" dropdown
    await page.getByLabel('Register As').selectOption(['Teacher']);

    // 7. Select "Physics" from "Subject" dropdown (only one subject selection allowed)
    await page.getByLabel('Subject').selectOption(['Physics']);

    // 8. Click "Register" button
    await page.getByRole('button', { name: 'Register' }).click();

    // Expected Results: Registration succeeds and success message appears
    await expect(page.getByText('Registration successful')).toBeVisible();
    
    // Verify form fields are cleared
    await expect(page.getByRole('textbox', { name: 'Full Name' })).toHaveValue('');
    
    // Close browser
    await page.close();
  });
});
