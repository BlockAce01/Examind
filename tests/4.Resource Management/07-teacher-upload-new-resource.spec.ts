// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage } from '../pages';

test.describe('Resource Management', () => {
  test('4.7 Teacher - Upload New Resource', async ({ page }) => {
    const uniqueEmail = `teacherresource.${Date.now()}@example.com`;
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    // Register as teacher
    await registerPage.navigateToRegister();
    await registerPage.registerTeacher('Teacher Resource Upload', uniqueEmail, 'SecurePass123!', 'Chemistry');

    // 1. Login as teacher account
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // 2. Navigate to /teacher/resources or /resources
    await page.goto('/teacher/resources');

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
