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

## Dropping in the logo

Two options, both already styled.

**Inline (preferred — it inherits colour and stays crisp):** open
`index.html`, find the `LOGO SLOT` comment in the hero, paste the `<svg>`
inside a `<div class="logo">`, and delete the `<h1 class="wordmark">`
fallback. Give the SVG `fill="currentColor"` and strip any fixed
`width`/`height`.

**As a file:** overwrite `assets/logo.svg` and reference it with
`<img class="logo" src="assets/logo.svg" alt="Kironpunoja">`.

Until then the hero renders the wordmark as live text, which animates and
is readable by search engines.

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
