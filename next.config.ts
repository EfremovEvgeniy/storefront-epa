import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No `headers()` with Referrer-Policy: no-referrer — the handoff routes send the viewer back via
  // the Referer when no `return` param is given (see @uscreentv/next README → Handoffs).
};

export default nextConfig;
