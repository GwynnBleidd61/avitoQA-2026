import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class StatsPage extends BasePage {
  protected pageName = "Страница статистики";

  readonly statsRoot: Locator;
  readonly refreshButton: Locator;
  readonly timerToggleButton: Locator;
  readonly timerValue: Locator;
  readonly autoRefreshDisabledText: Locator;
  readonly totalCheckedCard: Locator;
  readonly totalCheckedValue: Locator;

  constructor(page: Page) {
    super(page);

    this.refreshButton = page.getByRole("button", { name: "Обновить сейчас" });
    this.timerToggleButton = page.locator('button[aria-label*="автообновление"]');
    this.statsRoot = this.timerToggleButton;

    this.timerValue = page.locator('span[class*="_timeValue_"]');
    this.autoRefreshDisabledText = page.getByText("Автообновление выключено");
    this.totalCheckedCard = page.locator('div[class*="_card_"]').filter({
      has: page.getByText("Всего проверено"),
    });
    this.totalCheckedValue = this.totalCheckedCard.locator('p[class*="_value_"]');
  }

  protected root(): Locator {
    return this.statsRoot;
  }

  async waitForStatsPageOpen(): Promise<void> {
    await this.waitForOpen();
  }

  async clickRefresh(): Promise<void> {
    await this.refreshButton.click();
  }

  async clickTimerToggle(): Promise<void> {
    await this.timerToggleButton.click();
  }

  async getTimerToggleAriaLabel(): Promise<string | null> {
    return this.timerToggleButton.getAttribute("aria-label");
  }

  async getTimerValue(): Promise<string> {
    return (await this.timerValue.textContent())?.trim() ?? "";
  }

  async assertAutoRefreshDisabled(): Promise<void> {
    await expect(this.autoRefreshDisabledText).toBeVisible();
  }

  async assertTimerRunningState(): Promise<void> {
    await expect(this.timerValue).toBeVisible();
  }
}