import { expect, Locator, Page } from "@playwright/test";

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected abstract root(): Locator;
  protected abstract pageName: string;

  async waitForOpen(): Promise<void> {
    await expect(
      this.root(),
      `Страница "${this.pageName}" не открылась`
    ).toBeVisible();
  }

  async open(path: string): Promise<void> {
    await this.page.goto(path);
  }
}