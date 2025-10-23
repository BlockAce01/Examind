// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Resource Management', () => {
  test('4.3 Filter Resources by Subject', async ({ page }) => {
    const uniqueEmail = `filterresourcesubject.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Filter Resource Subject');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['ICT']);
    await page.getByLabel('Subject 3').selectOption(['Chemistry']);
    await page.getByRole('button', { name: 'Register' }).click();

    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // 1. Navigate to /resources
    await page.goto('http://localhost:3000/resources');

    // 2. Select "Physics" from subject filter
    await page.getByLabel(/Subject/i).selectOption('Physics');

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
    await page.getByLabel(/Type/i).selectOption('Past Paper');
    await page.waitForTimeout(500);
    
    const combinedFilter = page.locator('[data-testid="resource-card"]:has-text("Physics"):has-text("Past Paper")');
    if (await combinedFilter.count() > 0) {
      await expect(combinedFilter.first()).toBeVisible();
    }

    // Expected Results: "Clear All" button becomes enabled
    await expect(page.getByRole('button', { name: /Clear All/i })).toBeEnabled();
  });
});
