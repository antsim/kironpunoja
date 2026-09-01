# KIRONPUNOJA

One-page site for the death metal band Kironpunoja. Static HTML, CSS and
vanilla JS — no build step, no dependencies, no framework.

```
index.html      markup + all copy
styles.css      the whole design system
main.js         reveals, split text, scroll-aware masthead
assets/         logo
```

## Running it

Any static server:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. To deploy, drop the folder on GitHub
Pages, Netlify, Cloudflare Pages or any other static host — there is
nothing to compile.

## Design system

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#0A0A0B` | Ground. Flat near-black, no gradients, no vignette. |
| `--bone` | `#E8E2D4` | Type. Warm bone white — never pure `#FFF`. |
| `--sulphur` | `#C7BC3E` | Accent. Used **four times** on the entire page. |

Typefaces are **Bodoni Moda** (display — the high-contrast didone of an
engraved death notice) and **Archivo** (body — clean grotesque, full
Finnish diacritics). Both from Google Fonts.

The accent is deliberately rationed: the "Aktiivinen" status dot, the
manifesto numerals on hover, the ticker separators, and the booking
address on hover. Adding a fifth use will cheapen the other four.

## The logo

`kironpunoja-logo.svg` in the repo root is the **source** artwork and is not
served to browsers: it is 7.9 MB of auto-traced paths (13,341 of them,
7,006 distinct fills) describing what is really a continuous-tone image.
Inlining it would stall rendering.

What the page loads is `assets/logo-{900,1400,2048}.webp`, derived from it:

1. rendered at native 2816x1536,
2. background knocked out by ramping alpha across a narrow luminance band
   (transparent below ~8, opaque above ~30) so the baked-in black plate
   disappears while every toned pixel keeps its **original** colour — the
   artwork is bone-toned already and needs no tint,
3. auto-cropped to the artwork bounding box (2645x1464, aspect 1.8067),
4. scaled to three widths and encoded as WebP (181/299/391 KB), served via
   `srcset`.

Alpha is deliberately *not* premultiplied by luminance: that would darken
the artwork as it composited over the ink ground.

To regenerate after changing the source, redo those steps and keep the
`width`/`height` attributes on the `<img>` in sync with the crop, or the
hero will shift as it loads.

The hero caps the logo by height as well as width, using the artwork's own
aspect ratio, so it cannot push the specimen tag below the fold on a short
viewport.

## Placeholder copy

Every invented string is wrapped in a `PLACEHOLDER` comment in
`index.html`. Replace before going live:

- the band history in **Tarina**
- the booking address in **Yhteys**
- the founding year, home town and status in the hero specimen tag
- the social links in the colophon

There is intentionally **no press-quote or review section** — real ones
can be added later, but invented ones would be lying to visitors.

## Accessibility

- `prefers-reduced-motion` disables grain, ticker, splits and reveals.
- Split headings keep an unsplit copy for screen readers and copy-paste.
- Reveal styles are gated behind a `.js` class, so the page is fully
  readable if the script fails to load.
- Skip link, visible focus rings, semantic landmarks throughout.
