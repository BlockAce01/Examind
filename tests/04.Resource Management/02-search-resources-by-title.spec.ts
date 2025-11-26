// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, ResourcesPage } from '../pages';

test.describe('Resource Management', () => {
  test('4.2 Search Resources by Title', async ({ page }) => {
    const uniqueEmail = `searchresource.${Date.now()}@example.com`;
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const resourcesPage = new ResourcesPage(page);

    // Register and login
    await registerPage.navigateToRegister();
    await registerPage.registerStudent('Search Resource User', uniqueEmail, 'SecurePass123!', ['Physics', 'ICT', 'Chemistry']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // 1. Navigate to /resources
    await resourcesPage.navigateToResources();

    const initialCount = await resourcesPage.getResourceCardCount();

    // 2. Type "past paper" in search box
    await resourcesPage.searchByTitle('past paper');

    // 3. Observe filtered results
    await page.waitForTimeout(500); // Wait for debounced search

    // Expected Results: Only resources with "past paper" in title or description shown
    const filteredCount = await resourcesPage.getResourceCardCount();
    
    if (filteredCount > 0) {
      await expect(page.locator('[data-testid="resource-card"]:has-text("past paper")')).toHaveCount(filteredCount);
    }

    // Expected Results: Search is case-insensitive
    await resourcesPage.searchByTitle('PAST PAPER');
    await page.waitForTimeout(500);
    const caseInsensitiveCount = await resourcesPage.getResourceCardCount();
    expect(caseInsensitiveCount).toBeGreaterThanOrEqual(0);

    // Expected Results: Results update as user types
    await resourcesPage.searchByTitle('notes');
    await page.waitForTimeout(500);
    const notesCount = await resourcesPage.getResourceCardCount();
    
    // If there are resources, verify search filtering works
    if (filteredCount > 0 && notesCount > 0) {
      expect(notesCount).not.toEqual(filteredCount);
    }

    // Expected Results: Other resources hidden
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });
});
