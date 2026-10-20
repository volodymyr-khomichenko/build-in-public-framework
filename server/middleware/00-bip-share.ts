/**
 * Puts the scorecard share tags back after the platform head injector strips them.
 * Does not remove the Grok extensions script or the preview bridge.
 */
import { ensureShareMeta } from "../../scripts/bip-share-meta.mjs";

interface ShareEvent {
  req: { method: string; headers: Headers };
  url: URL;
}

export default async function bipShareMeta(
  event: ShareEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const response = await next();
  if (!(response instanceof Response)) return response;
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html") || !response.body) return response;
  const html = ensureShareMeta(await response.text());
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
