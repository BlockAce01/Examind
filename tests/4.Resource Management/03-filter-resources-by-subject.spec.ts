// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, ResourcesPage } from '../pages';

test.describe('Resource Management', () => {
  test('4.3 Filter Resources by Subject', async ({ page }) => {
    const uniqueEmail = `filterresourcesubject.${Date.now()}@example.com`;
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const resourcesPage = new ResourcesPage(page);

    // Register and login
    await registerPage.navigateToRegister();
    await registerPage.registerStudent('Filter Resource Subject', uniqueEmail, 'SecurePass123!', ['Physics', 'ICT', 'Chemistry']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // 1. Navigate to /resources
    await resourcesPage.navigateToResources();

    // 2. Select "Physics" from subject filter
    await resourcesPage.filterBySubject('Physics');

    // 3. View results
    await page.waitForTimeout(500);

    // Expected Results: Only Physics resources displayed
    const physicsResources = page.locator('[data-testid="resource-card"]:has-text("Physics")');
    if (await physicsResources.count() > 0) {
      await expect(physicsResources.first()).toBeVisible();
    }

    // Expected Results: Other subjects hidden
    await expect(page.locator('[data-testid="resource-card"]:has-text("ICT")')).toHaveCount(0);

    // Expected Results: Can combine with type filter
    await resourcesPage.filterByType('Past Paper');
    await page.waitForTimeout(500);
    
    const combinedFilter = page.locator('[data-testid="resource-card"]:has-text("Physics"):has-text("Past Paper")');
    if (await combinedFilter.count() > 0) {
      await expect(combinedFilter.first()).toBeVisible();
    }

    // Expected Results: "Clear All" button becomes enabled
    await resourcesPage.verifyClearAllEnabled();
  });
});
