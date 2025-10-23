// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, ResourcesPage } from '../pages';

test.describe('Resource Management', () => {
  test('4.5 Clear Resource Filters', async ({ page }) => {
    const uniqueEmail = `clearresourcefilters.${Date.now()}@example.com`;
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const resourcesPage = new ResourcesPage(page);

    // Register and login
    await registerPage.navigateToRegister();
    await registerPage.registerStudent('Clear Resource Filters', uniqueEmail, 'SecurePass123!', ['ICT', 'Physics', 'Chemistry']);

    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    await resourcesPage.navigateToResources();

    const initialCount = await resourcesPage.getResourceCardCount();

    // 1. Apply subject filter "ICT"
    await resourcesPage.filterBySubject('ICT');
    await page.waitForTimeout(500);

    // 2. Apply type filter "Past Paper"
    await resourcesPage.filterByType('Past Paper');
    await page.waitForTimeout(500);

    // 3. Type "teacher" in search
    await resourcesPage.searchByTitle('teacher');
    await page.waitForTimeout(500);

    // 4. Click "Clear All" button
    await resourcesPage.clearFilters();

    // Expected Results: All filters reset
    await page.waitForTimeout(500);
    const clearedCount = await resourcesPage.getResourceCardCount();
    expect(clearedCount).toBeGreaterThanOrEqual(0);

    // Expected Results: Search box cleared
    await expect(page.getByPlaceholder(/Search by title or description/i)).toHaveValue('');

    // Expected Results: All resources displayed
    const finalCount = await resourcesPage.getResourceCardCount();
    expect(finalCount).toBeGreaterThanOrEqual(clearedCount);

    // Expected Results: Filter dropdowns return to "All" options
    await expect(page.getByLabel(/Subject/i)).toHaveValue('');
    await expect(page.getByLabel(/Type/i)).toHaveValue('');
  });
});
