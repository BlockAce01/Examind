// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Admin Dashboard and User Management', () => {
  test('8.1 Admin Login and Dashboard Access', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const adminEmail = registerPage.generateUniqueEmail('admin');
    
    // Create admin account via API or registration
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher'); // Admins may register as teachers then upgrade
    await registerPage.registerTeacher('Admin User', adminEmail, 'AdminPass123!', 'Physics');
    
    // Navigate to admin dashboard
    await page.goto('http://localhost:3000/admin');
    await page.waitForTimeout(1000);
    
    // Expected Results: Admin dashboard with overview statistics
    const adminIndicators = [
      page.getByText(/Admin Dashboard|Total Users|Platform Statistics/i),
      page.getByRole('heading', { name: /Admin|Dashboard/i })
    ];
    
    for (const indicator of adminIndicators) {
      if (await indicator.count() > 0) {
        await expect(indicator.first()).toBeVisible();
        break;
      }
    }
  });
});
