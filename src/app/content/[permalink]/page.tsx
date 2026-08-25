import { Content, generateContentMetadata } from "@uscreentv/next";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ permalink: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ permalink }, query] = await Promise.all([params, searchParams]);
  return generateContentMetadata(permalink, {
    parentCollectionId: single(query.parent_collection_id),
  });
}

/**
 * A video, live event or collection. `<Content>` decides what the viewer may see — player and
 * details, or the paywall whose purchase options link each product to the `checkout` handoff (the
 * proxy redirects to the main site's payment page for exactly that product), or the collection's
 * episodes — and renders Watch Next, Related and the comment feed alongside.
 *
 * `?category_id` comes from category rows and orders the Watch Next queue; `?parent_collection_id`
 * from a collection's episode cards and switches to the player + playlist layout.
 */
export default async function ContentPage({ params, searchParams }: Props) {
  const [{ permalink }, query] = await Promise.all([params, searchParams]);

  return (
    <Content
      id={permalink}
      categoryId={single(query.category_id)}
      parentCollectionId={single(query.parent_collection_id)}
      relatedCount={4}
    />
  );
}
