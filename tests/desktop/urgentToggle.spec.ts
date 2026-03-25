import { expect, test } from "@playwright/test";
import { ListPage } from "../../pages/listPage";

test.describe("Главная страница — тогл 'Только срочные'", () => {
  test("отображаются только срочные объявления", async ({ page }) => {
    const listPage = new ListPage(page);

    await listPage.openListPage();
    await listPage.enableUrgentOnly();

    const isEmptyStateVisible = await listPage.isEmptyStateVisible();

    if (isEmptyStateVisible) {
      await listPage.assertEmptyStateVisible();
      await expect(listPage.emptyStateResetButton).toBeVisible();
      return;
    }

    const cardsCount = await listPage.getCardsCount();
    expect(cardsCount).toBeGreaterThan(0);

    await listPage.assertAllCardsAreUrgent();
  });
});