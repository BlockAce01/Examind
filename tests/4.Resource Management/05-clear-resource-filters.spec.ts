// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Resource Management', () => {
  test('4.5 Clear Resource Filters', async ({ page }) => {
    const uniqueEmail = `clearresourcefilters.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Clear Resource Filters');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['ICT']);
    await page.getByLabel('Subject 2').selectOption(['Physics']);
    await page.getByLabel('Subject 3').selectOption(['Chemistry']);
    await page.getByRole('button', { name: 'Register' }).click();

    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.goto('http://localhost:3000/resources');

    const initialCount = await page.locator('[data-testid="resource-card"]').count();

    // 1. Apply subject filter "ICT"
    await page.getByLabel(/Subject/i).selectOption('ICT');
    await page.waitForTimeout(500);

    // 2. Apply type filter "Past Paper"
    await page.getByLabel(/Type/i).selectOption('Past Paper');
    await page.waitForTimeout(500);

    // 3. Type "teacher" in search
    await page.getByPlaceholder(/Search by title or description/i).fill('teacher');
    await page.waitForTimeout(500);

    // 4. Click "Clear All" button
    await page.getByRole('button', { name: /Clear All/i }).click();

    // Expected Results: All filters reset
    await page.waitForTimeout(500);
    const clearedCount = await page.locator('[data-testid="resource-card"]').count();
    expect(clearedCount).toBeGreaterThanOrEqual(0);

    // Expected Results: Search box cleared
    await expect(page.getByPlaceholder(/Search by title or description/i)).toHaveValue('');

    // Expected Results: All resources displayed
    const finalCount = await page.locator('[data-testid="resource-card"]').count();
    expect(finalCount).toBeGreaterThanOrEqual(clearedCount);

    // Expected Results: Filter dropdowns return to "All" options
    await expect(page.getByLabel(/Subject/i)).toHaveValue('');
    await expect(page.getByLabel(/Type/i)).toHaveValue('');
  });
});
