import { getLocale } from "@uscreentv/next";

import { switchLocale } from "@/i18n/actions";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/locales";

const LABELS: Record<(typeof LOCALES)[number], string> = { en: "EN", ru: "RU" };

/**
 * Language switcher — a Server Component form, so it needs no client JavaScript. The action is the
 * app's own `switchLocale` (see `src/i18n/actions.ts` for why not the package's `setLocale` directly);
 * it writes the `locale` cookie and re-renders under the root layout.
 */
export async function LocaleSwitcher({ label }: { label: string }) {
  const current = await getLocale({ locales: LOCALES, defaultLocale: DEFAULT_LOCALE });

  return (
    <form action={switchLocale} className="uhodim-locale" aria-label={label}>
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="submit"
          name="locale"
          value={locale}
          lang={locale}
          className="uhodim-locale__button"
          aria-pressed={current === locale}
        >
          {LABELS[locale]}
        </button>
      ))}
    </form>
  );
}
