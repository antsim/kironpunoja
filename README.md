# KIRONPUNOJA

Holding page for the Finnish death metal band Kironpunoja. Static HTML, CSS
and vanilla JS — no build step, no dependencies, no framework.

```
index.html              the page
styles.css              design system + layout
main.js                 the ember field
kironpunoja-logo.svg        logo, white  — also the CSS mask source
kironpunoja-logo-black.svg  logo, black  — for light grounds
```

The full site was removed in favour of this page and will be rebuilt from
scratch later. It is not lost: it stays in git history at tag-free commit
`2dec68d` and earlier, recoverable with `git show 2dec68d:index.html` and
its siblings.

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
| `--bone` | `#E8E2D4` | Type and the mark itself. Warm — never pure `#FFF`. |
| `--sulphur` | `#C7BC3E` | Accent. The ember warmth, and hover on the address. |

Typefaces are **Bodoni Moda** (display — the high-contrast didone of an
engraved death notice) and **Archivo** (body — clean grotesque, full
Finnish diacritics). Both from Google Fonts.

## The animation

The mark smoulders. An ember field drifts upward behind the logo, clipped
to the silhouette by a CSS mask, so it is only ever visible inside the
thorns; a few embers escape and drift up the open page around it. Nothing
resolves or repeats, so the loop has no visible seam.

The field is painted on a 200x110 offscreen canvas and scaled up — the
browser's own filtering does the blurring, so it costs about twenty
gradients a frame rather than hundreds at full resolution. The loop does
no work at all while the tab is hidden.

`prefers-reduced-motion` renders exactly one frame and then stops: the
grain, the breathing and the rule all freeze with it.

## The logo

`kironpunoja-logo.svg` is both the artwork and the CSS mask — it is
white-on-transparent, so its alpha serves as the mask with no processing.
There is deliberately **no** derived copy: the previous version of this
repo served WebP rasters cut from an earlier logo, and they silently went
stale the moment the artwork was replaced.

If you swap the logo, keep it white-on-transparent and keep the viewBox
ratio in sync with two places in `styles.css` — `aspect-ratio` on
`.mark__field` and the `52svh * 1.8186` height cap on `.mark`. The cap is
what stops a short or wide viewport from cropping the mark or crowding the
copy beneath it.

`kironpunoja-logo-black.svg` is unused by the page and kept for print and
light grounds.

## Placeholder copy

The booking address in `index.html` is invented and wrapped in a
`PLACEHOLDER` comment. Replace it before sharing the page.

## Accessibility

- `prefers-reduced-motion` freezes every loop; the mark stays fully legible.
- The mark carries a visually-hidden text name, so it reads as the band
  name rather than as a decorative canvas.
- Canvases are `aria-hidden`; a `<noscript>` fallback renders the logo as a
  plain image.
- Visible focus rings, and the page is fully readable with JS disabled.
