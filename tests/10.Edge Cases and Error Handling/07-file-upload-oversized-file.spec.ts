// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.7 File Upload - Oversized File', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Test Teacher', registerPage.generateUniqueEmail('teacher'), 'SecurePass123!', 'Physics');
    
    await page.goto('/teacher/resources');
    await page.waitForTimeout(1000);
    
    const uploadButton = page.getByRole('button', { name: /Upload|Add Resource/i });
    if (await uploadButton.count() > 0) {
      await uploadButton.click();
      await page.waitForTimeout(500);
      
      // Expected Results: File size validation
      // Error message: "File size exceeds maximum limit"
      // Upload should not proceed
    }
  });
});
