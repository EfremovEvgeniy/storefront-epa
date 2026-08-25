import { Search, StoreHeader, getRoutes } from "@uscreentv/next";

import { getT } from "@/i18n/server";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { Wordmark } from "./Wordmark";

/**
 * The store's top bar, composed from `@uscreentv/next`'s `<StoreHeader>` members. Every ready-made
 * item resolves its own route and label: the auth buttons lead to `signIn` / `join`, the account
 * menu to `changePlan` / `billing` / `settings` — the last four are handoffs the proxy redirects to
 * the main Uscreen site with the session carried over — and the logout item to the proxy's logout
 * URL. `children` replace the default header, so what is kept is written back here.
 */
export async function SiteHeader() {
  const { t } = await getT();
  const routes = getRoutes();

  return (
    <StoreHeader>
      <StoreHeader.Brand aria-label="Uhodim">
        <Wordmark />
      </StoreHeader.Brand>

      <StoreHeader.Nav>
        <StoreHeader.NavLink href={routes.catalog}>{t("uhodim.nav.home")}</StoreHeader.NavLink>
        <StoreHeader.NavLink href={routes.categories}>{t("uhodim.nav.catalog")}</StoreHeader.NavLink>
        <StoreHeader.NavLink href={routes.search}>{t("uhodim.nav.search")}</StoreHeader.NavLink>
      </StoreHeader.Nav>

      <StoreHeader.Actions>
        <StoreHeader.Action>
          <Search perPage={20} />
        </StoreHeader.Action>
        <StoreHeader.Action movesToPanel>
          <LocaleSwitcher label={t("uhodim.language")} />
        </StoreHeader.Action>
        <StoreHeader.SignInButton />
        <StoreHeader.JoinButton />
        <StoreHeader.Account>
          <StoreHeader.ChangePlanLink />
          <StoreHeader.BillingLink />
          <StoreHeader.SettingsLink />
          <StoreHeader.Separator />
          <StoreHeader.LogoutLink />
        </StoreHeader.Account>
      </StoreHeader.Actions>
    </StoreHeader>
  );
}
