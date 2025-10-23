// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, ResourcesPage } from '../pages';

test.describe('Resource Management', () => {
  test('4.1 Browse All Resources - Student View', async ({ page }) => {
    const uniqueEmail = `browseresource.${Date.now()}@example.com`;
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const resourcesPage = new ResourcesPage(page);

    // Register and login
    await registerPage.navigateToRegister();
    await registerPage.registerStudent('Browse Resource User', uniqueEmail, 'SecurePass123!', ['Physics', 'ICT', 'Chemistry']);

    // 1. Login as student
    await loginPage.navigateToLogin();
    await loginPage.login(uniqueEmail, 'SecurePass123!');

    // 2. Navigate to /resources
    await resourcesPage.navigateToResources();

    // 3. Observe resource listing
    // Expected Results: Page title: "Learning Resources"
    await resourcesPage.verifyOnResourcesPage();

    // Expected Results: Search bar at top
    await resourcesPage.verifySearchBar();

    // Expected Results: Filter dropdowns
    await resourcesPage.verifyFilters();

    // Expected Results: Resource cards display required information
    const count = await resourcesPage.getResourceCardCount();
    if (count > 0) {
      // Verify first card has visible details
      await resourcesPage.verifyResourceCard(0);
    }
  });
});
