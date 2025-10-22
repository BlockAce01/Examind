// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.2 Student Registration - Missing Required Fields', async ({ page }) => {
    // 1. Navigate to registration page (http://localhost:3000/register)
    await page.goto('http://localhost:3000/register');

    // 2. Fill in only "Full Name" with "Jane Smith"
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Jane Smith');

    // 3. Fill in only "Email Address" with "jane@example.com"
    await page.getByRole('textbox', { name: 'Email Address' }).fill('jane@example.com');

    // 4. Leave Password fields empty (no action needed)

    // 5. Click "Register" button
    await page.getByRole('button', { name: 'Register' }).click();

    // Expected Results: Form validation prevents submission and user remains on registration page
    await expect(page.getByText('Create Your Account')).toBeVisible();
    
    // Verify still on registration page
    await expect(page).toHaveURL(/.*register/);
    
    // Verify entered data is retained
    await expect(page.getByRole('textbox', { name: 'Full Name' })).toHaveValue('Jane Smith');
    await expect(page.getByRole('textbox', { name: 'Email Address' })).toHaveValue('jane@example.com');
    
    // Close browser
    await page.close();
  });
});
