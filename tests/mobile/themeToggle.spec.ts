import { expect, test } from "@playwright/test";
import { ListPage } from "../../pages/listPage";

test.describe("Мобильная версия — переключение темы", () => {
  test.use({
    viewport: { width: 390, height: 844 },
  });

  test("тема переключается между тёмной и светлой и возвращается в исходное состояние", async ({ page }) => {
    const listPage = new ListPage(page);

    await listPage.openListPage();

    const initialAriaLabel = await listPage.getThemeToggleAriaLabel();
    const initialTitle = await listPage.getThemeToggleTitle();
    const initialText = await listPage.getThemeToggleText();

    await listPage.toggleTheme();

    const toggledAriaLabel = await listPage.getThemeToggleAriaLabel();
    const toggledTitle = await listPage.getThemeToggleTitle();
    const toggledText = await listPage.getThemeToggleText();

    expect(
      toggledAriaLabel,
      "После первого переключения aria-label кнопки темы не изменился"
    ).not.toBe(initialAriaLabel);

    expect(
      toggledTitle,
      "После первого переключения title кнопки темы не изменился"
    ).not.toBe(initialTitle);

    expect(
      toggledText,
      "После первого переключения текст кнопки темы не изменился"
    ).not.toBe(initialText);

    await listPage.toggleTheme();

    const revertedAriaLabel = await listPage.getThemeToggleAriaLabel();
    const revertedTitle = await listPage.getThemeToggleTitle();
    const revertedText = await listPage.getThemeToggleText();

    expect(
      revertedAriaLabel,
      "После второго переключения aria-label не вернулся в исходное состояние"
    ).toBe(initialAriaLabel);

    expect(
      revertedTitle,
      "После второго переключения title не вернулся в исходное состояние"
    ).toBe(initialTitle);

    expect(
      revertedText,
      "После второго переключения текст кнопки не вернулся в исходное состояние"
    ).toBe(initialText);
  });
});