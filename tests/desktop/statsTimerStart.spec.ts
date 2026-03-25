import { expect, test } from "@playwright/test";
import { ListPage } from "../../pages/listPage";
import { StatsPage } from "../../pages/statsPage";

test.describe("Страница статистики — запуск таймера", () => {
  test("кнопка запуска возвращает автообновление в активное состояние", async ({ page }) => {
    const listPage = new ListPage(page);
    const statsPage = new StatsPage(page);

    await listPage.openListPage();
    await listPage.openStatsPageFromHeader();
    await statsPage.waitForStatsPageOpen();

    await statsPage.clickTimerToggle();
    await statsPage.assertAutoRefreshDisabled();

    await statsPage.clickTimerToggle();

    const ariaLabelAfterStartAttempt = await statsPage.getTimerToggleAriaLabel();

    expect(
      ariaLabelAfterStartAttempt,
      'После нажатия кнопки запуска автообновление не перешло в активное состояние'
    ).toBe("Отключить автообновление");

    await statsPage.assertTimerRunningState();
  });
});