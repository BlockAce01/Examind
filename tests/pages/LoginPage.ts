import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.registerLink = page.getByRole('link', { name: 'Register', exact: true });
  }

  async navigateToLogin() {
    await this.goto('/login');
  }

  async navigateFromHome() {
    await this.goto('/');
    // Will auto-redirect to login
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async verifyLoginSuccess() {
    // Wait for redirect to dashboard
    await this.waitForURL(/.*dashboard/);
  }

  async verifyErrorMessage(message?: string) {
    if (message) {
      await expect(this.page.getByText(new RegExp(message, 'i'))).toBeVisible();
    } else {
      // Generic error check
      await expect(this.page.getByText(/invalid|error|wrong|failed/i)).toBeVisible();
    }
  }

  async verifyStillOnLoginPage() {
    await expect(this.page).toHaveURL(/.*login/);
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }
}
