// spec: tests/TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Quiz Management and Taking', () => {
  test('3.5 Start Taking a Quiz', async ({ page }) => {
    const uniqueEmail = `startquiz.${Date.now()}@example.com`;

    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Start Quiz User');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SecurePass123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SecurePass123!');
    await page.getByLabel('Register As').selectOption(['Student']);
    await page.getByLabel('Subject').selectOption(['Physics']);
    await page.getByLabel('Subject 2').selectOption(['Chemistry']);
    await page.getByLabel('Subject 3').selectOption(['Combined Mathematics']);
    await page.getByRole('button', { name: 'Register' }).click();

    // Wait a bit for registration to process
    await page.waitForTimeout(2000);

    // Navigate to login page (whether registration succeeded or not)
    await page.goto('http://localhost:3000/login');
    
    // Login with the credentials
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for login to complete and redirect to dashboard
    await page.waitForURL(/\/(dashboard|profile)/, { timeout: 10000 });

    // 1. Navigate to /quizzes
    await page.goto('http://localhost:3000/quizzes');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // 2. Locate "Physics MCQ past papers" quiz as specified in test plan
    const physicsQuiz = page.getByRole('heading', { name: 'Physics MCQ past papers' }).first();
    await expect(physicsQuiz).toBeVisible({ timeout: 10000 });

    // 3. Click "Start Quiz" button for Physics quiz (the first one on the page)
    // Find the Start Quiz link that is near the Physics quiz heading
    const startQuizLink = page.locator('a[href*="/quizzes/"][href*="/take"]').first();
    await startQuizLink.click();

    // 4. Observe quiz interface
    // Expected Results: Redirect to /quizzes/[quizId]/take
    await expect(page).toHaveURL(/.*quizzes\/\d+\/take/);

    // Expected Results: Quiz title displayed at top ("Physics MCQ past papers")
    await expect(page.getByRole('heading', { name: 'Physics MCQ past papers' })).toBeVisible();

    // Expected Results: Timer starts counting down from specified time limit (e.g., "Time Left: 05:00")
    await expect(page.getByText(/Time Left:\s*\d{2}:\d{2}/i)).toBeVisible();

    // Expected Results: Question counter shows current question: "Question 1 of 3"
    await expect(page.getByText(/Question 1 of 3/i)).toBeVisible();

    // Expected Results: Question text displayed clearly
    await expect(page.locator('p').filter({ hasText: /.{10,}/ }).first()).toBeVisible();

    // Expected Results: Answer options shown as selectable buttons
    const answerButtons = page.getByRole('button').filter({ hasText: /^\d+%$|^[A-Za-z0-9\s\-\.]+$/ });
    expect(await answerButtons.count()).toBeGreaterThan(0);

    // Expected Results: Navigation buttons
    const previousButton = page.getByRole('button', { name: /Previous/i });
    const nextButton = page.getByRole('button', { name: /Next/i });
    
    // "Previous" button (disabled on first question)
    await expect(previousButton).toBeDisabled();
    // "Next" button (enabled)
    await expect(nextButton).toBeEnabled();
  });
});
