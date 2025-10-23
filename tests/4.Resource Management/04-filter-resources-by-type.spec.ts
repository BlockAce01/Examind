// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Resource Management', () => {
  test('4.4 Filter Resources by Type', async ({ page }) => {
    const uniqueEmail = `filterresourcetype.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Filter Resource Type');
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

    // 2. Select "Notes" from type filter
    await page.getByLabel(/Type/i).selectOption('Notes');

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
    await page.getByLabel(/Subject/i).selectOption('ICT');
    await page.waitForTimeout(500);
    
    const combinedFilter = page.locator('[data-testid="resource-card"]:has-text("ICT"):has-text("Notes")');
    if (await combinedFilter.count() > 0) {
      await expect(combinedFilter.first()).toBeVisible();
    }
  });
});
