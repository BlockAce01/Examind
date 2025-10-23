// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Resource Management', () => {
  test('4.1 Browse All Resources - Student View', async ({ page }) => {
    const uniqueEmail = `browseresource.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Browse Resource User');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['ICT']);
    await page.getByLabel('Subject 3').selectOption(['Chemistry']);
    await page.getByRole('button', { name: 'Register' }).click();

    // 1. Login as student
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Navigate to /resources
    await page.goto('http://localhost:3000/resources');

    // 3. Observe resource listing
    // Expected Results: Page title: "Learning Resources"
    await expect(page.getByRole('heading', { name: /Learning Resources/i })).toBeVisible();

    // Expected Results: Search bar at top
    await expect(page.getByPlaceholder(/Search by title or description/i)).toBeVisible();

    // Expected Results: Filter dropdowns
    await expect(page.getByLabel(/Subject/i)).toBeVisible();
    await expect(page.getByLabel(/Type/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear All/i })).toBeVisible();

    // Expected Results: Resource cards display required information
    const resourceCards = page.locator('[data-testid="resource-card"]');
    if (await resourceCards.count() > 0) {
      const firstCard = resourceCards.first();
      await expect(firstCard).toBeVisible();
      
      // Title (clickable link)
      await expect(firstCard.getByRole('link').first()).toBeVisible();
      
      // Type badge
      await expect(firstCard.getByText(/Past Paper|Notes|Other/i)).toBeVisible();
      
      // Subject tag
      await expect(firstCard.getByText(/Physics|ICT|Chemistry|Mathematics/i)).toBeVisible();
    }
  });
});
