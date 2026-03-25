import { test, expect } from "@playwright/test";
import { ListPage } from "../../pages/listPage";

test.describe("Главная страница — фильтр по категории", () => {
  test("отображаются только объявления выбранной категории", async ({ page }) => {
    const listPage = new ListPage(page);
    const expectedCategory = "Транспорт";

    await listPage.openListPage();
    await listPage.selectCategory("2");

    const cardsCount = await listPage.getCardsCount();
    const isEmptyStateVisible = await listPage.isEmptyStateVisible();

    if (isEmptyStateVisible) {
      await listPage.assertEmptyStateVisible();
      await expect(listPage.emptyStateResetButton).toBeVisible();
      return;
    }

    expect(cardsCount).toBeGreaterThan(0);
    await listPage.assertAllCardsHaveCategory(expectedCategory);
  });
});