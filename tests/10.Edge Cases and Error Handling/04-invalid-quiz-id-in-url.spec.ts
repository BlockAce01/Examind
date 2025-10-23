// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.4 Invalid Quiz ID in URL', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', uniqueEmail, 'SecurePass123!', ['Physics', 'Chemistry', 'Biology']);
    
    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    // Wait for successful login redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    // Navigate to quiz with non-existent ID
    await page.goto('http://localhost:3000/quizzes/99999/take');
    await page.waitForTimeout(1000);
    
    // Expected Results: 404 error or "Quiz not found" message
    const errorIndicators = [
      page.getByText(/404|Not found|Quiz not found|Does not exist/i),
      page.getByRole('heading', { name: /404|Not Found/i })
    ];
    
    let errorFound = false;
    for (const indicator of errorIndicators) {
      if (await indicator.count() > 0) {
        await expect(indicator.first()).toBeVisible();
        errorFound = true;
        break;
      }
    }
    
    // User may be redirected to /quizzes listing
    if (!errorFound) {
      await expect(page).toHaveURL(/\/quizzes$/);
    }
  });
});
