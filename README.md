# Brewling website

The five-product Brewling portfolio website: Databrew, Dealbrew, Hirebrew, Ledgerbrew and Propbrew.

## Run locally

Use Node.js 24. No application dependencies are needed.

```sh
npm start
```

Open `http://127.0.0.1:8766`. Main pages, product pages and solution views use hash navigation, such as `/#/products/databrew`. `npm test` exercises the enquiry endpoint with a fake email provider; it sends no email.

To send real email locally, set the three email variables below in your shell, or create an ignored `.env.local` and run `node --env-file=.env.local server.mjs`. Do not put credentials in browser JavaScript or commit them.

## Enquiry delivery

`POST /api/enquiries` sends one plain-text email to Brewling through the Resend API. The visitor's address is the Reply-To, so the team can reply directly. The recipient and verified sender come only from server configuration; a visitor cannot choose who receives the email. There is no automatic visitor email and no mailing-list subscription.

Required Railway service variables:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | A Resend key with permission to send from your verified domain. Add it securely in Railway Variables. |
| `ENQUIRY_FROM_EMAIL` | A sender address on the verified Resend domain. |
| `ENQUIRY_TO_EMAIL` | The single inbox that should receive Brewling enquiries. |
| `SITE_ORIGIN` | Optional origin override, e.g. `https://www.example.com` when moving to a custom domain. Defaults to the Railway public domain. |

The form confirms success only after the email provider accepts the message. This is not an inbox-delivery receipt: the inbox owner should monitor bounces and spam filtering in Resend. A failed request leaves the visitor's details in the form. A retry uses the same idempotency key to avoid duplicate email, including after an ambiguous timeout; Resend retains keys for 24 hours. The browser keeps draft details only in memory, so refresh/navigation clears them.

Server-side controls include field and body limits, allowed product/solution values, same-origin JSON requests, a hidden spam field, a 10-attempt per-address limit per 15 minutes and a 60-attempt global limit per hour. Counters are in memory for the single Railway replica and reset on restart; use shared rate limiting before scaling to multiple replicas. These controls reduce basic spam, not distributed bot attacks. The email provider handles the enquiry content; the app does not write submissions to disk or logs. In-memory deduplication retains only a payload hash and result for up to 24 hours. Request logs can contain IP metadata managed by Railway.

Missing email configuration or provider errors return an error; they never pretend that an enquiry was sent. Configure and verify delivery before publishing the active form.

## Railway hosting

The existing `brewling` production service is connected to `JoinDoron/Brewling`, branch `main`. Railpack detects `package.json`, installs Node 24, and starts `npm start`; the server binds Railway's `PORT`. Keep the repository root as the service root, use one replica, and set the healthcheck path to `/health`. This endpoint confirms the website server is up; it does not send a test email or verify Resend credentials.

The server serves only the `public` directory and the enquiry endpoint. Source files, Git metadata, credentials, and test files are not public. HTML, scripts, styles and SVGs support gzip; files revalidate on navigation so releases do not leave visitors with stale contact logic. `.railwayignore` excludes local environment files and previous host metadata from CLI uploads. The old Vercel settings are retained as historical configuration; the functional enquiry server requires Railway's Node runtime.

Release checks: run `npm test` and `npm run check`, push `main`, confirm Railway deployment success, then submit one clearly labelled test enquiry and verify its arrival in the receiving inbox. Check product/solution context, reply-to address, failure/retry behaviour and mobile layout.

References: [Resend send API](https://resend.com/docs/api-reference/emails/send-email), [idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), [Railpack Node](https://railpack.com/languages/node/).

## Scope

Includes the reviewed product pages, Solutions navigation, fourteen solution views, Brewling Standard, company page, working enquiry form and brand assets. Product stages and illustrative workflow labels remain visible. Local fonts are distributed with their OFL licences in `public/assets/fonts`.
