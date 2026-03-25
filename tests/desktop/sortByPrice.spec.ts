import { expect, test } from "@playwright/test";
import { ListPage } from "../../pages/listPage";

test.describe("Главная страница — сортировка 'По цене'", () => {
  test("объявления отсортированы по цене по возрастанию", async ({ page }) => {
    const listPage = new ListPage(page);

    await listPage.openListPage();
    await listPage.selectSortBy("price");
    await listPage.selectSortOrder("asc");

    const isEmptyStateVisible = await listPage.isEmptyStateVisible();

    if (isEmptyStateVisible) {
      await listPage.assertEmptyStateVisible();
      await expect(listPage.emptyStateResetButton).toBeVisible();
      return;
    }

    const cardsCount = await listPage.getCardsCount();
    expect(cardsCount).toBeGreaterThan(0);

    await listPage.assertPricesSortedAsc();
  });
});