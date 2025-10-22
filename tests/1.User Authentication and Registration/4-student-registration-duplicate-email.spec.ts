// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Registration', () => {
  test('1.4 Student Registration - Duplicate Email', async ({ page }) => {
    // 1. Register a user with email "duplicate@example.com"
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('First User');
    await page.getByRole('textbox', { name: 'Email Address' }).fill('duplicate@example.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Password123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Biology']);
    await page.getByLabel('Subject 2').selectOption(['Chemistry']);
    await page.getByLabel('Subject 3').selectOption(['Physics']);
    await page.getByRole('button', { name: 'Register' }).click();

    // 2. Logout and return to registration page (navigate directly to register)
    await page.goto('http://localhost:3000/register');

    // 3. Attempt to register another user with the same email "duplicate@example.com"
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Second User');
    await page.getByRole('textbox', { name: 'Email Address' }).fill('duplicate@example.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('DifferentPass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('DifferentPass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    
    // 4. Fill in all other required fields
    await page.getByLabel('Subject').selectOption(['ICT']);
    await page.getByLabel('Subject 2').selectOption(['Economics']);
    await page.getByLabel('Subject 3').selectOption(['Accounting']);

    // 5. Click "Register" button
    await page.getByRole('button', { name: 'Register' }).click();

    // Expected Results: Error message appears: "Email already in use"
    await expect(page.getByText('Email already in use')).toBeVisible();
    
    // Verify registration fails - user remains on registration page
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('heading', { name: 'Create Your Account' })).toBeVisible();
    
    // Close browser
    await page.close();
  });
});
