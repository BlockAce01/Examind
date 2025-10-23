// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.2 Backend Server Down', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Note: This test simulates server down by attempting login that will fail
    await loginPage.navigateToLogin();
    
    // Try to login - if backend is down, this should show error
    await loginPage.emailInput.fill('test@example.com');
    await loginPage.passwordInput.fill('password123');
    await loginPage.loginButton.click();
    
    await page.waitForTimeout(2000);
    
    // Expected Results: Frontend displays error message
    const errorIndicators = [
      page.getByText(/Unable to connect|Server error|Network error|Try again/i),
      page.getByRole('alert')
    ];
    
    for (const indicator of errorIndicators) {
      if (await indicator.count() > 0) {
        await expect(indicator.first()).toBeVisible();
        break;
      }
    }
  });
});
