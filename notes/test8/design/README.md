# Handoff: Ọ̀dà Studio — one-page site

## Overview
A one-page site for Ọ̀dà Studio, Adaeze Okafor's made-to-measure womenswear label in Lagos. It is read by women in Lagos and abroad who want clothing cut for them, and its single job is to get them to book a fitting. Every choice follows one principle: **the page is cloth**. Colour is indigo dye, pattern is adire resist, structure is woven aso-oke strips, and the one warm accent is a single gold weft thread. Nothing on the page could belong to a generic fashion template.

## Direction
- **Subject's world:** indigo dye vats (the collection is called "Indigo Hours"), adire resist-dye ring motifs, aso-oke woven strip cloth, the tailor's fitting, Lagos at dusk.
- **Signature moment:** the hero. The wordmark "Ọ̀dà Studio" is set enormous in a high-contrast Didone, and behind it runs a full-bleed band of woven cloth — six stacked indigo strips with warp lines and selvedge edges, one single gold weft thread, and faint adire resist rings. It is the only loud element; everything else is quiet typography and hairlines.
- **Not a default because:** no cream/terracotta, no acid accent on near-black (the dark is unmistakably blue indigo), no cards or shadows, no ALL-CAPS eyebrows (eyebrows are italic serif with a short thread rule), no middle dots, no monospace, no arrows, no photos at all — the client has none, so cloth itself, drawn in CSS/SVG, is the imagery.

## Fidelity
High fidelity. Colors, type, spacing, layout, copy and interactions are final. Rebuild them exactly in the app's own code. Do not redesign, restyle or add anything. The client supplied no photos — **use no images of any kind**; all decoration is inline SVG pattern and CSS gradients already in the prototype.

## Order of truth
1. The prototype screenshots (`prototype-desktop-full.png`, `prototype-mobile-full.png`)
2. `prototype.html`
3. This README

If they disagree, the higher one wins.

## Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `--vat-900` | `#0B1129` | Visit/booking section + footer background |
| `--vat-800` | `#0D1330` | Hero background, button text on gold |
| `--vat-700` | `#14204A` | Studio section background, swatch base |
| `--vat-600` | `#1B2A5B` | Prices, eyebrows and ring indices on light cloth |
| `--cloth` | `#F2F3F8` | Light section background, headings on dark |
| `--resist` | `#DCE4F6` | Body text and pattern strokes on dark |
| `--ink` | `#131B40` | Text on light cloth |
| `--thread` | `#C08A2D` | Gold weft: primary buttons, hover/focus accents, the literal thread lines |
| `--thread-hi` | `#D8A745` | Button hover state only |

Color rule: gold is a single weft thread. It appears **only** as primary buttons, hover/focus accents on dark, the selection color, and the two literal thread lines (weave band, swatch). Prices are never gold — on cloth they are `--vat-600`. On dark, text is `--cloth` (headings) or `--resist` at 100/85/80/65/55% (body, by level).

### Type
| Role | Family | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| Hero wordmark | Bodoni Moda | clamp(100px, 21vw, 300px) | 400 | 0.95 | −0.015em |
| Wordmark "Studio" | Bodoni Moda italic | 0.21em of hero size | 400 | inherit | 0 |
| Section titles | Bodoni Moda | clamp(44px, 5.6vw, 84px) | 400 | 1.04 | −0.01em |
| Eyebrows + small serif labels | Bodoni Moda italic | clamp(19px, 1.5vw, 22px); labels 17–20px | 400 | 1.3–1.4 | 0 |
| Piece names | Bodoni Moda | clamp(24px, 2.1vw, 34px) | 400 | 1.18 | 0 |
| Info values (address, hours) | Bodoni Moda | clamp(20px, 1.8vw, 26px) | 400 | 1.4 | 0 |
| Body | Manrope | 17px (lede clamp(17px,1.4vw,20px)) | 400 | 1.65–1.7 | 0 |
| Buttons, links, nav | Manrope | 13–18px per component | 500–600 | 1.2–1.5 | 0.02–0.06em |
| Ring index numerals | Manrope | 12px | 600 | 1 | 0.06em |

Font source (Google Fonts, exact link in prototype):
`Bodoni Moda` italic 400 + regular 400; `Manrope` 400, 500, 600. Fallbacks: `Didot, "Times New Roman", serif` and `system-ui, sans-serif`. The name must keep its diacritics: **Ọ̀dà** (Ọ + combining grave).

### Spacing and layout
- Gutter: `clamp(24px, 5vw, 72px)`. Content wrapper: max-width 1440px, centered, gutter padding inline.
- Section vertical padding: `clamp(72px, 9vw, 128px)` (mobile 72px, desktop 128px).
- Gap scale (8px base): 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- Max text widths: lede 34ch, rail note 27ch, studio paragraph 37ch, visit paragraph 30ch, fact text 26ch.
- Grids (desktop): Collection `5fr / 7fr` gap `clamp(48px,6vw,104px)`; Studio head `7fr / 5fr`; Visit `5fr / 7fr` gap `clamp(48px,6vw,112px)`.
- Breakpoints: 900px (grids stack, nav links hidden) and 640px (piece rows and visit rows re-grid).

