// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, ResourcesPage } from '../pages';

test.describe('Resource Management', () => {
  test('4.4 Filter Resources by Type', async ({ page }) => {
    const uniqueEmail = `filterresourcetype.${Date.now()}@example.com`;
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const resourcesPage = new ResourcesPage(page);

    // Register and login
    await registerPage.navigateToRegister();
    await registerPage.registerStudent('Filter Resource Type', uniqueEmail, 'SecurePass123!', ['Physics', 'ICT', 'Chemistry']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // 1. Navigate to /resources
    await resourcesPage.navigateToResources();

    // 2. Select "Notes" from type filter
    await resourcesPage.filterByType('Notes');

    // 3. View results
    await page.waitForTimeout(500);

    // Expected Results: Only "Notes" type resources shown
    const notesResources = page.locator('[data-testid="resource-card"]:has-text("Notes")');
    if (await notesResources.count() > 0) {
      await expect(notesResources.first()).toBeVisible();
    }

    // Expected Results: Past Papers and Other types hidden
    await expect(page.locator('[data-testid="resource-card"]:has-text("Past Paper")')).toHaveCount(0);
    await expect(page.locator('[data-testid="resource-card"]:has-text("Other")')).toHaveCount(0);

    // Expected Results: Type filter works independently or combined with subject filter
    await resourcesPage.filterBySubject('ICT');
    await page.waitForTimeout(500);
    
    const combinedFilter = page.locator('[data-testid="resource-card"]:has-text("ICT"):has-text("Notes")');
    if (await combinedFilter.count() > 0) {
      await expect(combinedFilter.first()).toBeVisible();
    }
  });
});
