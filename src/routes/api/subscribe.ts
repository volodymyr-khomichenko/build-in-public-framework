import { createFileRoute } from "@tanstack/react-router";

/**
 * MailerLite subscribe. Stays unused while the page runs in demo mode
 * (SUBSCRIBE_ENDPOINT is empty). To go live:
 * 1. Set MAILERLITE_API_KEY and MAILERLITE_GROUP_ID in the host environment.
 * 2. Set SUBSCRIBE_ENDPOINT to "/api/subscribe" in src/lib/framework.ts.
 * Field keys (archetype, outcome, base, coefficient, sign) must exist in MailerLite.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Route = createFileRoute("/api/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const email = String(body.email ?? "").trim();
        if (!EMAIL.test(email) || body.consent !== true) {
          return Response.json(
            { error: "A valid email and consent are required." },
            { status: 400 },
          );
        }
        const key = process.env.MAILERLITE_API_KEY;
        const group = process.env.MAILERLITE_GROUP_ID;
        if (!key || !group) {
          return Response.json({ error: "MailerLite is not configured." }, { status: 503 });
        }
        const fields = {
          archetype: String(body.archetype ?? ""),
          outcome: String(body.outcome ?? ""),
          base: String(body.base ?? ""),
          coefficient: String(body.coefficient ?? ""),
          sign: String(body.sign ?? ""),
        };
        const upstream = await fetch("https://connect.mailerlite.com/api/subscribers", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, groups: [group], fields }),
        });
        if (!upstream.ok) {
          return Response.json({ error: "MailerLite rejected the request." }, { status: 502 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});
