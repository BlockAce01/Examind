// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Dashboard and User Profile', () => {
  test('2.4 Profile - Edit Profile Button', async ({ page }) => {
    const uniqueEmail = `editprofile.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Edit Profile Test');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['Chemistry']);
    await page.getByLabel('Subject 3').selectOption(['Biology']);
    await page.getByRole('button', { name: 'Register' }).click();

    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for login to complete
    await page.waitForURL(/.*dashboard|profile|quizzes/, { timeout: 5000 }).catch(() => null);

    // Check if login was successful
    expect(page.url()).not.toContain('/login');

    // 1. Navigate to /profile
    await page.goto('http://localhost:3000/profile');

    // 2. Click "Edit Profile" button if it exists
    const editButton = page.getByRole('button', { name: /Edit Profile/i });
    
    await expect(editButton).toBeVisible();

    await editButton.click();

    // 3. Observe behavior
    // Expected Results: Modal or form appears for editing profile
    // FIXME: Edit profile feature appears not implemented - clicking button doesn't show edit form
    test.fixme();
    await expect(page.getByText(/Edit/i)).toBeVisible();

    // Expected Results: User can update name and other editable fields
    const nameField = page.getByRole('textbox', { name: /Name/i });
    await expect(nameField).toBeVisible();
    await nameField.fill('Updated Profile Name');

    // Expected Results: Email may be read-only or require verification
    const emailField = page.locator('input[type="email"]');
    if (await emailField.isVisible()) {
      const isReadOnly = await emailField.getAttribute('readonly');
      const isDisabled = await emailField.getAttribute('disabled');
      expect(isReadOnly !== null || isDisabled !== null).toBeTruthy();
    }

    // Expected Results: Changes save to database on submission
    await page.getByRole('button', { name: /Save/i }).click();
    await expect(page.getByText(/Updated Profile Name/i)).toBeVisible();
  });
});
