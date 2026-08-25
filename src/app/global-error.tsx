"use client";

import { UscreenErrorPage, type UscreenErrorPageProps } from "@uscreentv/next";

import "@uscreentv/react/themes/theme.css";
import "./nebula.css";

/**
 * Catches what `error.tsx` cannot: a failure in the root layout itself — the header's store read
 * when the API is unreachable or the publishable key is wrong. Renders the package's error page in
 * a bare document, since the layout that would have provided one is what failed.
 */
export default function GlobalError(props: UscreenErrorPageProps) {
  return (
    <html lang="en">
      <body>
        <UscreenErrorPage {...props} />
      </body>
    </html>
  );
}
