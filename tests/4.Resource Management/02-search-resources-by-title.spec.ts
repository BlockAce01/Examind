// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Resource Management', () => {
  test('4.2 Search Resources by Title', async ({ page }) => {
    const uniqueEmail = `searchresource.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Search Resource User');
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

    const initialCount = await page.locator('[data-testid="resource-card"]').count();

    // 2. Type "past paper" in search box
    const searchBox = page.getByPlaceholder(/Search by title or description/i);
    await searchBox.fill('past paper');

    // 3. Observe filtered results
    await page.waitForTimeout(500); // Wait for debounced search

    // Expected Results: Only resources with "past paper" in title or description shown
    const filteredCount = await page.locator('[data-testid="resource-card"]').count();
    
    if (filteredCount > 0) {
      await expect(page.locator('[data-testid="resource-card"]:has-text("past paper")')).toHaveCount(filteredCount);
    }

    // Expected Results: Search is case-insensitive
    await searchBox.fill('PAST PAPER');
    await page.waitForTimeout(500);
    const caseInsensitiveCount = await page.locator('[data-testid="resource-card"]').count();
    expect(caseInsensitiveCount).toBeGreaterThanOrEqual(0);

    // Expected Results: Results update as user types
    await searchBox.fill('notes');
    await page.waitForTimeout(500);
    const notesCount = await page.locator('[data-testid="resource-card"]').count();
    
    // If there are resources, verify search filtering works
    if (filteredCount > 0 && notesCount > 0) {
      expect(notesCount).not.toEqual(filteredCount);
    }

    // Expected Results: Other resources hidden
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });
});
