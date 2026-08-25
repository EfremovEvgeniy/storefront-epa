import { getLocale, setLocale } from "@uscreentv/next";

import { DEFAULT_LOCALE, LOCALES } from "@/i18n/locales";

const LABELS: Record<(typeof LOCALES)[number], string> = { en: "EN", ru: "RU" };

/**
 * Language switcher — a Server Component form on the package's `setLocale` action, so it needs no
 * client JavaScript: the action writes the `locale` cookie and re-renders under the root layout.
 */
export async function LocaleSwitcher({ label }: { label: string }) {
  const current = await getLocale({ locales: LOCALES, defaultLocale: DEFAULT_LOCALE });

  return (
    <form action={setLocale} className="nebula-locale" aria-label={label}>
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="submit"
          name="locale"
          value={locale}
          lang={locale}
          className="nebula-locale__button"
          aria-pressed={current === locale}
        >
          {LABELS[locale]}
        </button>
      ))}
    </form>
  );
}
