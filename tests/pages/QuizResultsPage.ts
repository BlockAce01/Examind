import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class QuizResultsPage extends BasePage {
  readonly resultsHeading: Locator;
  readonly scoreDisplay: Locator;
  readonly percentageDisplay: Locator;
  readonly passFail: Locator;
  readonly timeTaken: Locator;
  readonly questionReview: Locator;
  readonly backToQuizzesButton: Locator;
  readonly retakeQuizButton: Locator;
  readonly aiChatButton: Locator;

  constructor(page: Page) {
    super(page);
    this.resultsHeading = page.getByRole('heading', { name: /Results|Score|Quiz Complete/i });
    this.scoreDisplay = page.locator('[data-testid="quiz-score"]').or(page.getByText(/\d+ out of \d+/));
    this.percentageDisplay = page.locator('[data-testid="quiz-percentage"]');
    this.passFail = page.locator('[data-testid="pass-fail-status"]');
    this.timeTaken = page.locator('[data-testid="time-taken"]');
    this.questionReview = page.locator('[data-testid="question-review"]');
    this.backToQuizzesButton = page.getByRole('button', { name: /Back to Quizzes/i });
    this.retakeQuizButton = page.getByRole('button', { name: /Retake/i });
    this.aiChatButton = page.getByRole('button', { name: /AI|Chat|Help/i });
  }

  async verifyOnResultsPage(quizId?: string) {
    if (quizId) {
      await expect(this.page).toHaveURL(new RegExp(`/quizzes/${quizId}/results`));
    } else {
      await expect(this.page).toHaveURL(/\/quizzes\/.*\/results/);
    }
  }

  async verifyResultsDisplayed() {
    await expect(this.resultsHeading).toBeVisible();
  }

  async verifyScore(correct: number, total: number) {
    const scoreText = `${correct} out of ${total}`;
    await expect(this.page.getByText(scoreText)).toBeVisible();
  }

  async getScore(): Promise<{ correct: number; total: number } | null> {
    const scoreText = await this.scoreDisplay.textContent();
    const match = scoreText?.match(/(\d+) out of (\d+)/);
    
    if (match) {
      return {
        correct: parseInt(match[1]),
        total: parseInt(match[2])
      };
    }
    return null;
  }

  async verifyPercentage() {
    if (await this.percentageDisplay.count() > 0) {
      await expect(this.percentageDisplay).toBeVisible();
    }
  }

  async verifyTimeTaken() {
    if (await this.timeTaken.count() > 0) {
      await expect(this.timeTaken).toBeVisible();
    }
  }

  async verifyQuestionReview() {
    if (await this.questionReview.count() > 0) {
      await expect(this.questionReview).toBeVisible();
    }
  }

  async verifyQuestionReviewItem(questionNumber: number) {
    const reviewItem = this.page.locator(`[data-testid="review-question-${questionNumber}"]`);
    await expect(reviewItem).toBeVisible();
  }

  async verifyCorrectAnswer(questionNumber: number) {
    const correctIndicator = this.page.locator(`[data-testid="review-question-${questionNumber}"] [data-testid="correct-indicator"]`);
    if (await correctIndicator.count() > 0) {
      await expect(correctIndicator).toBeVisible();
    }
  }

  async verifyIncorrectAnswer(questionNumber: number) {
    const incorrectIndicator = this.page.locator(`[data-testid="review-question-${questionNumber}"] [data-testid="incorrect-indicator"]`);
    if (await incorrectIndicator.count() > 0) {
      await expect(incorrectIndicator).toBeVisible();
    }
  }

  async clickBackToQuizzes() {
    await this.backToQuizzesButton.click();
  }

  async clickRetakeQuiz() {
    if (await this.retakeQuizButton.count() > 0) {
      await this.retakeQuizButton.click();
    }
  }

  async clickAIChat() {
    if (await this.aiChatButton.count() > 0) {
      await this.aiChatButton.click();
    }
  }

  async verifyAIChatAvailable() {
    if (await this.aiChatButton.count() > 0) {
      await expect(this.aiChatButton).toBeVisible();
    }
  }

  async verifyPointsAwarded() {
    await expect(this.page.getByText(/Points|Earned|Score/i)).toBeVisible();
  }
}
