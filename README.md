# Build in Public Framework

A word-only scorecard for the book *Build in Public* by Volodymyr Khomichenko. Ratings are Base × Coefficient × Sign. It never shows a numeric score.

## Email (still in demo mode)

The in-page form does not send anything until MailerLite is connected.

1. In the host environment, set `MAILERLITE_API_KEY` and `MAILERLITE_GROUP_ID`.
2. Create matching subscriber fields: `archetype`, `outcome`, `base`, `coefficient`, `sign`.
3. In `src/lib/framework.ts`, set `SUBSCRIBE_ENDPOINT` to `"/api/subscribe"`.

Until then the form confirms locally and shows “Demo mode — connect MailerLite to send for real.”