### Shape
- Radius: 0 everywhere — tailored, cut edges. Sole exception: the 44px ring indices and the circular adire motifs (50%).
- Borders: 1px hairlines only — `rgba(19,27,64,.18)` on cloth, `rgba(220,228,246,.15–.3)` on dark.
- Shadows: none anywhere. No gradients except the flat strip bands of the weave.

## Components

**Weave band (signature, hero only).** Full-bleed, 248px tall (160px on phone), absolutely positioned across the vertical center of the hero wordmark (`top:50%; transform:translateY(-46%)`), bleeding past the gutters to both viewport edges. Six stacked strips, each 16.667%: `#101A40, #1B2A5B, #0F1B3E, #20306B, #16224E, #0C1434`. Overlays, in order: a 2px-equivalent gold weft at 41.5–42.8% height (`rgba(192,138,45,.9)`); warp threads `repeating-linear-gradient(90deg, rgba(220,228,246,.055) 0 1px, transparent 1px 7px)`; selvedge lines `repeating-linear-gradient(180deg, rgba(4,7,18,.5) 0 1px, transparent 1px 16.667%)`; top/bottom border `1px solid rgba(4,7,18,.55)`; and the adire ring pattern (SVG `#adire`, `--resist` at 16% opacity).

**Adire ring pattern (`#adire`).** Inline SVG `<pattern>`, 120×120 tile, `currentColor` strokes (1.5px) and fills: ring r16 at (30,30) with center dot, ring r7 at (90,30) with dot, ring r10 at (90,90) with dot, small cross at (30,90), half rings r7 clipped at both vertical edges (0,60)/(120,60), tiny dot pair at (24,104)/(36,104) and single dot at (60,60). Defined once in a hidden SVG, referenced by `url(#adire)` in the hero (5.5% opacity), weave (16%), studio section (7%) and swatch (22%).

**Primary button.** `--thread` background, `--vat-900` text, Manrope 600 15px, letter-spacing .03em, min-height 52px, padding 14px 30px, radius 0. Hover: background `--thread-hi`, `translateY(-2px)` (180ms). Small header variant: min-height 44px, padding 11px 20px, 14px.

**Text link (dark sections).** Manrope 600, `--cloth`, 1px underline `rgba(220,228,246,.4–.45)`, underline-offset 6px, min 44px touch height. Hover: color and underline become `--thread`.

**Eyebrow.** Bodoni Moda italic with a 28×1px thread rule before it (`::before`, currentColor at 55%, 14px gap). Color: `--vat-600` on cloth; `rgba(220,228,246,.8)` on dark.

**Piece row (collection index).** Grid `52px / 1fr / auto`, padding `clamp(20px,2.4vw,28px) 6px`, hairline bottom border; list has a hairline top border. Parts: 44px ring (1.5px `rgba(27,42,91,.4)` border, Manrope 600 12px index), piece name, right-aligned price (Manrope 600, `clamp(15px,1.2vw,17px)`, `--vat-600`, no wrap). Hover: row background `#E9EDF6`, ring fills `--ink` with `--cloth` numeral, name translates 10px right (220ms). Rows are not links — no focus state. At ≤640px the grid becomes `44px / 1fr` and the price drops under the name in column 2.

**Swatch.** 172×228px `--vat-700` rectangle, rotated −2deg, 1px `rgba(19,27,64,.25)` border, adire pattern at 22%, one 2px gold thread at 57% height, italic caption "hand-dyed adire" (16px, `rgba(19,27,64,.6)`).

**Visit rows.** Grid `160px / 1fr`, padding 26px 4px, hairline tops (list has hairline bottom). Label: italic serif 18px at 65% resist. Value: serif `clamp(20px,1.8vw,26px)` in `--cloth`. Contact row: channel label (italic serif 17px, fixed 92px) + Manrope 600 link. ≤640px: single column.

## Sections

### 1. Header
- **Desktop (1440px):** absolute over the hero, full width, padding 20px + gutter. Logo "Ọ̀dà Studio" (Manrope 600 15px, ls .04em, `--cloth`) left; nav center-right (Collection / Studio / Visit, Manrope 500 15px, 80% resist, 44px touch padding, underline on hover); small gold "Book a fitting" button far right linking to `#visit`.
- **Phone (390px):** nav links hidden; logo + gold button only.
- **Copy:** `Ọ̀dà Studio` · `Collection` `Studio` `Visit` · `Book a fitting`
- **Images:** none.

### 2. Hero — the dye vat
- **Desktop (1440px):** min-height 100vh, `--vat-800`, adire pattern over the whole section at 5.5%. Flex column: centered wordmark block, then a bottom row. The weave band (signature, above) crosses behind the wordmark. Wordmark `Ọ̀dà` with italic `Studio` at 0.21em trailing the baseline, `--cloth`, optical left margin −0.04em. Bottom row: left = lede (max 34ch, 92% resist) + CTA row (gold button `Book a fitting` → `#visit`, text link `See the collection` → `#collection`, 28px gap); right = collection note, right-aligned.
- **Phone (390px):** wordmark scales to 100px min; weave 160px; bottom row stacks, note goes left-aligned.
- **Copy:** H1 `Ọ̀dà Studio` · lede `Hand-dyed adire and aso-oke, cut to order in Lagos since 2018.` · buttons `Book a fitting`, `See the collection` · note `The current collection` / `Indigo Hours`
- **Images:** none (decorative SVG only, `aria-hidden`).

