import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class ListPage extends BasePage {
  protected pageName = "Главная страница";

  readonly filtersSidebar: Locator;
  readonly categorySelect: Locator;
  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;
  readonly urgentOnlyToggleLabel: Locator;
  readonly urgentOnlyToggleInput: Locator;
  readonly sortBySelect: Locator;
  readonly sortOrderSelect: Locator;
  readonly resetFiltersButton: Locator;

  readonly cards: Locator;
  readonly emptyState: Locator;
  readonly emptyStateResetButton: Locator;

  readonly themeToggleButton: Locator;
  readonly themeToggleLabel: Locator;

  readonly statsLink: Locator;

  constructor(page: Page) {
    super(page);

    this.filtersSidebar = page.locator("aside");
    this.categorySelect = page.locator("label").filter({ hasText: "Категория" }).locator("..").locator("select");
    this.minPriceInput = page.getByPlaceholder("От");
    this.maxPriceInput = page.getByPlaceholder("До");
    this.urgentOnlyToggleLabel = page.locator("label").filter({ hasText: "Только срочные" });
    this.urgentOnlyToggleInput = this.urgentOnlyToggleLabel.locator('input[type="checkbox"]');
    this.sortBySelect = page.locator("label").filter({ hasText: "Сортировать по" }).locator("..").locator("select");
    this.sortOrderSelect = page.locator("label").filter({ hasText: "Порядок" }).locator("..").locator("select");
    this.resetFiltersButton = page.getByTitle("Сбросить все фильтры");
    this.themeToggleButton = page.locator('button[aria-label*="theme"]');
    this.themeToggleLabel = this.themeToggleButton.locator('span[class*="_label_"]');
    this.statsLink = page.getByRole("link", { name: "Статистика" });

    this.cards = page
        .locator('div[class*="_card_"]')
        .filter({ has: page.locator('h3[class*="__title_"]') });
    this.emptyState = page.getByText("📭 Объявления не найдены");
    this.emptyStateResetButton = page.getByRole("button", { name: "Сбросить фильтры" });
  }

  protected root(): Locator {
    return this.filtersSidebar;
  }

  async openListPage(): Promise<void> {
    await this.open("/");
    await this.waitForOpen();
  }
  
  async openStatsPageFromHeader(): Promise<void> {
    await this.statsLink.click();
  }

  async openCardByTitle(title: string): Promise<void> {
    await this.page.getByRole("heading", { name: title }).click();
  }

  async selectCategory(value: string): Promise<void> {
    await this.categorySelect.selectOption(value);
    await this.waitForResultsUpdate();
  }

  async fillPriceRange(min: string, max: string): Promise<void> {
    await this.minPriceInput.fill(min);
    await this.maxPriceInput.fill(max);
    await this.waitForResultsUpdate();
  }

  async enableUrgentOnly(): Promise<void> {
    const isChecked = await this.urgentOnlyToggleInput.isChecked();

    if (!isChecked) {
        await this.urgentOnlyToggleLabel.click();
        await this.waitForResultsUpdate();
    }
  }

  async disableUrgentOnly(): Promise<void> {
    const isChecked = await this.urgentOnlyToggleInput.isChecked();

    if (isChecked) {
        await this.urgentOnlyToggleLabel.click();
        await this.waitForResultsUpdate();
    }
  }

  async selectSortBy(value: "createdAt" | "price" | "priority"): Promise<void> {
    await this.sortBySelect.selectOption(value);
  }

  async selectSortOrder(value: "asc" | "desc"): Promise<void> {
    await this.sortOrderSelect.selectOption(value);
    await this.waitForResultsUpdate();
  }

  async resetFilters(): Promise<void> {
    await this.resetFiltersButton.click();
  }

  async getCardsCount(): Promise<number> {
    return this.cards.count();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }

  async waitForResultsUpdate(): Promise<void> {
    await Promise.race([
        this.cards.first().waitFor({ state: "visible", timeout: 5000 }),
        this.emptyState.waitFor({ state: "visible", timeout: 5000 }),
    ]);
    }

  async getCardPrices(): Promise<number[]> {
    const prices = await this.cards.locator('div[class*="__price_"]').allTextContents();

    return prices.map((priceText) =>
      Number(priceText.replace(/[^\d]/g, ""))
    );
  }

  async getCardCategories(): Promise<string[]> {
    return this.cards.locator('div[class*="__category_"]').allTextContents();
  }

  async getUrgentBadgesCount(): Promise<number> {
    return this.cards.getByText("Срочно").count();
  }

  async getThemeToggleAriaLabel(): Promise<string | null> {
    return this.themeToggleButton.getAttribute("aria-label");
  }

  async getThemeToggleTitle(): Promise<string | null> {
     return this.themeToggleButton.getAttribute("title");
  }

  async getThemeToggleText(): Promise<string> {
    return (await this.themeToggleLabel.textContent())?.trim() ?? "";
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggleButton.click();
  }
  
  async getBodyTextColor(): Promise<string> {
    return this.page.locator("body").evaluate((element) => {
        return window.getComputedStyle(element).color;
    });
  }

  async getBodyBackgroundColor(): Promise<string> {
    return this.page.locator("body").evaluate((element) => {
        return window.getComputedStyle(element).backgroundColor;
    });
  }

  async assertAllPricesInRange(min: number, max: number): Promise<void> {
    const prices = await this.getCardPrices();

    for (const price of prices) {
        expect(
        price,
        `После применения фильтра "Диапазон цен" в выдаче осталось объявление с ценой ${price}, которая не входит в диапазон ${min}-${max}`
        ).toBeGreaterThanOrEqual(min);

        expect(
        price,
        `После применения фильтра "Диапазон цен" в выдаче осталось объявление с ценой ${price}, которая не входит в диапазон ${min}-${max}`
        ).toBeLessThanOrEqual(max);
    }
  }

  async assertPricesSortedAsc(): Promise<void> {
    const prices = await this.getCardPrices();
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  }

  async assertAllCardsHaveCategory(expectedCategory: string): Promise<void> {
    const categories = await this.getCardCategories();

    for (const category of categories) {
      expect(category.trim()).toBe(expectedCategory);
    }
  }

  async assertAllCardsAreUrgent(): Promise<void> {
    const cardsCount = await this.getCardsCount();

    for (let i = 0; i < cardsCount; i++) {
        await expect(
        this.cards.nth(i).getByText("Срочно"),
        `После включения тогла "Только срочные" в выдаче осталась карточка без бейджа "Срочно". Индекс карточки: ${i}`
        ).toBeVisible();
    }
  }

  async assertEmptyStateVisible(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
  }
}