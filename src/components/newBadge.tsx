"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

/**
 * Which items carry the NEW badge.
 *
 * Documented gap: the Headless API's `ContentSummary` exposes no publish/creation date (only
 * `launchesAt` for coming-soon videos), so "fresh content" cannot be derived from the item itself.
 * The nearest honest rule is positional — the first `NEW_PER_LIST` items of a list, in the order
 * the store curates it — and the list decides, not the card. A body that knows its list publishes
 * the ids here; a card outside any provider shows no badge.
 */
export const NEW_PER_LIST = 3;

const NewBadgeContext = createContext<ReadonlySet<string> | null>(null);

export function NewBadgeProvider({ ids, children }: { ids: readonly string[]; children: ReactNode }) {
  const set = useMemo(() => new Set(ids), [ids]);
  return <NewBadgeContext value={set}>{children}</NewBadgeContext>;
}

export function useIsNew(id: string): boolean {
  return useContext(NewBadgeContext)?.has(id) ?? false;
}

/** The first `NEW_PER_LIST` ids of a list — the one rule, so every list applies the same one. */
export function leadingIds<T extends { id: string }>(items: readonly T[]): string[] {
  return items.slice(0, NEW_PER_LIST).map((item) => item.id);
}
