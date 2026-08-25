import { LoginPage, type LoginPageProps } from "@uscreentv/next";
import { Box } from "@uscreentv/react";

/**
 * The whole sign-in flow — passwordless, email/password, forgot and reset password — served by one
 * catch-all under the `signIn` route. The URL's segments select the view; `?next=` carries the
 * post-sign-in destination. The proxy owns `/sign_in/auth/*` (magic-link verification, logout).
 *
 * Where the card sits is its wrapper's job (docs: components expose no placement properties), so a
 * `Box` of ours centres it on the page.
 */
export default function SignInPage(props: LoginPageProps) {
  return (
    <Box className="nebula-auth">
      <LoginPage {...props} />
    </Box>
  );
}
