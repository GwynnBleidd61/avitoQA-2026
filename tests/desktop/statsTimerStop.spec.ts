import { expect, test } from "@playwright/test";
import { ListPage } from "../../pages/listPage";
import { StatsPage } from "../../pages/statsPage";

test.describe("Страница статистики — остановка таймера", () => {
  test("кнопка остановки переводит автообновление в выключенное состояние", async ({ page }) => {
    const listPage = new ListPage(page);
    const statsPage = new StatsPage(page);

    await listPage.openListPage();
    await listPage.openStatsPageFromHeader();
    await statsPage.waitForStatsPageOpen();

    const initialAriaLabel = await statsPage.getTimerToggleAriaLabel();
    expect(initialAriaLabel).toBe("Отключить автообновление");

    await statsPage.clickTimerToggle();

    const toggledAriaLabel = await statsPage.getTimerToggleAriaLabel();

    expect(
      toggledAriaLabel,
      "После нажатия кнопки остановки таймера aria-label не изменился на состояние включения автообновления"
    ).toBe("Включить автообновление");

    await statsPage.assertAutoRefreshDisabled();
  });
});