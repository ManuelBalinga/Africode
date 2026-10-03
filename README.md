# The Africode Studios website

Everything the live site needs is in this folder and nowhere else. Nothing
outside it is ever deployed.

| File | What it is |
|---|---|
| `index.html` | The whole website — one self-contained file, no build step, no dependencies beyond Google Fonts |
| `og.jpg` | The link-preview card shown when the site is shared on WhatsApp |
| `vercel.json` | Security headers and caching |

Run it locally with any static server:

```
cd website && python3 -m http.server 4188
```

Then open `http://localhost:4188`.

## Deploying

**Set the Vercel project's Root Directory to `website`.** That is the whole
protection model: the repository above this folder is the Africode business
archive — the blueprint, the financial model, the cost structure, the client
revenue-share summaries — and none of it can reach the public internet if
Vercel only ever sees this folder.

There is also a `.vercelignore` at the repository root listing those files by
name. It is a fallback in case the Root Directory is left unset; it is not the
primary defence, and it needs updating every time a new internal document is
added. The folder boundary does not.

`africodestudios.com` is not registered yet. Buy it, add it to the Vercel
project, then update the four absolute URLs in the `<head>` of `index.html`
(`canonical`, `og:url`, `og:image`, `twitter:image`) and the `url`/`image`
fields in the JSON-LD block — link previews need absolute URLs, so they
cannot be relative.

## The hero demo

The hero builds a real website in front of the visitor. `DEMOS` holds six
business types and, crucially, each declares its own `layout` — they are not
the same page in six colours:

| Type | Layout | What the page actually is |
|---|---|---|
| Restaurant | `menu` | Dish list with prices and dotted leaders |
| Salon | `book` | Grid of bookable time slots, one taken, one selected |
| Shop | `shop` | Six-product catalogue, cart badge, Add buttons |
| Clinic | `form` | Appointment form with a department select, then the doctors |
| School | `table` | Admissions notice bar and a termly fee table |
| Church | `times` | Sermon player and the week's service schedule |

The renderers live in `LAYOUT`; add a key there and point a `DEMOS` entry at
it. The device runs a five-stage timeline (wireframe → layout → design →
content → live) driven entirely by a `data-stage` attribute, so the animation
is CSS and the JavaScript only advances a number — which is why six different
structures can share one build sequence.

To add a business type, add an entry to `DEMOS` and its key to `ORDER`. The
type the visitor picks is carried into the WhatsApp message ("I run a clinic
and I'd like a free quote"), so every enquiry arrives already qualified.

The demo cycles through types on its own until the visitor picks one, then it
stops — a deliberate choice should not be overridden by a carousel. The frame
is labelled "Example build · not a real client" so the mock businesses are
never mistaken for real customers.

## Editing the site

- **Prices** live in the `PRICES` object in the script block. They are written
  out per currency, not converted at runtime, so they can never drift out of
  sync with the printed pricing sheets in `../Pricing and promo/`. Update both
  together.
- **Copy** lives in the `I18N` object — every string has an `en` and an `fr`.
  Add a `data-i18n="your.key"` attribute to the element and an entry to `I18N`.
- **WhatsApp** is a single number in `WA_NUMBER` — every enquiry, in either
  language, goes to the Accra line.
- **The headline** is split per character at runtime so each letter's weight can
  follow the cursor (Bricolage Grotesque is a variable font). Words are wrapped
  in nowrap boxes so a line can only break at a real space.

## The globe

The band's globe is a dot-matrix Earth with real coastlines. The land mask was
baked offline from Natural Earth 110m coastline data (via
`world-atlas@2/land-110m.json`), tested point-in-polygon against the exact
points the page generates, and stored as `LANDMASK` — 14,000 bits in 2,336
base64 characters, 1,750 bytes. There is no map image to download and no
runtime cost beyond one `atob()`.

The points come from a Fibonacci sphere (`NPT` and the golden angle), not a
lat/lon grid — an even grid bunches its dots toward the limb. **If you change
`NPT`, the mask no longer lines up and must be regenerated in the same order.**

Land and ocean draw as separate point sets so land can be larger and brighter.
Dots fade by facing angle — the surface normal against the view direction —
otherwise they bunch into a hard rim at the silhouette and the sphere reads as
a ring. Arcs and markers opt out of that via `uFacing = 0`.

An opaque sphere at r = 0.978 is drawn first with depth writing on, so dots,
routes and comets on the far side are correctly hidden instead of drawing
straight through the planet. Everything after it tests against that depth but
never writes to it, so the glow layers still blend with each other. Measured:
it hides about 30% of the route pixels that fall inside the disc. Without it
the globe reads as a transparent shell rather than a body.

A comet with a five-point tail runs each route outward from Accra; nine heads
is 45 points a frame, uploaded in a single `bufferSubData`.

Note that a dot sphere is inherently sparsest at the centre of the disc,
because projected density goes as 1/cos(theta) from the sub-camera point.
Adding points does not fix that; the atmosphere gradient is what carries the
body of the planet.

## Why not three.js

three.js r186 is 88 KB gzipped for the core, plus ~29 KB for the addons this
globe would want (OrbitControls, EffectComposer, UnrealBloomPass, Line2) —
117 KB against a whole site of 33 KB, on a page that promises "fast on any
network".

Three things those addons would buy, and what happened to each:

- **Fat lines.** `gl.LINES` is locked to 1px in every browser, which is why the
  routes kept disappearing. Built directly instead: the routes are overlapping
  round sprites, 90 samples per arc.
- **Bloom.** Built directly: every bright element draws twice, wide and dim
  then tight and bright, so additive blending produces the glow with no
  framebuffer, no bright-pass and no blur chain.
- **Orbit drag.** Deliberately skipped — the globe sits behind text and is
  `pointer-events: none`, so dragging would steal clicks from the copy.

If you ever need textured geometry, loaded models or a real 3D scene, three.js
earns its weight — lazy-load it when the band scrolls into view so the initial
page stays fast.
