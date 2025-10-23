import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DiscussionsPage extends BasePage {
  readonly pageTitle: Locator;
  readonly createTopicButton: Locator;
  readonly discussionList: Locator;
  readonly topicTitleInput: Locator;
  readonly subjectSelect: Locator;
  readonly descriptionTextarea: Locator;
  readonly submitTopicButton: Locator;
  readonly backToForumsLink: Locator;
  readonly commentTextarea: Locator;
  readonly postReplyButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { name: /Discussion Forums/i });
    this.createTopicButton = page.getByRole('button', { name: /Create New Topic/i });
    this.discussionList = page.locator('[data-testid="discussion-list"]');
    this.topicTitleInput = page.getByLabel(/Topic/i);
    this.subjectSelect = page.getByLabel(/Subject/i);
    this.descriptionTextarea = page.getByLabel(/Description/i);
    this.submitTopicButton = page.getByRole('button', { name: /Submit|Create/i });
    this.backToForumsLink = page.getByRole('link', { name: /Back to All Forums/i });
    this.commentTextarea = page.getByPlaceholder(/Add your contribution/i);
    this.postReplyButton = page.getByRole('button', { name: /Post Reply/i });
  }

  async navigateToDiscussions() {
    await this.goto('http://localhost:3000/discussions');
  }

  async verifyOnDiscussionsPage() {
    await expect(this.pageTitle).toBeVisible();
  }

  async verifyCreateTopicButton() {
    await expect(this.createTopicButton).toBeVisible();
  }

  async clickCreateTopic() {
    await this.createTopicButton.click();
  }

  async createDiscussion(topic: string, subject: string, description: string) {
    await this.topicTitleInput.fill(topic);
    await this.subjectSelect.selectOption([subject]);
    await this.descriptionTextarea.fill(description);
    await this.submitTopicButton.click();
  }

  async verifyDiscussionCreated(topic: string) {
    await expect(this.page.getByText(topic)).toBeVisible();
  }

  async clickDiscussion(topic: string) {
    await this.page.getByRole('link', { name: topic }).click();
  }

  async verifyDiscussionDetail(topic: string) {
    await expect(this.page.getByRole('heading', { name: topic })).toBeVisible();
  }

  async verifyBackToForums() {
    await expect(this.backToForumsLink).toBeVisible();
  }

  async postComment(comment: string) {
    await this.commentTextarea.fill(comment);
    await this.postReplyButton.click();
  }

  async verifyCommentPosted(comment: string) {
    await expect(this.page.getByText(comment)).toBeVisible();
  }

  async upvoteComment(commentText: string) {
    const comment = this.page.locator('[data-testid="comment"]').filter({ hasText: commentText });
    await comment.getByRole('button', { name: /upvote|👍/i }).click();
  }

  async verifyUpvoteCount(commentText: string, expectedCount: number) {
    const comment = this.page.locator('[data-testid="comment"]').filter({ hasText: commentText });
    await expect(comment.getByText(expectedCount.toString())).toBeVisible();
  }

  async verifyCommentTextarea() {
    await expect(this.commentTextarea).toBeVisible();
  }

  async verifyPostReplyButton() {
    await expect(this.postReplyButton).toBeVisible();
  }

  async verifyPostReplyEnabled() {
    await expect(this.postReplyButton).toBeEnabled();
  }

  async verifyPostReplyDisabled() {
    await expect(this.postReplyButton).toBeDisabled();
  }

  async getDiscussionCount(): Promise<number> {
    const discussions = this.page.locator('[data-testid="discussion-item"]');
    return await discussions.count();
  }

  async editDiscussion(topic: string) {
    const discussion = this.page.locator('[data-testid="discussion-item"]').filter({ hasText: topic });
    await discussion.getByRole('button', { name: /Edit/i }).click();
  }

  async deleteDiscussion(topic: string) {
    const discussion = this.page.locator('[data-testid="discussion-item"]').filter({ hasText: topic });
    await discussion.getByRole('button', { name: /Delete/i }).click();
  }

  async confirmDeletion() {
    this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
  }

  async verifyDiscussionDeleted(topic: string) {
    await expect(this.page.getByText(topic)).not.toBeVisible();
  }

  async filterBySubject(subject: string) {
    const subjectFilter = this.page.getByLabel(/Filter by Subject/i);
    if (await subjectFilter.count() > 0) {
      await subjectFilter.selectOption([subject]);
    }
  }

  async verifyEmptyState() {
    await expect(this.page.getByText(/No discussions found/i)).toBeVisible();
  }
}
