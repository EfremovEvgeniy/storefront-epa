"use client";

import { Container, ErrorBar, useTranslation } from "@uscreentv/react";
import { useSearchParams } from "next/navigation";

/**
 * A refused handoff (no plans configured, unknown product, network failure) sends the viewer back
 * to the page they left with `?handoff_error=refused`. Nothing renders by default; this reads the
 * parameter and tells them, in their language.
 */
export function HandoffNotice() {
  const params = useSearchParams();
  const { t } = useTranslation();

  if (params.get("handoff_error") !== "refused") return null;

  return (
    <Container className="uhodim-notice">
      <ErrorBar>{t("uhodim.handoffRefused")}</ErrorBar>
    </Container>
  );
}
