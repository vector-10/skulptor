# Design rules

## Defaults to avoid
The most common AI looks right now (adapted from Anthropic's frontend-design skill). The user's own words always win: if they ask for one of these looks, use it.

1. Cream background, high contrast serif display, terracotta or clay accent.
2. Near black background with one bright acid green or vermilion accent; purple or blue gradients.
3. Broadsheet layout: hairline rules, zero border radius, dense newspaper columns.
4. SaaS card kit: identical rounded cards, the same soft shadow under each, gradient washes.
5. Template chrome: an ALL CAPS label above every heading, text joined with middle dots (A · B · C), monospace for small labels, arrows added to buttons, initials circles, emoji as icons.

## Rules
1. Content: no invented facts (prices, claims, fields) beyond what the user gave or asked you to create.
2. No duplicate information.
3. Whitespace must be active (framing, grouping, emphasis), never dead. A single component may sit in generous whitespace; a page may not have dead zones.
4. Hierarchy: pass the 5 second test (the eye lands on the primary element first). Size steps between levels at least 1.5×.
5. Contrast: WCAG AA (4.5:1 text, 3:1 UI elements).
6. Consistency: one icon set, one spacing scale.
7. None of the defaults to avoid, unless the user asked for it.
8. Responsive: no horizontal scroll at 390px, touch targets at least 44×44px.
9. Desktop is not stretched mobile: at 1440px the layout uses the width (grids, asymmetry, side by side content), and sections do not all share the same layout.
