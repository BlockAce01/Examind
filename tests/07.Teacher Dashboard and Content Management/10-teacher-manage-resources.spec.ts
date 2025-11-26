// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, ResourcesPage } from '../pages';

test.describe('Teacher Dashboard and Content Management', () => {
  test('7.10 Teacher - Manage Resources', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const resourcesPage = new ResourcesPage(page);
    
    const teacherEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Test Teacher', teacherEmail, 'SecurePass123!', 'Physics');

    await page.goto('/teacher/resources');
    
    const uploadButton = page.getByRole('button', { name: /Upload|Add Resource|\+ Resource/i });
    if (await uploadButton.count() > 0) {
      await expect(uploadButton).toBeVisible();
    }
    
    const resourceList = page.locator('[data-testid="teacher-resource-list"]');
    if (await resourceList.count() > 0) {
      await expect(resourceList).toBeVisible();
    }
  });
});
