import { Search } from "@uscreentv/next";
import { Container, Heading, PageContent, SearchCurrentView, SearchHeader, Stack, Text } from "@uscreentv/react";
import type { Metadata } from "next";

import { getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("nebula.searchTitle"), description: t("nebula.searchIntro") };
}

/**
 * Search as a page rather than a header dialog. `children` on the wired `<Search>` replaces the
 * dialog wholesale while the fetching, the debounce, the request ordering and the error containment
 * stay the package's (see @uscreentv/next docs/Search.md). The parts are react's flat exports, which
 * are safe to reference from a Server Component.
 */
export default async function SearchPage() {
  const { t } = await getT();

  return (
    <PageContent>
      <Container>
        <Stack gap="xl">
          <Stack gap="sm">
            <Heading level={2} as="h1">
              {t("nebula.searchTitle")}
            </Heading>
            <Text variant="large" maxLineChars={60}>
              {t("nebula.searchIntro")}
            </Text>
          </Stack>
          <Search perPage={24}>
            <SearchHeader />
            <SearchCurrentView />
          </Search>
        </Stack>
      </Container>
    </PageContent>
  );
}
