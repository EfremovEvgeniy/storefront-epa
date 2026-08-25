"use client";

import {
  Box,
  CategoryHeader,
  Container,
  ContentGrid,
  Heading,
  LoadMoreFooter,
  PageContent,
  Stack,
  useCategory,
  useFeatureLinks,
  useTranslation,
} from "@uscreentv/react";

import { NebulaCard } from "./NebulaCard";
import { NewBadgeProvider, leadingIds } from "./newBadge";

/** How many items open the page as large tiles before the dense grid takes over. */
const LEAD_COUNT = 2;

/**
 * The category page in NEBULA's own layout — the built-in header, then the first two items as
 * large tiles, then everything else in the dense grid — assembled from the data `useCategory()`
 * publishes and the links `useFeatureLinks()` resolves, so nothing here talks to the API. Paging,
 * the loading placeholders and the retry footer are the feature's own, wired through `list`.
 */
export function NebulaCategoryBody() {
  const { t } = useTranslation();
  const { list, category, orientation, perPage, retry } = useCategory();
  const { categoryContentHref } = useFeatureLinks();

  const lead = list.items.slice(0, LEAD_COUNT);
  const rest = list.items.slice(LEAD_COUNT);
  const empty = list.items.length === 0 && !list.loadingMore;
  const gridHasContent = rest.length > 0 || list.loadingMore;

  return (
    <NewBadgeProvider ids={leadingIds(list.items)}>
      <PageContent>
        <Container>
          <Stack gap="xl">
            <CategoryHeader />

            {lead.length ? (
              <Stack gap="md">
                <Heading level={3} as="h2">
                  {t("nebula.categoryLead")}
                </Heading>
                <Box className="nebula-lead">
                  {lead.map((item) => (
                    <NebulaCard
                      key={item.id}
                      lead
                      content={item}
                      href={categoryContentHref(item, category.permalink)}
                      orientation="horizontal"
                    />
                  ))}
                </Box>
              </Stack>
            ) : null}

            {gridHasContent || empty ? (
              <Stack gap="md">
                {gridHasContent ? (
                  <Heading level={3} as="h2">
                    {t("nebula.categoryMore")}
                  </Heading>
                ) : null}
                {/* With no children the grid renders the localized empty notice itself. */}
                <ContentGrid orientation={orientation}>
                  {rest.map((item) => (
                    <NebulaCard
                      key={item.id}
                      content={item}
                      href={categoryContentHref(item, category.permalink)}
                      orientation={orientation}
                    />
                  ))}
                  {list.loadingMore
                    ? Array.from({ length: perPage }, (_, index) => (
                        <NebulaCard key={`skeleton-${index}`} skeleton orientation={orientation} />
                      ))
                    : null}
                </ContentGrid>
              </Stack>
            ) : null}

            <LoadMoreFooter
              failed={list.failed}
              done={list.done}
              retry={retry}
              sentinelRef={list.sentinelRef}
            />
          </Stack>
        </Container>
      </PageContent>
    </NewBadgeProvider>
  );
}
