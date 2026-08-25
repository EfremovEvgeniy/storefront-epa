import { Category, generateCategoryMetadata } from "@uscreentv/next";
import type { Metadata } from "next";

import { NebulaCard } from "@/components/NebulaCard";
import { NebulaCategoryBody } from "@/components/NebulaCategoryBody";

type Props = { params: Promise<{ permalink: string }> };

/** Matches the page's `<Category perPage>`, so both reads share one request. */
const PER_PAGE = 12;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { permalink } = await params;
  return generateCategoryMetadata(permalink, { perPage: PER_PAGE });
}

/**
 * One category in NEBULA's own layout. The wired `<Category>` still fetches, pages, maps an unknown
 * id to `notFound()` and contains failures; `children` replace only the body, composed client-side
 * from `useCategory()` — see NebulaCategoryBody.
 */
export default async function CategoryPage({ params }: Props) {
  const { permalink } = await params;

  return (
    <Category id={permalink} perPage={PER_PAGE} parts={{ Card: NebulaCard }}>
      <NebulaCategoryBody />
    </Category>
  );
}
