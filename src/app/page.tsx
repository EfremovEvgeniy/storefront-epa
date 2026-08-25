import { Catalog } from "@uscreentv/next";

import { CatalogBody } from "@/components/CatalogBody";
import { HomeHero } from "@/components/HomeHero";
import { UhodimCard } from "@/components/UhodimCard";

/**
 * The browse page: Uhodim's hero band, then the wired `<Catalog>` — featured sliders, continue
 * watching and the category rows, self-fetching and self-paging — with Uhodim's tile as `Card`.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Catalog parts={{ Card: UhodimCard }}>
        <CatalogBody />
      </Catalog>
    </>
  );
}
