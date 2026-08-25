import { configureUscreen } from "@uscreentv/next/config";

/**
 * The store's URL scheme, declared once. Every link the packages render — cards, header items,
 * paywall buttons — comes from here, and the proxy serves the handoff routes (`join`, `checkout`,
 * `changePlan`, `billing`, `settings`) at their defaults, so nothing here may collide with them.
 *
 * `catalog` stays at the site root (the browse page); `categories` and `search` are this app's own
 * pages, typed onto `ResolvedRoutes` below so `getRoutes()` / `useRoutes()` know them.
 */
export const uscreen = configureUscreen({
  routes: {
    catalog: "/",
    content: "/content/{permalink}",
    category: "/category/{permalink}",
    categories: "/catalog",
    search: "/search",
  },
  // Vercel sends the viewer's IANA zone on every request, so the first render is already in it.
  timeZoneHeader: "x-vercel-ip-timezone",
});

declare module "@uscreentv/next" {
  // Declaration merging, as @uscreentv/next documents it for the app's own route keys.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ResolvedRoutes extends Record<keyof typeof uscreen.routes, string> {}
}
