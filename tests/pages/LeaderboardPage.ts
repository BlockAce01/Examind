import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LeaderboardPage extends BasePage {
  readonly pageTitle: Locator;
  readonly leaderboardList: Locator;
  readonly currentUserHighlight: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { name: /Leaderboard/i });
    this.leaderboardList = page.locator('[data-testid="leaderboard-list"]');
    this.currentUserHighlight = page.locator('[data-testid="current-user-entry"]');
  }

  async navigateToLeaderboard() {
    await this.goto('http://localhost:3000/leaderboard');
  }

  async verifyOnLeaderboardPage() {
    await expect(this.pageTitle).toBeVisible();
  }

  async verifyLeaderboardEntries() {
    if (await this.leaderboardList.count() > 0) {
      await expect(this.leaderboardList).toBeVisible();
    }
  }

  async verifyEntryContent(rank: number) {
    const entry = this.page.locator(`[data-testid="leaderboard-entry-${rank}"]`);
    if (await entry.count() > 0) {
      await expect(entry).toBeVisible();
      // Should show rank, name, and points
      await expect(entry.getByText(rank.toString())).toBeVisible();
    }
  }

  async verifyCurrentUserHighlighted() {
    if (await this.currentUserHighlight.count() > 0) {
      await expect(this.currentUserHighlight).toBeVisible();
    }
  }

  async getUserRank(userName: string): Promise<number | null> {
    // Look for list items containing the user name
    const listItems = this.page.locator('li');
    const count = await listItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = listItems.nth(i);
      const text = await item.textContent();
      if (text?.includes(userName)) {
        // Extract rank from text like "4. Test Student"
        const rankMatch = text.match(/^(\d+)\./);
        if (rankMatch) {
          return parseInt(rankMatch[1]);
        }
      }
    }
    return null;
  }
}
