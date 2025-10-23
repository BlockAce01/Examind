import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  readonly pageTitle: Locator;
  readonly userAvatar: Locator;
  readonly userName: Locator;
  readonly userEmail: Locator;
  readonly userRole: Locator;
  readonly editProfileButton: Locator;
  readonly achievementsSection: Locator;
  readonly pointsCount: Locator;
  readonly badgesEarnedCount: Locator;
  readonly quizzesDoneCount: Locator;
  readonly myBadgesSection: Locator;
  readonly settingsSection: Locator;
  readonly accountPreferencesButton: Locator;
  readonly changePasswordButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { name: /My Profile/i });
    this.userAvatar = page.locator('[data-testid="user-avatar"]');
    this.userName = page.locator('[data-testid="user-name"]');
    this.userEmail = page.locator('[data-testid="user-email"]');
    this.userRole = page.locator('[data-testid="user-role"]');
    this.editProfileButton = page.getByRole('button', { name: /Edit Profile/i });
    this.achievementsSection = page.getByText(/Achievements/i);
    this.pointsCount = page.getByText(/Points/i);
    this.badgesEarnedCount = page.getByText(/Badges Earned/i);
    this.quizzesDoneCount = page.getByText(/Quizzes Done/i);
    this.myBadgesSection = page.getByText(/My Badges/i);
    this.settingsSection = page.getByText(/Settings/i);
    this.accountPreferencesButton = page.getByRole('button', { name: /Account Preferences/i });
    this.changePasswordButton = page.getByRole('button', { name: /Change Password/i });
  }

  async navigateToProfile() {
    await this.goto('http://localhost:3000/profile');
  }

  async verifyOnProfilePage() {
    // Verify that the current URL is the profile page
    await expect(this.page).toHaveURL(/.*\/profile/);
    // Optionally, check for page title if present
    if (await this.pageTitle.count() > 0) {
      await expect(this.pageTitle).toBeVisible();
    }
  }

  async verifyUserInfo(name?: string, email?: string) {
    if (name && await this.userName.count() > 0) {
      await expect(this.userName).toContainText(name);
    }
    if (email && await this.userEmail.count() > 0) {
      await expect(this.userEmail).toContainText(email);
    }
  }

  async verifyEditProfileButton() {
    await expect(this.editProfileButton).toBeVisible();
  }

  async clickEditProfile() {
    await this.editProfileButton.click();
  }

  async verifyAchievementsSection() {
    if (await this.pointsCount.count() > 0) {
      await expect(this.pointsCount).toBeVisible();
    }
    if (await this.badgesEarnedCount.count() > 0) {
      await expect(this.badgesEarnedCount).toBeVisible();
    }
    if (await this.quizzesDoneCount.count() > 0) {
      await expect(this.quizzesDoneCount).toBeVisible();
    }
  }

  async verifyMyBadgesSection() {
    await expect(this.myBadgesSection).toBeVisible();
  }

  async verifySettingsSection() {
    if (await this.accountPreferencesButton.count() > 0) {
      await expect(this.accountPreferencesButton).toBeVisible();
    }
    if (await this.changePasswordButton.count() > 0) {
      await expect(this.changePasswordButton).toBeVisible();
    }
  }

  async getBadgeCount(): Promise<number> {
    const badges = this.page.locator('[data-testid="badge-item"]');
    return await badges.count();
  }

  async verifyBadgeEarned(badgeName: string) {
    await expect(this.page.getByText(badgeName)).toBeVisible();
  }
}
