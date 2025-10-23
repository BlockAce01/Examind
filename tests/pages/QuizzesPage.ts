import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class QuizzesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly subjectFilter: Locator;
  readonly difficultyFilter: Locator;
  readonly clearFiltersButton: Locator;
  readonly quizCards: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { name: /Available Quizzes/i });
    this.subjectFilter = page.getByLabel(/Filter by subject/i);
    this.difficultyFilter = page.getByLabel(/Filter by difficulty/i);
    this.clearFiltersButton = page.getByRole('button', { name: /Clear Filters/i });
    // Quiz cards - find divs in the grid container with specific styling
    this.quizCards = page.locator('div[class*="bg-white"][class*="rounded-lg"][class*="shadow-md"]');
  }

  async navigateToQuizzes() {
    await this.goto('http://localhost:3000/quizzes');
  }

  async verifyOnQuizzesPage() {
    await expect(this.pageTitle).toBeVisible();
  }

  async verifyFilterOptions() {
    await expect(this.subjectFilter).toBeVisible();
    await expect(this.difficultyFilter).toBeVisible();
    await expect(this.clearFiltersButton).toBeVisible();
  }

  async filterBySubject(subject: string) {
    await this.subjectFilter.selectOption([subject]);
  }

  async filterByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard') {
    await this.difficultyFilter.selectOption([difficulty]);
  }

  async clearFilters() {
    await this.clearFiltersButton.click();
  }

  async verifyClearFiltersEnabled() {
    await expect(this.clearFiltersButton).toBeEnabled();
  }

  async verifyClearFiltersDisabled() {
    await expect(this.clearFiltersButton).toBeDisabled();
  }

  async verifyQuizCard(index: number = 0) {
    const card = this.quizCards.nth(index);
    await expect(card).toBeVisible();
    
    // Verify quiz card elements
    await expect(card.locator('h3')).toBeVisible();
    await expect(card.locator('text=/Easy|Medium|Hard/i').first()).toBeVisible();
    await expect(card.locator('p').filter({ hasText: /Physics|Chemistry|Mathematics|ICT|Biology|Business/ })).toBeVisible();
    await expect(card.locator('text=/Questions/i')).toBeVisible();
    await expect(card.locator('text=/min/i')).toBeVisible();
    await expect(card.getByRole('link', { name: /Start Quiz/i })).toBeVisible();
  }

  async getQuizCardCount(): Promise<number> {
    return await this.quizCards.count();
  }

  async startQuiz(quizTitle?: string) {
    if (quizTitle) {
      // Find the card by the title inside the h3 tag
      const card = this.page.getByRole('heading', { name: quizTitle }).locator('../../..');
      await card.getByRole('link', { name: /Start Quiz/i }).click();
    } else {
      // Click the first "Start Quiz" link
      await this.page.getByRole('link', { name: /Start Quiz/i }).first().click();
    }
  }

  async verifyQuizFiltered(subject?: string, difficulty?: string) {
    if (await this.quizCards.count() > 0) {
      const firstCard = this.quizCards.first();
      
      if (subject) {
        await expect(firstCard).toContainText(subject);
      }
      
      if (difficulty) {
        await expect(firstCard).toContainText(difficulty);
      }
    }
  }

  async verifyNoQuizzes() {
    await expect(this.page.getByText(/No quizzes|No results/i)).toBeVisible();
  }
}
