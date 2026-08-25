"use client";

import { CatalogCurrentView, useCatalog } from "@uscreentv/react";
import { useMemo } from "react";

import { NewBadgeProvider, leadingIds } from "./newBadge";

/**
 * The default catalog body, with the NEW-badge rule published to its tiles: the leading items of
 * each row are flagged. `CatalogCurrentView` keeps the shipped composition — heroes, continue
 * watching, rows and their paging — untouched.
 */
export function CatalogBody() {
  const { list } = useCatalog();
  const ids = useMemo(
    () => list.items.flatMap((category) => leadingIds(category.contents.items)),
    [list.items],
  );

  return (
    <NewBadgeProvider ids={ids}>
      <CatalogCurrentView />
    </NewBadgeProvider>
  );
}
