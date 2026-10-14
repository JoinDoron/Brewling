# Brewling website

The five-product Brewling portfolio website: Databrew, Dealbrew, Hirebrew, Ledgerbrew and Propbrew.

## Run locally

Serve the `public` directory with any static web server, for example `python3 -m http.server 8765 --directory public`.

## Railway hosting

Deploy this repository from its root using Railway's default Railpack builder. `Staticfile` selects the native static-site provider and serves only `public`. No application dependencies, build command or custom start command are needed.

1. Connect the `JoinDoron/Brewling` GitHub repository to the intended Railway service, or link this directory with the Railway CLI and run `railway up`.
2. Keep the service root at the repository root. Leave build and start command overrides empty. No application environment variables are required; Railway supplies `PORT`.
3. Set the service healthcheck path to `/health`, then generate a Railway domain under Settings > Networking.

Railpack installs Caddy 2, generates its configuration and runs `caddy fmt --overwrite Caddyfile` during image preparation. Its generated start command is `caddy run --config Caddyfile --adapter caddyfile 2>&1`. Caddy listens on Railway's `PORT` (defaulting to 80 locally), serves the site and compresses responses. Railway handles public HTTPS.

Main pages, product pages and solution views use hash navigation, so `index_fallback` is deliberately disabled. Open product URLs in the form `/#/products/databrew`; the fragment is handled in the browser. `.railwayignore` excludes local environment files and previous host metadata from CLI uploads; retain the CLI's default ignore handling.

References: [Railway static hosting](https://docs.railway.com/guides/static-hosting), [Railpack static sites](https://railpack.com/languages/staticfile/), and [Railway CLI uploads](https://docs.railway.com/cli/up).

## Scope

Includes the reviewed product pages, Solutions navigation, fourteen solution views, Brewling Standard, company page and brand assets. Product stages and illustrative workflow labels remain visible.

The contact form is explicitly a browser-only enquiry preview. It does not submit, save or email information; connecting an approved destination is separate work.

Local fonts are distributed with their OFL licences in `public/assets/fonts`.

## Visual system

The website uses locally hosted Inter Variable for all interface typography, with near-black surfaces, soft white text, fine borders and restrained violet accents. The Brewling mark is retained in a violet and white lockup. Each product has a muted accent within the same dark palette.

`site.css` contains the original structural styles; `design-system.css` defines the current shared visual system, navigation, homepage and illustrative product interfaces; `design-pages.css` covers the inner pages. Load them in that order.

The homepage product tabs support arrow keys, Home and End. Product illustrations show one product at a time and remain labelled as illustrative workflows. They do not represent a live shared workspace or verified integrations between products.

## Prospective organisation strip

The homepage displays seven Nigerian/African client prospects and five AI/cloud technology partner prospects beneath the hero. They are illustrative targets, not existing customers, partners, endorsements or verified integrations. The visible labels must remain until a relationship is independently confirmed.

Assets are served locally from `public/assets/prospects`; their original sources and inferred product relevance are recorded in `docs/prospect-logo-sources.json`. The two CSS logo loops share a keyboard-operable pause/resume button, pause on hover, hide duplicate lists from assistive technology and become static wrapped lists with reduced motion enabled.
