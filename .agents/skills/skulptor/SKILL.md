---
name: skulptor
description: Designs, builds, screenshots and checks frontend UI so it looks distinctive, not generic. A designer model (Kimi K3 through Backboard) writes a design handoff with a prototype; you build it exactly in the app (React, Vite, HTML and CSS), take desktop and mobile screenshots, and a critic model compares them with the prototype. Fixes mismatches in at most 2 rounds. Needs BACKBOARD_API_KEY.
---

# Skulptor

You are the developer on a design team. A designer model makes the design and a critic model checks your build. You do not design: you build exactly what the handoff shows.

The scripts are in `scripts/` inside this skill's folder (usually `.agents/skills/skulptor/` at the repo root, or `~/.agents/skills/skulptor/`). Run every script from the app folder, where `package.json` is, exactly as written below. Do not change or replace these commands.

## Checklist

Copy this into your first response and tick each item as you go:

```
Skulptor progress:
- [ ] 1. Design received
- [ ] 2. Handoff read
- [ ] 3. Built
- [ ] 4. Checks pass
- [ ] 5. Round 1 of 2: screenshot, critique, fix
- [ ] 6. Round 2 of 2: screenshot, critique, fix (skip if round 1 says MATCH)
- [ ] 7. Report given
```

## 1. Design

Save the user's request to `design/request.md`, word for word: copy it exactly, without the `$skulptor` mention. Do not summarize, add to, or reword it. Then run:

```
node <skill folder>/scripts/design.mjs
```

It takes a few minutes. It writes `design/README.md` (the spec), `design/prototype.html` (the prototype) and the prototype screenshots.

If it fails, read the error. If it fails twice, stop and report the error. Never design the page yourself instead.

## 2. Read the handoff

Read `design/README.md` and `design/prototype.html` in full. Open `design/prototype-desktop-full.png` and `design/prototype-mobile-full.png` with your read tool and look at them.

Order of truth: the prototype screenshots, then `prototype.html`, then the README.

Before coding, list every value you would have to guess (a size, color or state the handoff does not show). Pick the closest value from the prototype and say so.

## 3. Build

Port the prototype to the app's own code, exactly:

- Same structure, copy, colors, fonts, sizes, spacing and image crops. Copy the CSS values from the prototype.
- Put the tokens in CSS custom properties with the same names.
- Use the images at the same paths the prototype uses (import them the way the app does).
- Replace starter template styles (like the Vite demo page) completely. They are not part of the design.
- Do not redesign, "improve", or add anything that is not in the handoff.

## 4. Checks

Run the project's type check and build (for example `tsc -b` and the `build` script). Fix every error before taking screenshots.

## 5. Screenshot, critique, fix

Take screenshots of your build:

```
node <skill folder>/scripts/screenshot.mjs
```

Then ask the critic to compare them with the prototype:

```
node <skill folder>/scripts/critique.mjs --round 1
```

Write the critic's issues in your response. Fix them, run the checks again, then do round 2 with `--round 2`.

Stop as soon as one of these is true:

- The critic's verdict is MATCH.
- 2 rounds are done. List the issues left.
- A fix broke something on the critic's keep list. Undo that fix and stop.
- Checks fail 3 times in a row. Stop and report the error.

If a script fails twice, stop and report the error.

## 6. Report

- The values you had to guess.
- Each round's issues and what you changed.
- Issues left, if any.
- The cost lines the scripts printed.
- The paths of the prototype screenshots and your final screenshots, so the user can compare them.
