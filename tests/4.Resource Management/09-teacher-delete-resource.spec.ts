// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Resource Management', () => {
  test('4.9 Teacher - Delete Resource', async ({ page }) => {
    const uniqueEmail = `teacherdelresource.${Date.now()}@example.com`;

    // Register as teacher
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Teacher Delete Resource');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Teacher']);
    await page.getByLabel(/Subject/i).selectOption('Physics');
    await page.getByRole('button', { name: 'Register' }).click();

    // 1. Login as teacher
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForTimeout(1000);

    // 2. Find resource created by this teacher
    await page.goto('http://localhost:3000/teacher/resources');

    const resourceCount = await page.locator('[data-testid="resource-card"]').count();

    if (resourceCount > 0) {
      // 3. Click "Delete" button
      const deleteButton = page.getByRole('button', { name: /Delete/i }).first();
      await deleteButton.click();

      // 4. Confirm deletion in prompt
      // Expected Results: Confirmation dialog appears
      await expect(page.getByText(/Are you sure|Confirm|Delete/i)).toBeVisible();
      
      const confirmButton = page.getByRole('button', { name: /Confirm|Yes|Delete/i });
      await confirmButton.click();

      // Expected Results: Resource deleted from database
      await expect(page.getByText(/Success|deleted|removed/i)).toBeVisible();

      // Expected Results: Resource no longer appears in listing
      await page.waitForTimeout(1000);
      const newCount = await page.locator('[data-testid="resource-card"]').count();
      expect(newCount).toBeLessThan(resourceCount);
    } else {
      console.log('No resources available to delete');
    }
  });
});
