---
name: skulptor
description: Plans, builds, screenshots and critiques frontend UI so it looks distinctive, not generic. Use when building or restyling a page, component, layout or landing page in a web app (React, Vite, HTML and CSS). Plans a design from the subject's own world, builds it, takes desktop and mobile screenshots, finds issues against design rules, and fixes them in at most 2 rounds.
---

# Skulptor

## Checklist

Copy this into your first response and tick each item as you go. Write the plan and every critique in your response, so the user can see them:

```
Skulptor progress:
- [ ] 1. Plan written and checked
- [ ] 2. Built
- [ ] 3. Checks pass
- [ ] 4. Round 1 of 2: look, critique, fix
- [ ] 5. Round 2 of 2: look, critique, fix (skip if round 1 found no issues)
- [ ] 6. Report given
```

## 1. Plan

Before any code, write:

- **Purpose:** what the UI is for and who looks at it.
- **Content:** what the user gave or asked for. List it.
- **Subject's world:** 3 to 5 materials, objects, places or words from the subject itself (for a bakery: flour sacks, oven heat, chalkboard menus, paper bags). Distinctive choices come from here.
- **Signature moment:** the one bold element the page is remembered for. Keep everything around it quiet.
- **Color:** 4 to 6 named hex values.
- **Type:** typefaces and their roles. One or two families; if two, clearly different.
- **Layout:** an ASCII wireframe for desktop and one for mobile.

Then check the plan: would you make this same plan for any similar page? Compare it with the defaults below. Revise every part that matches a default and say what you changed. The user's own words always win: if they ask for one of these looks, use it.

**Defaults to avoid** (the most common AI looks right now):

1. Cream background, high contrast serif display, terracotta or clay accent.
2. Near black background with one bright acid green or vermilion accent; purple or blue gradients.
3. Broadsheet layout: hairline rules, zero border radius, dense newspaper columns.
4. SaaS card kit: identical rounded cards, the same soft shadow under each, gradient washes.
5. Template chrome: an ALL CAPS label above every heading, text joined with middle dots (A · B · C), monospace for small labels, arrows added to buttons, initials circles, emoji as icons.

## 2. Build

Follow the plan. If the project has a real design system, use it. Starter template styles (like the Vite demo page) are not a design system: replace them.

## 3. Checks

Run the project's type check and build (for example `tsc -b` and the `build` script). Fix every error before taking screenshots.

## 4. Look

The script is `scripts/screenshot.mjs` inside this skill's folder (usually `.agents/skills/skulptor/` at the repo root, or `~/.agents/skills/skulptor/`). From the app folder, where `package.json` is, run exactly:

```
node <skill folder>/scripts/screenshot.mjs
```

Do not change or replace this command. It starts the dev server, saves screenshots to `screenshots/`, then stops the server:

- `desktop.png` (1440×900) and `mobile.png` (390×844): the first screen, before scrolling. Use these for the 5 second test.
- `desktop-full.png` and `mobile-full.png`: the whole page. Use these for everything below the first screen.

Open all 4 images with your read tool and look at them. If the script warns that only first screen images were taken, critique those.

If the script fails, read its error and fix the cause. If it fails twice, stop and report the error.

## 5. Critique

Compare the screenshots against the rules below. An issue is a broken rule. Taste opinions are not issues.

Everything visible in the screenshot is your responsibility, including leftovers from the starter app (borders, backgrounds, demo styles). If it shows on screen and does not belong to the design, it is an issue, even if you did not write it.

- At most 3 issues per round, most important first.
- For each issue: what is wrong, where, which rule, and the fix.
- Then list what to keep.
- Judge layout, color and hierarchy from the screenshots. Check exact text in the code, because small text in a screenshot can be misread.

Example:

```
Round 1 of 2
Issue 1: On desktop the menu is one narrow column with empty space to its right. Rule 9. Fix: two column menu grid at 1440px.
Issue 2: Prices in #B0A89C on #FFFFFF are too light. Rule 5. Fix: darken to #6B6259.
Keep: the signature photo strip, the type scale, the section order.
```

## 6. Fix and stop

Fix the issues, run the checks again, then start the next round with new screenshots.

Stop as soon as one of these is true:

- No rule is broken.
- 2 rounds are done. List the issues left.
- A fix broke something on the keep list. Undo that fix and stop.
- Checks fail 3 times in a row. Stop and report the error.

## 7. Report

- Each round's critique (issues and keep list) and what you changed.
- Issues left, if any.
- The paths of the final screenshots, so the user can look at them.

## Rules

1. Content: no invented facts (prices, claims, fields) beyond what the user gave or asked you to create.
2. No duplicate information.
3. Whitespace must be active (framing, grouping, emphasis), never dead. A single component may sit in generous whitespace; a page may not have dead zones.
4. Hierarchy: pass the 5 second test (the eye lands on the primary element first). Size steps between levels ≥ 1.5×.
5. Contrast: WCAG AA (4.5:1 text, 3:1 UI elements).
6. Consistency: one icon set, one spacing scale.
7. None of the defaults to avoid, unless the user asked for it.
8. Responsive: no horizontal scroll at 390px, touch targets ≥ 44×44px.
9. Desktop is not stretched mobile: at 1440px the layout uses the width (grids, asymmetry, side by side content), and sections do not all share the same layout.
