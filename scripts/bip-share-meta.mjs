/** Re-applied after the platform head injector, which strips these keys. */
export const SHARE_SNIPPET = [
  '<meta property="og:type" content="website">',
  '<meta property="og:url" content="https://build-in-public-framework.khomichenko.com/">',
  '<meta property="og:image" content="https://build-in-public-framework.vercel.app/og.png">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  '<meta property="og:image:alt" content="Build in Public Framework — Base × Coefficient × Sign">',
  '<meta name="twitter:title" content="Build in Public Framework">',
  '<meta name="twitter:description" content="What is your openness actually multiplying? The framework from the book by Volodymyr Khomichenko.">',
  '<meta name="twitter:image" content="https://build-in-public-framework.vercel.app/og.png">',
].join("");

const DROP =
  /<meta\b[^>]*\b(?:property|name)\s*=\s*["'](?:og:image(?::(?:width|height|alt))?|og:type|og:url|twitter:title|twitter:description|twitter:image)["'][^>]*>/gi;

/** @param {string} html */
export function ensureShareMeta(html) {
  if (typeof html !== "string" || !html.includes("</head>")) return html;
  const stripped = html.replace(DROP, "");
  if (stripped.includes("https://build-in-public-framework.vercel.app/og.png")) return stripped;
  return stripped.replace("</head>", `${SHARE_SNIPPET}</head>`);
}
