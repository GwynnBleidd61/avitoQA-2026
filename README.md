# avitoQA-2026

Автотесты на Playwright для задания 2.2 по UI платформы модерации объявлений.

## Что есть в репозитории

* `TESTCASES.md` — тест-кейсы по заданию
* `BUGS.md` — найденные баги
* `pages/` — Page Object'ы
* `helpers/` — вспомогательные функции
* `tests/desktop/` — desktop-сценарии
* `tests/mobile/` — mobile-сценарии

## Стек

* Node.js
* TypeScript
* Playwright
* ESLint

## Установка

Установить зависимости:

```bash
npm install
```

Установить браузеры Playwright:

```bash
npx playwright install
```

## Запуск тестов

Запустить все тесты:

```bash
npx playwright test
```

Запустить только desktop-тесты:

```bash
npx playwright test tests/desktop
```

Запустить только mobile-тесты:

```bash
npx playwright test tests/mobile
```

Запустить конкретный тестовый файл:

```bash
npx playwright test tests/desktop/categoryFilter.spec.ts
```

## HTML-отчёт

Открыть отчёт после прогона:

```bash
npx playwright show-report
```

## Линтер

Проверить проект линтером:

```bash
npx eslint .
```

## Примечания

* Для страницы статистики используется переход через UI, так как прямой переход по URL `/stats` приводит к ошибке `404 Page not found`.
* Часть автотестов падает из-за найденных дефектов приложения. Эти баги зафиксированы в `BUGS.md`.