### 3. The collection — Indigo Hours
- **Desktop (1440px):** `--cloth` background. Grid `5fr / 7fr`. Left rail, sticky at top 56px: eyebrow, H2 in `--ink`, note, then the rotated swatch + caption. Right: the six-piece index list.
- **Phone (390px):** rail goes static above the list; swatch stays.
- **Copy:** eyebrow `the current collection` · H2 `Indigo Hours` · note `Twelve pieces — six shown here. Each one cut to your measure.` · caption `hand-dyed adire` · rows: `01 Adire Wrap Dress ₦185,000` · `02 Aso-oke Structured Jacket ₦240,000` · `03 Indigo Wide Trousers ₦120,000` · `04 Tie-dye Silk Shirt ₦95,000` · `05 Woven Evening Skirt ₦160,000` · `06 Indigo Head Wrap ₦25,000`
- **States:** piece-row hover as defined in Components.

### 4. The studio
- **Desktop (1440px):** `--vat-700` with adire pattern at 7%. Head grid `7fr / 5fr`, bottom-aligned: left eyebrow + H2 (`--cloth`, max-width 11ch); right paragraph (17px, 85% resist, max 37ch). Below, three fact columns, each a hairline top border with an italic serif label and 15px text at 78% resist.
- **Phone (390px):** single column; facts stack with 26px gaps.
- **Copy:** eyebrow `the studio` · H2 `Made for you, not off a rack.` · paragraph `Since 2018, Adaeze Okafor has cut every Ọ̀dà Studio piece to order from hand-dyed adire and aso-oke — made to your measure and ready in three weeks.` · facts: `the cloth` / `Hand-dyed adire and aso-oke.` — `the cut` / `Every piece cut to order in the studio.` — `the wait` / `Made to measure, ready in three weeks.`

### 5. The fitting / visit + footer
- **Desktop (1440px):** `--vat-900`. Grid `5fr / 7fr`. Left: eyebrow, H2, short paragraph, gold button `Book on WhatsApp` (external, new tab). Right: three visit rows (address, hours, contact links). Footer follows in the same section: hairline top border, `© 2026 Ọ̀dà Studio` left, `Back to top` right (both 13px, low-contrast resist, 44px touch height).
- **Phone (390px):** single column; visit rows go single-column at 640px; contact channels stack above their links; footer stacks left-aligned.
- **Copy:** eyebrow `the fitting` · H2 `Book a fitting.` · `Fittings are by appointment at the studio in Ikoyi.` · button `Book on WhatsApp` · rows: `the address` / `9 Awolowo Road, Ikoyi, Lagos` — `the hours` / `Tuesday to Saturday` `10am to 6pm` — `reach the studio` / `WhatsApp +234 803 555 0142`, `Email hello@odastudio.ng`, `Instagram @odastudio`
- **Links:** WhatsApp `https://wa.me/2348035550142`, email `mailto:hello@odastudio.ng`, Instagram `https://www.instagram.com/odastudio`.

## Interactions
- Anchor navigation with `scroll-behavior: smooth`; sticky collection rail is the only scroll effect.
- Hovers: nav/logo/link underline + gold color; piece rows as defined; buttons lighten and lift 2px.
- Focus: `:focus-visible` 2px outline, offset 3px — `--thread` on dark, `--vat-600` on the cloth section.
- Selection: `--thread` background, `--vat-900` text.
- No JavaScript. No animations beyond 150–250ms hover transitions.
- Reduced motion: smooth scroll off, all transitions removed.

## Do and don't
- Do keep the diacritics in Ọ̀dà everywhere; keep prices exactly as given with the ₦ glyph.
- Do keep gold rationed to buttons, hover/focus accents and the two literal thread lines. Prices stay indigo.
- Don't add photos, icons, arrows, cards, shadows, rounded corners or gradients beyond the weave strips.
- Don't convert eyebrows to uppercase or add middle-dot separators.
- Never center body text; don't reorder the six pieces; don't repeat the address or hours in the footer.

## Acceptance checklist
- [ ] Each section matches the prototype screenshot at 1440px and 390px.
- [ ] No horizontal scroll at 390px. Touch targets at least 44px.
- [ ] Text contrast at least 4.5:1 (gold appears as text-sized UI only on dark indigo, where it measures 6:1+).
- [ ] The hero weave band bleeds to both viewport edges with one gold thread, at both widths.
- [ ] Ọ̀dà renders with both diacritics in Bodoni Moda; no fallback serif in the wordmark.
- [ ] All six pieces appear once, in order, with exact prices; "Twelve pieces — six shown here" appears once.
- [ ] Address, hours and all three contacts appear exactly once each; WhatsApp button opens `wa.me/2348035550142`.
- [ ] No images, no shadows, radius only on the 44px ring indices.