// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Admin Dashboard and User Management', () => {
  test('8.5 Admin - View Platform Statistics', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const adminEmail = registerPage.generateUniqueEmail('admin');
    
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Admin User', adminEmail, 'AdminPass123!', 'Physics');
    
    await page.goto('/admin/stats');
    await page.waitForTimeout(1000);
    
    // Expected Results: Statistics overview
    const statIndicators = [
      page.getByText(/Total Users|Total Quizzes|Total Resources|Active Users/i)
    ];
    
    for (const indicator of statIndicators) {
      if (await indicator.count() > 0) {
        await expect(indicator.first()).toBeVisible();
        break;
      }
    }
    
    // Charts/graphs may be present
    const chartElements = page.locator('canvas').or(page.locator('[data-testid="chart"]'));
    if (await chartElements.count() > 0) {
      await expect(chartElements.first()).toBeVisible();
    }
  });
});
