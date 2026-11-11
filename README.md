# Quick Respond Locksmith 24 Hours — Hayward, CA 94541

Single-page marketing website for a 24-hour locksmith serving Hayward, California 94541.
Vanilla HTML, CSS and JavaScript — no build step and no dependencies.

## Structure

```
index.html            Entry point (single page)
assets/css/styles.css Styles
assets/js/main.js     Progressive enhancement (validation, fetch submit, footer year)
favicon.svg           Favicon
robots.txt
```

## Running locally

Open `index.html` directly, or serve the folder:

```
python3 -m http.server 8000
```

## Primary conversion action

One action is used site-wide: **Request a locksmith**, which targets the quote
form in the `#contact` section. It appears in the header, hero, after the
services, in the service-area card, in the contact form and in the sticky mobile
bottom bar.

No phone number, email address or street address was supplied for this business,
so none is published and no `tel:` link is used. If a real number becomes
available, add it as a `tel:` link in the header and the contact list.

## Form

The quote form POSTs to LeadrVision and works with and without JavaScript:

- `method="POST"` to the LeadrVision endpoint; the `fetch()` path posts JSON to
  the same URL and falls back to a native POST if the request fails.
- Hidden `_form` (form name), `_page` (set to `window.location.href` on load and
  included in the JSON body) and a `_gotcha` honeypot.
- After a plain submission the visitor returns with `?submitted=1`, which shows
  the confirmation message; the `fetch()` path shows the same message inline.

## Content policy

All copy is limited to facts supplied in the brief: the business name, the
24-hour availability, the Hayward 94541 service area, and standard locksmith
service categories. There are deliberately no testimonials, reviews, ratings,
years-in-business, license numbers or guarantees, as none were provided.

The footer and contact section link to `/review`, which is provided externally —
this repo intentionally contains no `/review` page or redirect.
