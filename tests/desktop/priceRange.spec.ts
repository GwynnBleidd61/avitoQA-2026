import { expect, test } from "@playwright/test";
import { ListPage } from "../../pages/listPage";

test.describe("Главная страница — фильтр 'Диапазон цен'", () => {
  test("отображаются только объявления в заданном диапазоне цен", async ({ page }) => {
    const listPage = new ListPage(page);
    const minPrice = 1000;
    const maxPrice = 50000;

    await listPage.openListPage();
    await listPage.fillPriceRange(String(minPrice), String(maxPrice));

    const isEmptyStateVisible = await listPage.isEmptyStateVisible();

    if (isEmptyStateVisible) {
      await listPage.assertEmptyStateVisible();
      await expect(listPage.emptyStateResetButton).toBeVisible();
      return;
    }

    const cardsCount = await listPage.getCardsCount();
    expect(cardsCount).toBeGreaterThan(0);

    await listPage.assertAllPricesInRange(minPrice, maxPrice);
  });
});