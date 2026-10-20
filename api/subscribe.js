/**
 * Vercel Node function for the scorecard email.
 * Demo mode does not call this: SUBSCRIBE_ENDPOINT stays "" until MailerLite is set.
 * The key is read from the environment and never returned.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const email = String(body.email ?? "").trim();
  if (!EMAIL.test(email) || body.consent !== true) {
    res.status(400).json({ error: "A valid email and consent are required." });
    return;
  }
  const key = process.env.MAILERLITE_API_KEY;
  const group = process.env.MAILERLITE_GROUP_ID;
  if (!key || !group) {
    res.status(400).json({ error: "MailerLite is not configured." });
    return;
  }
  const upstream = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      groups: [group],
      fields: {
        archetype: String(body.archetype ?? ""),
        outcome: String(body.outcome ?? ""),
        base: String(body.base ?? ""),
        coefficient: String(body.coefficient ?? ""),
        sign: String(body.sign ?? ""),
      },
    }),
  });
  if (!upstream.ok) {
    res.status(400).json({ error: "MailerLite rejected the request." });
    return;
  }
  res.status(200).json({ ok: true });
}
