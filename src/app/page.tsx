import { Catalog } from "@uscreentv/next";

import { CatalogBody } from "@/components/CatalogBody";
import { HomeHero } from "@/components/HomeHero";
import { NebulaCard } from "@/components/NebulaCard";

/**
 * The browse page: NEBULA's hero band, then the wired `<Catalog>` — featured sliders, continue
 * watching and the category rows, self-fetching and self-paging — with NEBULA's tile as `Card`.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Catalog parts={{ Card: NebulaCard }}>
        <CatalogBody />
      </Catalog>
    </>
  );
}
