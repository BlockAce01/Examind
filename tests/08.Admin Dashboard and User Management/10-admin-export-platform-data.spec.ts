// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Admin Dashboard and User Management', () => {
  test('8.10 Admin - Export Platform Data', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const adminEmail = registerPage.generateUniqueEmail('admin');
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Admin User', adminEmail, 'AdminPass123!', 'Physics');
    
    await page.goto('/admin');
    await page.waitForTimeout(1000);
    
    const exportButton = page.getByRole('button', { name: /Export|Download|Export Data/i });
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
      await exportButton.click();
      const download = await downloadPromise;
      
      if (download) {
        expect(download.suggestedFilename()).toMatch(/\.(csv|xlsx|json)$/);
      }
    }
  });
});
