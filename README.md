# Uhodim — storefront on Uscreen Headless SDK

A Next.js (App Router) video storefront built on the official Uscreen Headless packages
`@uscreentv/next`, `@uscreentv/react`, `@uscreentv/sdk` (+ `@uscreentv/localization` for the `ru`
locale file), all pinned to exactly `0.3.0-beta.0`. Node `24.11.0` (`.node-version`, `engines`).

## Run locally

Requirements: Node **24.11.0** (`.node-version` — `nvm use` / `fnm use` picks it up), npm.

```bash
git clone <repo> && cd storefront-demo
nvm use                       # or: fnm use — activates 24.11.0
npm install                   # packages are pinned to exact versions in package.json
cp .env.example .env.local    # then paste your key (see below)
npm run dev                   # http://localhost:3002 (port 3000 is left to a local Uscreen API)
```

`.env.local`:

```env
USCREEN_PUBLISHABLE_KEY=usc_pub_live_…
```

Take the key from Uscreen → **Settings → Headless API**. With a wrong or missing key every page
shows the error page (`UscreenApiError: Missing store` / `UscreenConfigError`) — that is the only
thing that can go wrong on first run.

### Against a local Uscreen (rails)

With the Uscreen monolith running on `uscreen.localhost:3000`, point the SDK at it instead of
production and use the publishable key of a local store:

```env
USCREEN_PUBLISHABLE_KEY=usc_pub_live_…            # local store → Settings → Headless API
USCREEN_API_URL=http://uscreen.localhost:3000/api/headless/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3002
```

`npm run dev` / `npm start` bind to **3002** so they never collide with the API on 3000. Handoffs
(`/join`, `/checkout/…`, `/account/*`) then `307` to `http://<store>.uscreen.localhost:3000/…`.
Quick check that the key/API pair is right, before starting Next:

```bash
curl -H "X-Uscreen-Publishable-Key: $USCREEN_PUBLISHABLE_KEY" http://uscreen.localhost:3000/api/headless/v1/store
```

Other scripts: `npm run build` + `npm start` (production build), `npm run typecheck`,
`npm run lint`.

## Deploy to Vercel

1. Import the repository into Vercel (framework preset: Next.js, defaults are fine; Node version is
   read from `engines` → 24.x).
2. **Project → Settings → Environment Variables** — add for Production (and Preview if you use it):

   | Variable                  | Required | Value                                                                                                                  |
   | ------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
   | `USCREEN_PUBLISHABLE_KEY` | **yes**  | `usc_pub_live_…` from Uscreen → Settings → Headless API                                                                |
   | `USCREEN_API_URL`         | no       | Only to point at a non-production Uscreen API; leave unset for production                                              |
   | `NEXT_PUBLIC_SITE_URL`    | no       | Canonical origin for `og:url` / canonical links, e.g. `https://uhodim.example.com`. Unset, it falls back to Vercel's `VERCEL_PROJECT_PRODUCTION_URL` (set automatically) |

   `VERCEL_PROJECT_PRODUCTION_URL` and `x-vercel-ip-timezone` (the viewer's time zone header used
   in `uscreen.config.ts`) are provided by Vercel itself — nothing to add.
3. In Uscreen → Settings → Headless API add the deployed origin (`https://<project>.vercel.app` and
   your custom domain) to the key's **allowed origins**. Without it every handoff (Join, checkout,
   plan/billing/settings) fails by design with `UscreenConfigError`.
4. Deploy. No `vercel.json` or custom headers are needed; in particular do **not** add
   `Referrer-Policy: no-referrer` — handoffs return the viewer through the `Referer`.

## Pages & routes

| Page                          | File                                  | Mechanism                                                                      |
| ----------------------------- | ------------------------------------- | ------------------------------------------------------------------------------ |
| Home `/`                      | `src/app/page.tsx`                    | own hero band + wired `<Catalog>` (featured sliders, continue watching, rows) |
| Catalog `/catalog`            | `src/app/catalog/page.tsx`            | category directory via `uscreen.listCategories()` + `<ContentCard>` tiles      |
| Category `/category/{slug}`   | `src/app/category/[permalink]/`       | wired `<Category>` with a custom body (see below)                              |
| Content `/content/{slug}`     | `src/app/content/[permalink]/`        | wired `<Content>`: player / paywall / collection, Watch Next, Related, comments |
| Search `/search`              | `src/app/search/page.tsx`             | wired `<Search>` inline (`children` replaces the dialog, loaders stay)         |
| Sign in `/sign_in/*`          | `src/app/sign_in/[[...view]]/`        | `LoginPage` re-export — all four views                                          |
| 404 / error                   | `not-found.tsx`, `error.tsx`, `global-error.tsx` | `NotFoundPage`, `UscreenErrorPage`                                  |

Handoffs (`/join`, `/checkout/{productId}`, `/account/plan`, `/account/billing`,
`/account/settings`) and the auth URLs (`/sign_in/auth/*`) are **served by the proxy**
(`src/proxy.ts`), not by app routes — no page of this app lives at those paths, and the matcher
lets them through. Verified locally: each answers `307` to the main site (with a placeholder key the
mint is refused and the viewer is bounced back with `?handoff_error=refused`, which `HandoffNotice`
renders as an `ErrorBar`).

---

## Report

### What was done with the packages' own mechanisms

