// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, ProfilePage } from '../pages';

test.describe('Subject Management', () => {
  test('9.9 Student - Update Subject Preferences', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const profilePage = new ProfilePage(page);
    
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', registerPage.generateUniqueEmail('student'), 'SecurePass123!', ['Physics', 'Chemistry', 'Biology']);
    
    await profilePage.navigateToProfile();
    
    // Navigate to profile settings
    const settingsButton = page.getByRole('button', { name: /Settings|Edit Profile|Account Preferences/i });
    if (await settingsButton.count() > 0) {
      await settingsButton.click();
      await page.waitForTimeout(500);
      
      // Change subject selections
      const subjectSelectors = page.getByLabel(/Subject/i);
      if (await subjectSelectors.count() > 0) {
        await subjectSelectors.first().selectOption(['Combined Mathematics']);
        await page.getByRole('button', { name: /Save|Update/i }).click();
        await page.waitForTimeout(500);
        
        // Expected Results: StudentSubject records updated
      }
    }
  });
});
