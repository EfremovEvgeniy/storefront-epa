import { StoreFooter, getRoutes } from "@uscreentv/next";

import { getT } from "@/i18n/server";

/** The closing line: Uhodim's copyright, two of the app's own pages, and the Uscreen credit. */
export async function SiteFooter() {
  const { t } = await getT();
  const routes = getRoutes();

  return (
    <StoreFooter>
      <StoreFooter.Copyright year={new Date().getFullYear()}>Uhodim</StoreFooter.Copyright>
      <StoreFooter.Link href={routes.categories}>{t("uhodim.footerCatalog")}</StoreFooter.Link>
      <StoreFooter.Link href={routes.search}>{t("uhodim.footerSearch")}</StoreFooter.Link>
      <StoreFooter.PoweredBy />
    </StoreFooter>
  );
}
