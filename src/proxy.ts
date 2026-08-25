import { uscreen } from "./uscreen.config";

/**
 * Required by @uscreentv/next: refreshes the session cookie, serves the auth URLs under
 * `/sign_in/auth/*`, and turns the five handoff routes (`/join`, `/checkout/{productId}`,
 * `/account/plan`, `/account/billing`, `/account/settings`) into one-shot redirects to the main
 * Uscreen site. The matcher must let all of those through.
 */
export default uscreen.proxy;

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)",
};
