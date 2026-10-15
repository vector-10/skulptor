# Notes

Decisions and research, newest first. Test results live in `experiments.md`.

## Oct 15

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
