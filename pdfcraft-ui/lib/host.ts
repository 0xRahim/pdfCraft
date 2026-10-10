/**
 * True when the app is served from a *.vercel.app host (preview/demo
 * deployments). The landing page hides its app-entry CTAs there because
 * those deployments are landing-only (no API backend attached).
 */
export function isVercelHost(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.includes("vercel.app");
}
