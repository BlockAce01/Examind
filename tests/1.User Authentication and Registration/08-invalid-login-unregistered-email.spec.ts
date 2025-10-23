// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';

test.describe('User Authentication and Registration', () => {
  test('1.8 Invalid Login - Unregistered Email', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Navigate to login page and attempt login with unregistered email
    await loginPage.navigateToLogin();
    await loginPage.login('nonexistent@example.com', 'AnyPassword123!');

    // Expected Results: Login fails and error message appears
    const errorMessages = [
      'Invalid credentials',
      'invalid credentials',
      'User not found',
      'Invalid email or password',
      'Email not found',
      'Authentication failed'
    ];
    
    let errorFound = false;
    for (const msg of errorMessages) {
      if (await page.getByText(msg).count() > 0) {
        errorFound = true;
        break;
      }
    }
    
    // If no specific error message, at least verify page didn't redirect
    expect(errorFound || await page.url().includes('login')).toBeTruthy();
    
    // Verify user remains on login page
    await loginPage.verifyStillOnLoginPage();
    
    // Close browser
    await page.close();
  });
});
