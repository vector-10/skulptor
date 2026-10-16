# Notes

Decisions and research, newest first. Test results live in `experiments.md`.

## Oct 16

* Studied the top design skills:
  * [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) (most installed). Lessons: ground choices in the subject's own world (materials, vernacular); the hero opens with the most characteristic thing in that world; plan as tokens first (4 to 6 named hex colors, type roles, layout as an ASCII wireframe), then check the plan against "would I make this for any similar page?" and revise before code; "spend your boldness in one place"; "remove one accessory". It lists 5 current AI design clichés.
  * Our bakery page (Test 5) hit cliché 1 exactly (cream background, high contrast serif, terracotta accent) and cliché 5 (all caps eyebrow "NEIGHBORHOOD BAKERY", middle dot strings). The agent swapped one default for another. Our Avoid list was too narrow.
  * [Taste Skill](https://github.com/Leonxlnx/taste-skill) (Leonxlnx): almost the same loop as ours (Node 22, Chrome, screenshots at 3 widths, fix top 3 problems, up to 3 rounds). Its extra: a script deals 3 of 20 researched art directions and the agent picks one, which forces variety; real open licensed imagery with credits. Prior art: credit it if we borrow ideas. Our difference: built and tested for open models (DeepSeek in R-CLI), cheap.
  * SKILL.md rewritten from these lessons. Removed: the "when to use" line (the user calls it on purpose), "reuse its styles" (kept the Vite leftovers in Test 4), the example critique that praised "serif name, single red accent" (taught cliché 1), the brief repeated in the report. Changed: Brief became Plan (subject's world, signature moment, 4 to 6 hex colors, type roles, ASCII wireframes, then the "would I make this for any page?" check); Avoid list replaced by the 5 default looks; rule 1 now forbids invented facts, not all copy; new rule 9 "desktop is not stretched mobile". Kept 2 rounds: the bakery's problem was the plan, not too few rounds.
  * To do: credit Anthropic's frontend-design in the README (our default looks list is adapted from it) and check its license first.
  * Others to look at later: Vercel web-design-guidelines (UI review), Emil Kowalski (motion), Jakub Krehel's better-* (interface review).

## Oct 15

* Step 1 passed: the R-CLI agent (DeepSeek V4.1 Flash) opened `glm.png` with its read tool and described it correctly: layout, card colors, all card text, tab titles. Small mistakes: guessed "Fedora" (it's Pop!_OS), misread "backboard.io" as "backend.io", called a dark gray value blue. So the fallback is not needed. Lesson: use screenshots to judge layout, color and hierarchy; check exact text and small details in the code.
* Step 2 passed: `scripts/screenshot.mjs` started `test-app`, waited for the page, and saved correct desktop (1440×900) and mobile (390×844) screenshots, both fully drawn, then stopped the server. No packages needed, it uses the installed Chrome.
* Skill writing tips from Anthropic ([best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), [engineering post](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) by Barry Zhang, Keith Lazuka, Mahesh Murag). What we use:
  * Concise: only write what the model doesn't already know.
  * Description in third person, says what it does and when to use it, with trigger words.
  * Low freedom for fragile steps (run the screenshot script exactly), high freedom for design choices.
  * Give a checklist the agent copies and ticks off. This also tracks the round count.
  * Feedback loop: validate, fix, repeat. Only move on when it passes.
  * One concrete example works better than a description (add one example critique).
  * One word per idea: always "issue", "round", "brief".
  * Evaluations first: at least 3 test tasks, compare against a baseline without the skill. Test on every model we use (DeepSeek, GLM).
  * "Claude A writes, Claude B tests": Claude Code helps write the skill, R-CLI uses it, we feed what goes wrong back in. This is our setup.
* Checked: the tips are not Claude only. The Agent Skills format is an open standard read by 30+ agents (Codex CLI, Gemini CLI, Cursor, VS Code, R-CLI), and the tips are general prompting advice that DeepSeek V4 guides repeat. Old DeepSeek R1 advice ("no system prompt, no examples") does not apply to V4. Real proof is the first run with DeepSeek.
* Decision: no new baseline tests. Use Test 1 (contact card) as the before. Write the skill now.
* Test 4 (first skill run) fixes in SKILL.md: brief and critiques must be written in the response and repeated in the report; everything visible in the screenshot counts (starter leftovers too); rule 3 made measurable ("about half the screenshot empty is an issue"). User pointed out this would punish a card that rightly sits in open space. Rules rewritten in design terms (shorter, the model already knows them): active vs dead whitespace, hierarchy (5 second test, ≥ 1.5× size steps), WCAG AA contrast, one icon set and spacing scale, 44px touch targets. 8 rules now. Sources: active/passive white space ([Logoworks](https://logoworks.com/white-space-closer-look-area-design-elements/), [CorelDRAW](https://coreldraw.com/en/tips/graphic-design-principles/white-space)); 5 second test and 1.5× are practitioner rules of thumb from community critique skills.
* Known gap fixed: the screenshot script now uses the Chrome DevTools Protocol (built in WebSocket, Node 22+) to save 4 images: `desktop.png`, `mobile.png` (first screen) and `desktop-full.png`, `mobile-full.png` (whole page, height capped at 8000px so models don't shrink it to unreadable). Older Node falls back to first screen only with a warning.
* Full page capture tested on the Vite starter: mobile-full (390×924) shows more than mobile (390×844); desktop images match because the starter fits in 900px. First version crashed on cleanup (deleted Chrome's temp profile while Chrome was still writing); fixed by waiting for Chrome to exit.
* Bug found: `test-app/screenshots/*.png` had been committed by accident, so resets brought them back. Untracked them and added `screenshots/` to the root `.gitignore`.
* The user can also open the live page after a run: `pnpm dev` in `test-app/`, then the printed URL.
* Plan for the skill, in order:
  1. Test: can the R-CLI agent view a screenshot it made itself? Riskiest part, test first. Fallback: the script sends the PNG to DeepSeek through the API and prints the critique.
  2. Screenshot script: it starts the dev server, waits for the page, takes desktop (1440×900) and mobile (390×844) screenshots, then stops the server. The script starts the server because agents get stuck on `pnpm dev`.
  3. `references/rules.md` + `references/critique.md`, then `SKILL.md`.
  4. Test: contact card in a clean folder vs `notes/deepseek.png`, then one task in `test-app/`.
  5. README (credit R-CLI, screenshots), then first user + DEV post (Oct 16 to 18).
* Rules: start with almost none, test, then add rules for what actually fails. Rules must be checkable (countable or visible), but not so strict that every page looks the same. Layers to cover over time: layout, typography, color, spacing, content, responsive, accessibility, code.
* Money: the skill is free and open. Value is in selling results (pages for clients), maybe a hosted version later, and proof of skill.

* Validation passed: 3 of 3 tasks. DeepSeek V4.1 Flash in R-CLI can change a real React + TypeScript app. Details in `experiments.md`, Test 3.
* Deleted `tasks.md`. Its prompts, pass criteria and reset steps are in `experiments.md`, and keeping them in the repo could spoil tests.
* Verified online: `deepseek/deepseek-v4.1-flash` on OpenRouter takes text and image input, text output, 1M token context. Released Sep 10, 2026, open weights (MIT). So it can look at its own screenshots for the critique step. Sources: [OpenRouter model page](https://openrouter.ai/deepseek/deepseek-v4.1-flash), [OpenRouter V4 vision guide](https://openrouter.ai/blog/insights/deepseek-v4-vision/), [NVIDIA model card](https://build.nvidia.com/deepseek-ai/deepseek-v4.1-flash/modelcard).
* Skill format research (redone, the Oct 14 version was never saved):
  * Format follows the open [Agent Skills spec](https://agentskills.io/specification): a folder with `SKILL.md`, YAML frontmatter with `name` (lowercase, hyphens, must match the folder name) and `description` (what it does and when to use it, max 1024 chars), then Markdown instructions. Keep it under 500 lines. Extra files can go in `scripts/`, `references/` and `assets/`, linked by relative path.
  * R-CLI ([skills docs](https://docs.backboard.io/cli/skills)): repo skills in `.agents/skills/<name>/SKILL.md`, found by walking up from the working folder to the repo root, so a skill at the Skulptor repo root works when R-CLI runs in `test-app/`. Personal skills go in `~/.agents/skills/`. The repo one wins if names clash.
  * Activate: `/skills`, pick it, choose `Load Skill`, then mention it with `$skulptor ...`. Skills are not loaded automatically (except via `/discover`, which is off by default). `/skulptor` is not a command.
  * The R-CLI docs don't mention scripts inside skills. But the agent can run shell commands, and in Test 3 task 2 it ran headless Chrome on its own, so the screenshot step can be a written instruction or a small script it runs.
  * R-CLI's own answer (it read its binary, v3.0.5): it collects every file in the skill folder and attaches them when the skill loads, so a `scripts/` file will be visible to the agent. Shell commands ask for permission first in the default mode. R-CLI sends images to `deepseek/deepseek-v4.1-flash` (it only blocks a short list of older models).
  * R-CLI also has a `/cua` computer use tool that takes screenshots. Not needed for now.
  * R-CLI is open source, MIT license ([GitHub](https://github.com/Backboard-io/Backboard-R-CLI)). Credit it in the README.
* To do: the README still says OpenCode runs the agent loop. Update it to R-CLI and credit it correctly.
* To do: the screenshots listed in `experiments.md` (`notes/*.png`) are not in the repo yet.

## Oct 14

* Harness: R-CLI (Backboard). Main model: `deepseek/deepseek-v4.1-flash`, about $0.01 per run. `z-ai/glm-5.3` for the final comparison. OpenCode test skipped unless R-CLI blocks us.
* Product shape: Skulptor is a portable Agent Skill at `.agents/skills/skulptor/SKILL.md`, not locked to Backboard. In R-CLI: `/skills`, then `$skulptor ...`. Maybe list it on skills.sh.
* The skill has three parts: a design brief before code, design rules, and a screenshot, critique, fix loop.
* Prize: opt into the Backboard partner category ("compare open weight models through a single Backboard API key").
* Why a critique loop: one round of human critique was enough to turn the generic template into good design (`experiments.md`, Test 2).

## Oct 13

* Entry for Hacktoberfest 2026 DEV Week 2. Deadline Oct 18, 11:59 PM PDT. Own target: build by Oct 15, then use Oct 16 to 18 for a first user and the DEV post.
