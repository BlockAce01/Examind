import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerAsDropdown: Locator;
  readonly subject1Dropdown: Locator;
  readonly subject2Dropdown: Locator;
  readonly subject3Dropdown: Locator;
  readonly subjectDropdown: Locator; // For teacher (single subject)
  readonly registerButton: Locator;
  readonly registerLink: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameInput = page.getByRole('textbox', { name: 'Full Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
    this.registerAsDropdown = page.getByLabel('Register As');
    this.subject1Dropdown = page.getByLabel('Subject 1');
    this.subject2Dropdown = page.getByLabel('Subject 2');
    this.subject3Dropdown = page.getByLabel('Subject 3');
    this.subjectDropdown = page.locator('select').last(); // For teacher - single subject select
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.registerLink = page.getByRole('link', { name: 'Register', exact: true });
    this.successMessage = page.getByText('Registration successful! You can now log in.');
  }

  async navigateToRegister() {
    await this.goto('http://localhost:3000');
    await this.registerLink.click();
  }

  async navigateDirectly() {
    await this.goto('http://localhost:3000/register');
  }

  async fillFullName(name: string) {
    await this.fullNameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.fill(password);
  }

  async selectRole(role: 'Student' | 'Teacher') {
    await this.registerAsDropdown.selectOption([role]);
  }

  async selectStudentSubjects(subject1: string, subject2: string, subject3: string) {
    await this.subject1Dropdown.selectOption([subject1]);
    await this.subject2Dropdown.selectOption([subject2]);
    await this.subject3Dropdown.selectOption([subject3]);
  }

  async selectTeacherSubject(subject: string) {
    await this.subjectDropdown.selectOption([subject]);
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async registerStudent(name: string, email: string, password: string, subjects: [string, string, string]) {
    await this.fillFullName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
    await this.selectRole('Student');
    await this.selectStudentSubjects(subjects[0], subjects[1], subjects[2]);
    await this.clickRegister();
  }

  async registerTeacher(name: string, email: string, password: string, subject: string) {
    await this.fillFullName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
    await this.selectRole('Teacher');
    await this.selectTeacherSubject(subject);
    await this.clickRegister();
  }

  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  async verifyFormCleared() {
    await expect(this.fullNameInput).toHaveValue('');
    await expect(this.emailInput).toHaveValue('');
  }

  async verifyErrorMessage(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async verifyValidationError(errorText: string) {
    await expect(this.page.getByText(new RegExp(errorText, 'i'))).toBeVisible();
  }

  generateUniqueEmail(prefix: string = 'user'): string {
    return `${prefix}.${Date.now()}@example.com`;
  }
}
