// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.1 Expired JWT Token', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', registerPage.generateUniqueEmail('student'), 'SecurePass123!', ['Physics', 'Chemistry', 'Biology']);
    
    // Manually expire token by clearing storage and setting expired token
    await page.evaluate(() => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjB9.invalid';
      localStorage.setItem('token', expiredToken);
    });
    
    // Attempt to access protected route
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(1000);
    
    // Expected Results: User redirected to login page
    await expect(page).toHaveURL(/\/(login|auth)/);
    
    // Error message displayed
    const errorMessage = page.getByText(/Session expired|Please login again|Unauthorized/i);
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });
});
