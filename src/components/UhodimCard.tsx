"use client";

import {
  AuthorList,
  Box,
  ContentCard,
  ContentCardSkeleton,
  isSkeletonItem,
  useCardAppearance,
  useTranslation,
  type CategoryCardProps,
} from "@uscreentv/react";

import { useIsNew } from "./newBadge";

export type UhodimCardProps = CategoryCardProps & {
  /** A large lead tile: details drawn over the artwork, description included. */
  lead?: boolean;
};

/**
 * Uhodim's tile, handed to `<Catalog parts>` / `<Category parts>` as `Card` and rendered by the
 * category body's own grids. It composes the library's card — link, artwork, the duration / episode
 * badge on the poster, the lock and the resume progress all stay — and adds what the standard one
 * lacks: a NEW chip on fresh items and the authors under the title.
 *
 * A tile part is also handed `{ skeleton: true }` while a further page loads, so it draws its own
 * placeholder — that is what keeps the grid's pagination and loading states working once the tile is
 * ours. `useCardAppearance()` follows the store-wide card look the way the built-in tile does, so
 * the same component serves the catalog rows and the category grid alike.
 */
export function UhodimCard(props: UhodimCardProps) {
  const { t } = useTranslation();
  const appearance = useCardAppearance();
  const isNew = useIsNew(isSkeletonItem(props) ? "" : props.content.id);

  if (isSkeletonItem(props)) {
    return <ContentCardSkeleton orientation={props.orientation} />;
  }

  const { lead, content, ...cardProps } = props;
  const authors = content.authors ?? [];

  return (
    <Box className="uhodim-card">
      {isNew ? <span className="uhodim-card__new">{t("uhodim.newBadge")}</span> : null}
      {lead ? (
        <ContentCard {...cardProps} content={content} detailsPlacement="inside" detailed />
      ) : (
        <ContentCard {...cardProps} {...appearance} content={content} />
      )}
      {!lead && authors.length ? (
        <AuthorList className="uhodim-card__authors" authors={authors} size="sm" max={2} />
      ) : null}
    </Box>
  );
}
