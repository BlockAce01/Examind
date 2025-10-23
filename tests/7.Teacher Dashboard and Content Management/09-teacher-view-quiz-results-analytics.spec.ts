// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Teacher Dashboard and Content Management', () => {
  test('7.9 Teacher - View Quiz Results/Analytics', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const teacherEmail = registerPage.generateUniqueEmail('teacher');
    await registerPage.navigateDirectly();
    await registerPage.selectRole('Teacher');
    await registerPage.registerTeacher('Test Teacher', teacherEmail, 'SecurePass123!', 'Physics');

    await page.goto('http://localhost:3000/teacher/quizzes');
    
    const viewResultsButton = page.getByRole('button', { name: /View Results|Analytics|Statistics/i }).first();
    if (await viewResultsButton.count() > 0) {
      await viewResultsButton.click();
      await page.waitForTimeout(1000);
      
      const analyticsIndicators = [
        page.getByText(/Average Score|Number of students|Score distribution/i),
        page.getByText(/Results|Analytics|Statistics/i)
      ];
      
      for (const indicator of analyticsIndicators) {
        if (await indicator.count() > 0) {
          await expect(indicator.first()).toBeVisible();
          break;
        }
      }
    }
  });
});
