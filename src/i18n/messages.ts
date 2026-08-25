import type { PartialMessages } from "@uscreentv/localization";
import ru from "@uscreentv/localization/locales/ru.json";

import type { AppLocale } from "./locales";

/**
 * NEBULA's own strings, under a namespace no component owns. The `en` tree is also the type
 * `t("nebula.…")` is checked against — see `localization.d.ts`.
 */
export const custom = {
  en: {
    nebula: {
      tagline: "Films, series and live shows from the far side of the screen.",
      heroTitle: "Watch beyond the ordinary",
      heroCta: "Start watching",
      heroBrowse: "Browse the catalog",
      nav: { home: "Home", catalog: "Catalog", search: "Search" },
      catalogTitle: "All categories",
      catalogIntro: "Every collection in one place. Pick a category to dive in.",
      catalogEmpty: "No categories yet — check back soon.",
      categoryCount: { one: "{{count}} title", other: "{{count}} titles" },
      categoryLead: "Top picks",
      categoryMore: "Everything else",
      newBadge: "NEW",
      language: "Language",
      searchTitle: "Search NEBULA",
      searchIntro: "Find a film, a series or a live show by name.",
      footerCatalog: "Catalog",
      footerSearch: "Search",
      handoffRefused:
        "We couldn't open the checkout page right now. Please try again in a moment.",
    },
  },
  ru: {
    nebula: {
      tagline: "Фильмы, сериалы и прямые эфиры с другой стороны экрана.",
      heroTitle: "Смотрите за пределами обычного",
      heroCta: "Начать смотреть",
      heroBrowse: "Открыть каталог",
      nav: { home: "Главная", catalog: "Каталог", search: "Поиск" },
      catalogTitle: "Все категории",
      catalogIntro: "Все подборки в одном месте. Выберите категорию, чтобы начать.",
      catalogEmpty: "Категорий пока нет — загляните позже.",
      categoryCount: {
        one: "{{count}} видео",
        few: "{{count}} видео",
        many: "{{count}} видео",
        other: "{{count}} видео",
      },
      categoryLead: "Главное",
      categoryMore: "Всё остальное",
      newBadge: "NEW",
      language: "Язык",
      searchTitle: "Поиск по NEBULA",
      searchIntro: "Найдите фильм, сериал или эфир по названию.",
      footerCatalog: "Каталог",
      footerSearch: "Поиск",
      handoffRefused:
        "Не удалось открыть страницу оплаты. Попробуйте ещё раз через минуту.",
    },
  },
} as const;

/** Built-in strings NEBULA replaces, per locale. Keys not listed keep the package defaults. */
const overrides: Record<AppLocale, PartialMessages> = {
  en: {
    search: { noResults: "Nothing in the nebula matches that. Try another title." },
    storeHeader: { join: "Join NEBULA" },
    content: { subscribe: "Unlock with NEBULA" },
    contentGrid: { empty: "Nothing has landed in this category yet." },
    catalog: { continueWatching: "Jump back in" },
  },
  ru: {
    search: { noResults: "В туманности ничего не нашлось. Попробуйте другое название." },
    storeHeader: { join: "Вступить в NEBULA" },
    content: { subscribe: "Открыть с NEBULA" },
    contentGrid: { empty: "В этой категории пока ничего не приземлилось." },
    catalog: { continueWatching: "Вернуться к просмотру" },
  },
};

type Tree = { [key: string]: unknown };

function isTree(value: unknown): value is Tree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Recursive merge of message trees; the later argument wins at the leaves. */
function merge(...trees: Tree[]): Tree {
  const out: Tree = {};
  for (const tree of trees) {
    for (const [key, value] of Object.entries(tree)) {
      const existing = out[key];
      out[key] = isTree(existing) && isTree(value) ? merge(existing, value) : value;
    }
  }
  return out;
}

/**
 * One stable messages object per locale, built once at module scope — `<UscreenProvider messages>`
 * memoizes on the reference, so an object built during render would re-render every consumer.
 * English needs no base: any key omitted falls back to the built-in English.
 */
const MESSAGES: Record<AppLocale, PartialMessages> = {
  en: merge(overrides.en as Tree, custom.en) as PartialMessages,
  ru: merge(ru as Tree, overrides.ru as Tree, custom.ru) as PartialMessages,
};

export function messagesFor(locale: AppLocale): PartialMessages {
  return MESSAGES[locale];
}
