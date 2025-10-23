import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class QuizTakingPage extends BasePage {
  readonly quizTitle: Locator;
  readonly timer: Locator;
  readonly questionCounter: Locator;
  readonly questionText: Locator;
  readonly answerOptions: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.quizTitle = page.locator('h1.mb-2');
    this.timer = page.locator('[data-testid="quiz-timer"]').or(page.getByText(/Time Left:/i));
    this.questionCounter = page.locator('[data-testid="question-counter"]').or(page.getByText(/Question \d+ of \d+/i));
    this.questionText = page.locator('p.mb-5');
    this.answerOptions = page.locator('div.space-y-3 button');
    this.previousButton = page.getByRole('button', { name: /Previous/i });
    this.nextButton = page.getByRole('button', { name: /Next/i });
    this.submitButton = page.getByRole('button', { name: /Submit|Finish/i });
  }

  async verifyOnQuizPage(quizId?: string) {
    if (quizId) {
      await expect(this.page).toHaveURL(new RegExp(`/quizzes/${quizId}/take`));
    } else {
      await expect(this.page).toHaveURL(/\/quizzes\/.*\/take/);
    }
  }

  async verifyQuizTitle() {
    if (await this.quizTitle.count() > 0) {
      await expect(this.quizTitle).toBeVisible();
    }
  }

  async verifyTimer() {
    await expect(this.timer).toBeVisible();
  }

  async getTimerValue(): Promise<string> {
    return await this.timer.textContent() || '';
  }

  async verifyQuestionCounter(currentQuestion: number, totalQuestions: number) {
    const counterText = `Question ${currentQuestion} of ${totalQuestions}`;
    await expect(this.page.getByText(counterText)).toBeVisible();
  }

  async verifyQuestionDisplayed() {
    if (await this.questionText.count() > 0) {
      await expect(this.questionText).toBeVisible();
    }
  }

  async selectAnswer(answerIndex: number) {
    await this.answerOptions.nth(answerIndex).click();
  }

  async selectAnswerByText(answerText: string) {
    await this.page.locator('div.space-y-3 button').filter({ hasText: answerText }).click();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickPrevious() {
    await this.previousButton.click();
  }

  async clickSubmit() {
    if (await this.submitButton.count() > 0) {
      await this.submitButton.click();
    } else {
      // On last question, Next might act as Submit
      await this.nextButton.click();
    }
  }

  async verifyPreviousDisabled() {
    await expect(this.previousButton).toBeDisabled();
  }

  async verifyPreviousEnabled() {
    await expect(this.previousButton).toBeEnabled();
  }

  async verifyNextEnabled() {
    await expect(this.nextButton).toBeEnabled();
  }

  async verifyAnswerSelected(answerIndex: number) {
    const option = this.answerOptions.nth(answerIndex);
    // Check if the option has a selected class or attribute
    await expect(option).toHaveClass(/selected|active|checked/);
  }

  async answerAllQuestions(answers: number[]) {
    for (let i = 0; i < answers.length; i++) {
      await this.selectAnswer(answers[i]);
      if (i < answers.length - 1) {
        await this.clickNext();
      }
    }
  }

  async navigateToQuestion(questionNumber: number, totalQuestions: number) {
    const currentQ = await this.getCurrentQuestionNumber();
    
    if (currentQ < questionNumber) {
      // Navigate forward
      for (let i = currentQ; i < questionNumber; i++) {
        await this.clickNext();
      }
    } else if (currentQ > questionNumber) {
      // Navigate backward
      for (let i = currentQ; i > questionNumber; i--) {
        await this.clickPrevious();
      }
    }
  }

  async getCurrentQuestionNumber(): Promise<number> {
    const counterText = await this.questionCounter.textContent();
    const match = counterText?.match(/Question (\d+) of \d+/);
    return match ? parseInt(match[1]) : 1;
  }

  async confirmSubmission() {
    // Handle confirmation dialog if it appears
    this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
    await this.clickSubmit();
  }
}
