import { getRoutes, uscreen } from "@uscreentv/next";
import { Container, Heading, LinkButton, Stack, Text } from "@uscreentv/react";

import { getT } from "@/i18n/server";

/**
 * Uhodim's opening band above the catalog. Signed out, the call to action is the `join` handoff —
 * a plain `<a>` (never `next/link`): the proxy answers it with a redirect to the main site, which
 * a client router cannot follow, and a prefetch would spend the one-shot sign-in token.
 */
export async function HomeHero() {
  const { t } = await getT();
  const routes = getRoutes();
  const user = await uscreen.getCurrentUser();

  return (
    <section className="uhodim-hero">
      <Container>
        <Stack gap="lg">
          <span className="uhodim-hero__eyebrow">Uhodim</span>
          <Heading level={1} display maxLineChars={18}>
            {t("uhodim.heroTitle")}
          </Heading>
          <Text variant="large" maxLineChars={60}>
            {t("uhodim.tagline")}
          </Text>
          <div className="uhodim-hero__actions">
            {user ? null : (
              <LinkButton as="a" href={routes.join} variant="primary" size="lg">
                {t("uhodim.heroCta")}
              </LinkButton>
            )}
            <LinkButton href={routes.categories} variant="outline" size="lg">
              {t("uhodim.heroBrowse")}
            </LinkButton>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
