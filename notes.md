# Notes

Decisions and research, newest first. Test results live in `experiments.md`.

## Oct 15

* Validation passed: 3 of 3 tasks. DeepSeek V4.1 Flash in R-CLI can change a real React + TypeScript app. Details in `experiments.md`, Test 3.
* Deleted `tasks.md`. Its prompts, pass criteria and reset steps are in `experiments.md`, and keeping them in the repo could spoil tests.
* Lost: the skill format research from Oct 14 was never written down. Redo it and save it here.
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
