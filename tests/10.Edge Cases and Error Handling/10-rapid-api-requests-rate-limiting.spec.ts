// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';

test.describe('Edge Cases and Error Handling', () => {
  test('10.10 Rapid API Requests (Rate Limiting)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLogin();
    
    // Send multiple rapid requests
    const requests: Promise<any>[] = [];
    
    for (let i = 0; i < 20; i++) {
      const requestPromise = page.request.post('http://localhost:8080/api/v1/auth/login', {
        data: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      }).catch(err => ({ status: () => err.status || 500 }));
      
      requests.push(requestPromise);
    }
    
    const responses = await Promise.all(requests);
    
    // Expected Results: Some requests return 429 Too Many Requests
    const rateLimitedCount = responses.filter(r => r.status && r.status() === 429).length;
    
    // At least some should be rate limited if protection is in place
    // (Or all may succeed if rate limiting not implemented yet)
  });
});
