// The whole sign-in flow — passwordless, email/password, forgot and reset password — served by one
// catch-all under the `signIn` route. The URL's segments select the view; `?next=` carries the
// post-sign-in destination. The proxy owns `/sign_in/auth/*` (magic-link verification, logout).
export { LoginPage as default } from "@uscreentv/next";