- **Brand / dark theme** — `src/app/uhodim.css`, loaded after `theme.css`: `color-scheme: dark`
  pins the scheme, every colour is a `light-dark()` pair, surfaces `#0B0F1A` / `#141B2E`, primary
  fill `#7CFF6B` (with its `-hover`/`-active` and `content-inverted` partner named, as
  `theming.md` insists), second accent `#FF3D81` on focus ring, references, avatar accent and
  highlight; radii 1–6px; the whole `--utv-text-*` scale one step larger, with the narrow-screen
  block mirrored. Per-component **handles** for the card radius, button radius, header height and
  border, and the featured-slider radius. No package file touched, no `!important`, no
  descendant selectors into package markup — Uhodim's own elements are styled by their own single
  classes using theme tokens only.
- **Custom card** — `UhodimCard` passed as `parts={{ Card }}` to both `<Catalog>` and
  `<Category>`. It composes the library `<ContentCard>` (link, artwork, the duration/episode badge on
  the poster, lock, resume progress) following the store-wide look via `useCardAppearance()`, adds a
  NEW chip and an `<AuthorList>` under the title, and draws `<ContentCardSkeleton>` when handed
  `{ skeleton: true }` — so the grid's paging, loading placeholders and retry footer keep working.
- **Category page in its own layout** — `<Category>` keeps fetching, paging, `notFound()` and the
  error boundary; `children` is `UhodimCategoryBody` (client), composed from `useCategory()`,
  `useFeatureLinks().categoryContentHref`, `CategoryHeader`, `ContentGrid`, `LoadMoreFooter`: first
  two items as large tiles with details over the artwork, then the dense grid. No direct API calls.
- **Localization** — `en` + `ru`, switcher as a Server Component form on the package's
  `setLocale` action; `<UscreenProvider locale messages>` gets a module-scope (stable) merged
  tree per locale; own strings under a `uhodim` namespace, type-checked through `CustomMessages`
  declaration merging; replaced built-ins on both languages: `search.noResults`, `storeHeader.join`,
  `content.subscribe`, `contentGrid.empty`, `catalog.continueWatching`. Server Components translate
  through `createTranslator` from `@uscreentv/localization`.
- **Header / footer / account** — `<StoreHeader>` members: `Brand`, `Nav`/`NavLink` (auto-active),
  `Actions` with the wired `<Search>`, the locale switcher (`movesToPanel`), `SignInButton`,
  `JoinButton`, `Account` with `ChangePlanLink`/`BillingLink`/`SettingsLink`/`LogoutLink`. Every
  handoff renders the package's plain `<a>`; the hero's own Join CTA is `<LinkButton as="a">` for
  the same reason (no `next/link` prefetch on a one-shot URL).
- **Metadata** — `generateCategoryMetadata` / `generateContentMetadata`, sharing the page's
  `perPage` / `parentCollectionId` so the reads dedupe.

### Where the documentation ran out

1. **"Fresh content" has no data.** `ContentSummary` carries no publish/creation date — only
   `launchesAt` for coming-soon videos. There is no documented signal for "new". **Workaround:** a
   positional rule — the first `NEW_PER_LIST` (3) items of a list, in the store's curated order —
   owned by the list, not the card (`NewBadgeProvider` / `useIsNew` in `src/components/newBadge.tsx`).
   Flagged in code as a gap; swap the rule the day the API exposes a date.
2. **Importing `@uscreentv/next` from a client module breaks the build** (`"use server"` inside a
   module pulled into the client bundle). The docs do say a `children` body "must be assembled in a
   client module", and react's examples import the namespace from `@uscreentv/react` — but the next
   README's line "the wired root carries the react namespace, so `Catalog.Rows` … need no second
   import" reads as if `Catalog.*` from `@uscreentv/next` were usable there. It is not, from a client
   file. **Workaround:** client bodies import flat parts (`CategoryHeader`, `CatalogCurrentView`,
   `SearchHeader`, `SearchCurrentView`) from `@uscreentv/react`.
3. **`getLocale` is the only way to know the language server-side**, and there is no server-side
   `t` in `@uscreentv/next`; the header/footer/hero are Server Components. Not a gap so much as an
   omission — `createTranslator` from `@uscreentv/localization` covers it (`src/i18n/server.ts`).
4. **`<UscreenProvider locale="ru">` does not load `ru.json` itself** — the next README's prop
   table implies `locale` alone switches the UI; in fact `messages` must carry the locale file
   (react's README makes this explicit). Handled by merging `ru.json` with the overrides.
5. **`setLocale` from `@uscreentv/next` cannot be used as a form action directly.** The README's
   locale-switcher example (`<form action={setLocale}>`) renders an action id that is never
   registered in the server-reference manifest — the package module carrying the inline
   `"use server"` is also bundled into the client layer — so every submit fails with
   `UnrecognizedActionError`. **Workaround:** an app-owned action (`src/i18n/actions.ts`,
   `"use server"` at file level) that delegates to the package's `setLocale`.
6. **`CategoryDetailData` (react) drops `contentCount`**, so a "N titles" counter on the category
   page could only come from an untyped field; left out there, shown on the catalog directory where
   the SDK type has it.

### Impressions of the API

Pleasant: the customization ladder (token → handle → key → `disable` → `parts` → `views` →
`children`) is real — every requirement mapped to a rung, and the docs are honest about what a
`className` cannot do. Handoffs are the standout: five route keys, the proxy does the rest, the
`return` / `coupon` / `handoff_error` contract is small and testable. The "same name inside its
replacement renders the built-in" pattern and `isSkeletonItem` made the custom tile trivial.
The API translating even its error messages by the forwarded locale was a nice surprise.

Unexpected: the RSC boundary is the sharp edge — which package a client file may import is the
thing you learn from a build error, not from the table of contents; `color-scheme` (not a class or
prop) is how you pick dark mode; hover/active fills don't derive from the base colour; and the
category `Card` part receives `orientation` while the catalog's does not, so one tile type for
both needs the union type by hand.
