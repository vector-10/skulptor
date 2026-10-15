---
name: skulptor
description: Plans, builds, screenshots and critiques frontend UI so it looks designed, not generic. Use when building or restyling a page, component, layout or landing page in a web app (React, Vite, HTML and CSS). Writes a design brief, builds it, takes desktop and mobile screenshots, finds issues against design rules, and fixes them in at most 2 rounds.
---

# Skulptor

Use this for new UI or visual changes. For changes with no visual effect (logic, data, state bugs), skip it.

## Checklist

Copy this into your response and tick each item as you go:

```
Skulptor progress:
- [ ] 1. Brief written
- [ ] 2. Built
- [ ] 3. Checks pass
- [ ] 4. Round 1 of 2: look, critique, fix
- [ ] 5. Round 2 of 2: look, critique, fix (skip if round 1 found no issues)
- [ ] 6. Report given
```

## 1. Brief

Before any code, write these 5 lines:

- **Purpose:** what the UI is for.
- **User:** who looks at it.
- **Content:** only what the user asked for. List it.
- **Direction:** one visual idea in one sentence (type, color, mood) that fits this purpose.
- **Avoid:** the default AI template: purple or blue gradient, initials circle, centered card on a dark background, emoji as icons.

## 2. Build

Read the existing code first. Reuse its styles and components. Use typed props and small components.

## 3. Checks

Run the project's type check and build (for example `tsc -b` and the `build` script). Fix every error before taking screenshots.

## 4. Look

The script is `scripts/screenshot.mjs` inside this skill's folder (usually `.agents/skills/skulptor/` at the repo root, or `~/.agents/skills/skulptor/`). From the app folder, where `package.json` is, run exactly:

```
node <skill folder>/scripts/screenshot.mjs
```

Do not change or replace this command. It starts the dev server, saves `screenshots/desktop.png` (1440×900) and `screenshots/mobile.png` (390×844), then stops the server. Open both images with your read tool and look at them.

If the script fails, read its error and fix the cause. If it fails twice, stop and report the error.

## 5. Critique

Compare the screenshots against the rules below. An issue is a broken rule. Taste opinions are not issues.

- At most 3 issues per round, most important first.
- For each issue: what is wrong, where, which rule, and the fix.
- Then list what to keep.
- Judge layout, color and hierarchy from the screenshots. Check exact text in the code, because small text in a screenshot can be misread.

Example:

```
Round 1 of 2
Issue 1: Large empty area right of the card on desktop. Rule 3. Fix: widen the card and put the contact rows in two columns.
Issue 2: Labels PHONE and EMAIL are light gray on white and hard to read. Rule 5. Fix: darken the labels to #555 or darker.
Keep: serif name, single red accent, line icons.
```

## 6. Fix and stop

Fix the issues, run the checks again, then start the next round with new screenshots.

Stop as soon as one of these is true:

- No rule is broken.
- 2 rounds are done. List the issues left.
- A fix broke something on the keep list. Undo that fix and stop.
- Checks fail 3 times in a row. Stop and report the error.

## 7. Report

- The brief.
- What changed in each round.
- Issues left, if any.
- The paths of the final screenshots, so the user can look at them.

## Rules

1. Only the content the user asked for. Do not invent fields, numbers or labels.
2. Do not show the same information twice.
3. No large empty areas. Every area has a job.
4. One icon set in one style. No emoji as icons.
5. Text is easy to read: strong contrast with its background, labels not tiny.
6. Not the default AI template (see Avoid in the brief).
7. Mobile: no sideways scrolling, nothing cut off or overlapping.
