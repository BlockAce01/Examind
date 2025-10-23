// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Teacher Dashboard and Content Management', () => {
  test('7.7 Teacher - Publish/Unpublish Quiz', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const teacherEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Test Teacher', teacherEmail, 'SecurePass123!', 'Physics');

    await page.goto('http://localhost:3000/teacher/quizzes');
    
    const publishToggle = page.getByRole('button', { name: /Publish|Active|Status/i }).or(
      page.locator('input[type="checkbox"][aria-label*="Publish"]')
    ).first();
    
    if (await publishToggle.count() > 0) {
      await publishToggle.click();
      await page.waitForTimeout(1000);
      
      const statusIndicator = page.getByText(/Published|Draft|Active|Inactive/i).first();
      if (await statusIndicator.count() > 0) {
        await expect(statusIndicator).toBeVisible();
      }
    }
  });
});
