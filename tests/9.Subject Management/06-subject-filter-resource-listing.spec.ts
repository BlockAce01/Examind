// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage, ResourcesPage } from '../pages';

test.describe('Subject Management', () => {
  test('9.6 Subject Filter - Resource Listing', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const resourcesPage = new ResourcesPage(page);
    
    await registerPage.navigateDirectly();
    await registerPage.registerStudent('Test Student', registerPage.generateUniqueEmail('student'), 'SecurePass123!', ['ICT', 'Physics', 'Chemistry']);
    
    await resourcesPage.navigateToResources();
    
    // Subject filter shows subjects with resources
    await expect(resourcesPage.subjectFilter).toBeVisible();
    
    // Select "ICT"
    await resourcesPage.filterBySubject('ICT');
    await page.waitForTimeout(500);
    
    // Expected Results: Only ICT resources displayed
    await resourcesPage.verifyResourceFiltered('ICT');
  });
});
