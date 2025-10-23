// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.8 SQL Injection Attempt', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLogin();
    
    // Attempt SQL injection
    await loginPage.emailInput.fill("admin' OR '1'='1");
    await loginPage.passwordInput.fill("anything");
    await loginPage.loginButton.click();
    
    await page.waitForTimeout(1000);
    
    // Expected Results: Login fails, no unauthorized access
    const loginFailed = await page.getByText(/Invalid|Incorrect|Login failed/i).count() > 0 || 
                        await page.url().includes('login');
    
    expect(loginFailed).toBe(true);
    
    // Should not be redirected to dashboard
    expect(page.url()).not.toMatch(/dashboard/);
  });
});
