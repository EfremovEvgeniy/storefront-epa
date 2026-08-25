import { UscreenProvider } from "@uscreentv/next";
import type { Metadata } from "next";
import { Suspense } from "react";

import "@uscreentv/react/themes/theme.css";
import "./uhodim.css";

import { HandoffNotice } from "@/components/HandoffNotice";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { messagesFor } from "@/i18n/messages";
import { getAppLocale } from "@/i18n/server";
import { uscreen } from "@/uscreen.config";

function siteUrl(): URL | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercel ? new URL(`https://${vercel}`) : undefined;
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: "Uhodim", template: "%s · Uhodim" },
  description: "Films, series and live shows — all on Uhodim.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getAppLocale();

  return (
    <html lang={locale}>
      <body>
        <UscreenProvider locale={locale} messages={messagesFor(locale)} routes={uscreen.routes}>
          <div className="uhodim-page">
            <SiteHeader />
            <Suspense fallback={null}>
              <HandoffNotice />
            </Suspense>
            <main className="uhodim-page__main">{children}</main>
            <SiteFooter />
          </div>
        </UscreenProvider>
      </body>
    </html>
  );
}
