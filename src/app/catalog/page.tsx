import { categoryHref, getRoutes, uscreen } from "@uscreentv/next";
import { Container, ContentCard, ContentGrid, Heading, PageContent, Stack, Text } from "@uscreentv/react";
import type { Metadata } from "next";

import { getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("nebula.catalogTitle"), description: t("nebula.catalogIntro") };
}

/**
 * The catalog directory: every category as a tile, linking to its page. Data comes from the
 * package's `uscreen` object (`listCategories`, capped at 50 per page by the API), links from the
 * route scheme via `categoryHref`, tiles from `<ContentCard>` spelled out for non-content data.
 */
export default async function CatalogPage() {
  const { t } = await getT();
  const routes = getRoutes();
  // The page's main content: a failure here belongs to error.tsx, not to a silent empty page.
  const { items } = await uscreen.listCategories({ perPage: 50, contentsPerCategory: 1 });

  return (
    <PageContent>
      <Container>
        <Stack gap="xl">
          <Stack gap="sm">
            <Heading level={2} as="h1">
              {t("nebula.catalogTitle")}
            </Heading>
            <Text variant="large" maxLineChars={60}>
              {t("nebula.catalogIntro")}
            </Text>
          </Stack>

          {items.length ? (
            <ContentGrid orientation="horizontal">
              {items.map((category) => (
                <Stack key={category.id} gap="2xs">
                  <ContentCard
                    title={category.title}
                    href={categoryHref(routes, category)}
                    orientation="horizontal"
                    imageUrls={{
                      horizontal:
                        category.imageUrl ?? category.contents.items[0]?.imageUrls.horizontal ?? null,
                    }}
                  />
                  <span className="nebula-category-tile__count">
                    {t("nebula.categoryCount", { count: category.contentCount })}
                  </span>
                </Stack>
              ))}
            </ContentGrid>
          ) : (
            <Text>{t("nebula.catalogEmpty")}</Text>
          )}
        </Stack>
      </Container>
    </PageContent>
  );
}
