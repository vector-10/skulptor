# Validation tasks

Goal: check that DeepSeek V4.1 Flash, running in R-CLI, can change a real React + TypeScript app and keep it working.

Setup: run R-CLI inside `test-app/`, with a fresh thread (`/new`) and memory off. Paste each task exactly as written. Reset to the baseline between runs.

## Task 1: add a component

> Create a ContactCard component in src/components/ContactCard.tsx. It takes name, phone, email and company as typed props. Render one ContactCard in App.tsx with sample data.

## Task 2: change state and UI

> Add a button that switches the page between light and dark mode. Remember the choice in localStorage so it stays after a page reload.

## Task 3: fix a bug

> The counter button goes down when I click it. It should go up. Find the bug and fix it.

## Pass criteria (checked with tools, not by reading the code)

* `pnpm exec tsc -b` passes with no errors.
* `pnpm build` passes.
* `pnpm dev` starts and the page shows the change in the browser.
* At least 2 of the 3 tasks pass with no help from me.

## Reset between runs

```
git checkout -- test-app
git clean -fd test-app
```
