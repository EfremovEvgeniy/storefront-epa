"use server";

import { setLocale } from "@uscreentv/next";

/**
 * The locale switch as an action owned by this app.
 *
 * Why not `action={setLocale}` straight from `@uscreentv/next`, as its README shows? That action is
 * declared with an inline `"use server"` inside a package module that Next also bundles into the
 * client layer (it is reachable from the package's client components), and in that setup its id is
 * rendered into the form but never registered in the server-reference manifest — every submit
 * fails with `UnrecognizedActionError`. An action defined in an app file is registered normally,
 * and it still delegates to the package's `setLocale` (cookie write + layout revalidation).
 */
export async function switchLocale(formData: FormData): Promise<void> {
  await setLocale(formData);
}
