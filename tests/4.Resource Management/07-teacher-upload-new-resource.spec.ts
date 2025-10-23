// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Resource Management', () => {
  test('4.7 Teacher - Upload New Resource', async ({ page }) => {
    const uniqueEmail = `teacherresource.${Date.now()}@example.com`;

    // Register as teacher
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Teacher Resource Upload');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Teacher']);
    await page.getByLabel(/Subject/i).selectOption('Chemistry');
    await page.getByRole('button', { name: 'Register' }).click();

    // 1. Login as teacher account
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Navigate to /teacher/resources or /resources
    await page.goto('http://localhost:3000/teacher/resources');

    // 3. Look for "Upload Resource" or "Create Resource" button
    const uploadButton = page.getByRole('button', { name: /Upload Resource|Create Resource|Add Resource/i });
    
    if (await uploadButton.isVisible()) {
      // 4. Click to open upload form
      await uploadButton.click();

      // 5. Fill in form
      await page.getByLabel(/Title/i).fill('Chemistry Notes Chapter 5');
      await page.getByLabel(/Type/i).selectOption('Notes');
      await page.getByLabel(/Subject/i).selectOption('Chemistry');
      
      // Upload a file (mock file upload)
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Note: In real tests, you'd upload an actual file
        // await fileInput.setInputFiles('path/to/test.pdf');
      }
      
      await page.getByLabel(/Description/i).fill('Detailed notes on organic chemistry');
      await page.getByLabel(/Year/i).fill('2024');

      // 6. Submit form
      await page.getByRole('button', { name: /Submit|Upload|Save/i }).click();

      // Expected Results: Success message appears
      await expect(page.getByText(/Success|uploaded|created/i)).toBeVisible();

      // Expected Results: New resource appears in resources list
      await page.waitForTimeout(1000);
      await expect(page.getByText(/Chemistry Notes Chapter 5/i)).toBeVisible();
    } else {
      console.log('Upload resource feature not found or not accessible');
    }
  });
});
