import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async waitForURL(pattern: string | RegExp, timeout: number = 10000) {
    await this.page.waitForURL(pattern, { timeout });
  }

  async close() {
    await this.page.close();
  }

  async getTextContent(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async count(locator: Locator): Promise<number> {
    return await locator.count();
  }
}
