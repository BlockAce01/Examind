import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ResourcesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly subjectFilter: Locator;
  readonly typeFilter: Locator;
  readonly clearAllButton: Locator;
  readonly resourceCards: Locator;
  readonly uploadResourceButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { name: /Learning Resources/i });
    this.searchInput = page.getByPlaceholder(/Search by title or description/i);
    this.subjectFilter = page.getByLabel(/Subject/i);
    this.typeFilter = page.getByLabel(/Type/i);
    this.clearAllButton = page.getByRole('button', { name: /Clear All/i });
    this.resourceCards = page.locator('[data-testid="resource-card"]');
    this.uploadResourceButton = page.getByRole('button', { name: /Upload Resource|Create Resource/i });
  }

  async navigateToResources() {
    await this.goto('http://localhost:3000/resources');
  }

  async verifyOnResourcesPage() {
    await expect(this.pageTitle).toBeVisible();
  }

  async verifySearchBar() {
    await expect(this.searchInput).toBeVisible();
  }

  async verifyFilters() {
    await expect(this.subjectFilter).toBeVisible();
    await expect(this.typeFilter).toBeVisible();
    await expect(this.clearAllButton).toBeVisible();
  }

  async searchByTitle(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async filterBySubject(subject: string) {
    await this.subjectFilter.selectOption([subject]);
  }

  async filterByType(type: 'Past Paper' | 'Notes' | 'Other') {
    await this.typeFilter.selectOption([type]);
  }

  async clearFilters() {
    await this.clearAllButton.click();
  }

  async verifyClearAllEnabled() {
    await expect(this.clearAllButton).toBeEnabled();
  }

  async verifyClearAllDisabled() {
    await expect(this.clearAllButton).toBeDisabled();
  }

  async verifyResourceCard(index: number = 0) {
    const card = this.resourceCards.nth(index);
    await expect(card).toBeVisible();
    
    // Verify resource card elements
    await expect(card.getByRole('link').first()).toBeVisible(); // Title link
    await expect(card.getByText(/Past Paper|Notes|Other/i)).toBeVisible(); // Type badge
    await expect(card.getByText(/Physics|ICT|Chemistry|Mathematics/i)).toBeVisible(); // Subject
  }

  async getResourceCardCount(): Promise<number> {
    return await this.resourceCards.count();
  }

  async clickResource(resourceTitle: string) {
    const card = this.resourceCards.filter({ hasText: resourceTitle });
    await card.getByRole('link').first().click();
  }

  async clickResourceByIndex(index: number) {
    await this.resourceCards.nth(index).getByRole('link').first().click();
  }

  async verifyResourceFiltered(subject?: string, type?: string) {
    if (await this.resourceCards.count() > 0) {
      const firstCard = this.resourceCards.first();
      
      if (subject) {
        await expect(firstCard).toContainText(subject);
      }
      
      if (type) {
        await expect(firstCard).toContainText(type);
      }
    }
  }

  async verifyNoResources() {
    await expect(this.page.getByText(/No resources|No results/i)).toBeVisible();
  }

  async verifySearchResults(searchTerm: string) {
    if (await this.resourceCards.count() > 0) {
      const firstCard = this.resourceCards.first();
      // Check if search term appears in title or description
      await expect(firstCard).toContainText(new RegExp(searchTerm, 'i'));
    }
  }

  // Teacher-specific methods
  async clickUploadResource() {
    if (await this.uploadResourceButton.count() > 0) {
      await this.uploadResourceButton.click();
    }
  }

  async editResource(resourceTitle: string) {
    const card = this.resourceCards.filter({ hasText: resourceTitle });
    await card.getByRole('button', { name: /Edit/i }).click();
  }

  async deleteResource(resourceTitle: string) {
    const card = this.resourceCards.filter({ hasText: resourceTitle });
    await card.getByRole('button', { name: /Delete/i }).click();
  }

  async confirmDeletion() {
    this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
  }

  async verifyResourceDeleted(resourceTitle: string) {
    const card = this.resourceCards.filter({ hasText: resourceTitle });
    await expect(card).not.toBeVisible();
  }

  async verifyUploadForm() {
    await expect(this.page.getByLabel(/Title/i)).toBeVisible();
    await expect(this.page.getByLabel(/Description/i)).toBeVisible();
    await expect(this.page.getByLabel(/Subject/i)).toBeVisible();
    await expect(this.page.getByLabel(/Type/i)).toBeVisible();
  }

  async uploadNewResource(title: string, description: string, subject: string, type: string, filePath?: string) {
    await this.page.getByLabel(/Title/i).fill(title);
    await this.page.getByLabel(/Description/i).fill(description);
    await this.page.getByLabel(/Subject/i).selectOption([subject]);
    await this.page.getByLabel(/Type/i).selectOption([type]);
    
    if (filePath) {
      await this.page.getByLabel(/File|Upload/i).setInputFiles(filePath);
    }
    
    await this.page.getByRole('button', { name: /Submit|Upload|Create/i }).click();
  }

  async verifyResourceCreated(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }
}
