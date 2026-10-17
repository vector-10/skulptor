# Handoff: <page name>

## Overview
What the page is for, who looks at it, and the one principle every choice follows.

## Direction
- **Subject's world:** the 3 to 5 materials, objects, places or words the design draws from.
- **Signature moment:** the one bold element, where it sits, and why it belongs to this subject.
- **Not a default because:** how this differs from the defaults to avoid.

## Fidelity
High fidelity. Colors, type, spacing, layout, copy and interactions are final. Rebuild them exactly in the app's own code. Do not redesign, restyle or add anything.

## Order of truth
1. The prototype screenshots (`prototype-desktop-full.png`, `prototype-mobile-full.png`)
2. `prototype.html`
3. This README

If they disagree, the higher one wins.

## Tokens

### Color
| Token | Hex | Use |
|---|---|---|

Name any rule about color, for example "one accent, only on prices".

### Type
| Role | Family | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|

Font source and the exact weights to load.

### Spacing and layout
- Page gutter, section padding, gap scale, max text widths (exact values).
- Grid rules and breakpoints.

### Shape
Radius, borders, shadows. State the "none" choices too, for example "no shadows anywhere".

## Components
Each shared component: its parts, sizes, colors and states. The signature component in full detail.

## Sections
For each section, in page order:

### <n>. <section name>
- **Desktop (1440px):** layout with proportions, for example "two columns 7/5, image on the right at 4:5, text bottom aligned".
- **Phone (390px):** how it stacks and what changes.
- **Copy:** every piece of text, exactly as it appears.
- **Images:** path, crop or aspect ratio, alt text.
- **States:** hover, focus, active, empty or closed (for example a closed day).

## Interactions
Hover, focus, navigation, motion, reduced motion. Say "none" where there are none.

## Do and don't
Rules the developer must not break, for example "no card shadows", "never center body text".

## Acceptance checklist
Concrete, checkable items for both widths:
- [ ] Each section matches the prototype screenshot at 1440px and 390px.
- [ ] No horizontal scroll at 390px. Touch targets at least 44px.
- [ ] Text contrast at least 4.5:1.
- [ ] (Add checks specific to this design.)
