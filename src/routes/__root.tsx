import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Build in Public Framework — What is your openness actually multiplying?";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          'The framework from the book "Build in Public" by Volodymyr Khomichenko. Answer the book\'s Transparency Audit and see your Base, Coefficient and Sign — in words, the way the book reads every founder.',
      },
      { name: "theme-color", content: "#eef1f5" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://build-in-public-framework.khomichenko.com/" },
      {
        property: "og:image",
        content: "https://build-in-public-framework.vercel.app/og.png",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Build in Public Framework — Base × Coefficient × Sign",
      },
      { name: "twitter:title", content: "Build in Public Framework" },
      {
        name: "twitter:description",
        content:
          "What is your openness actually multiplying? The framework from the book by Volodymyr Khomichenko.",
      },
      { name: "twitter:image", content: "https://build-in-public-framework.vercel.app/og.png" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
