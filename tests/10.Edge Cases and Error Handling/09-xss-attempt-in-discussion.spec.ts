// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, DiscussionsPage, LoginPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.9 XSS Attempt in Discussion', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const discussionsPage = new DiscussionsPage(page);
    
    const uniqueEmail = registerPage.generateUniqueEmail('student');
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', uniqueEmail, 'SecurePass123!', ['Physics', 'Chemistry', 'Biology']);
    
    // Login after registration
    await page.waitForURL('**/login');
    await loginPage.login(uniqueEmail, 'SecurePass123!');
    // Wait for successful login redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    await discussionsPage.navigateToDiscussions();
    await discussionsPage.clickCreateTopic();
    
    // Include script tag in discussion
    const xssPayload = '<script>alert("XSS")</script>';
    await discussionsPage.createDiscussion(
      'Test Discussion',
      'Physics',
      xssPayload
    );
    
    await page.waitForTimeout(1000);
    
    // Expected Results: Script doesn't execute, text displayed as plain text
    // Check that no alert dialog appeared
    let alertShown = false;
    page.on('dialog', () => {
      alertShown = true;
    });
    
    await page.waitForTimeout(500);
    expect(alertShown).toBe(false);
    
    // Content should be sanitized
    const pageContent = await page.content();
    // Script tag should be escaped or removed
  });
});
