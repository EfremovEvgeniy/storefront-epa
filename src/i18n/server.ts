import { getLocale } from "@uscreentv/next";
import { createTranslator } from "@uscreentv/localization";

import { DEFAULT_LOCALE, LOCALES, type AppLocale } from "./locales";
import { messagesFor } from "./messages";

/** The viewer's locale from the package's cookie, restricted to the ones Uhodim ships. */
export function getAppLocale(): Promise<AppLocale> {
  return getLocale({ locales: LOCALES, defaultLocale: DEFAULT_LOCALE });
}

/**
 * A translator for Server Components, where `useTranslation()` cannot run — the same messages the
 * provider hands client components, through `@uscreentv/localization`'s `createTranslator`.
 */
export async function getT() {
  const locale = await getAppLocale();
  return { locale, t: createTranslator(locale, messagesFor(locale)) };
}
