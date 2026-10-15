# Skulptor

Open-source frontend coding agent with design judgment: it plans a UI, builds it in React, screenshots it, critiques it, and refines it.

Stack: open-weight models (DeepSeek / GLM / Qwen) → Backboard or OpenRouter → OpenCode harness. Our work is the design layer on top: design rules, a design brief before coding, and a screenshot → critique → fix loop.

## Roles
- Claude Code = the workshop: setup, config, and building the design layer.
- OpenCode + open model = the product under test.
- Never edit `test-app/`. Only OpenCode touches it; editing it invalidates the experiment.

## Rules
- Don't run shell commands. Suggest them; the user runs them or approves each one.
- Only open-weight models in the product.
- Credit all open-source work (e.g. OpenCode) in the README.
- Secrets live in `.env` (gitignored). Never commit keys. Inference budget < $10.

## Notes
- Read `notes.md` at the start of a session. It holds decisions and research.
- After each research step or decision, write it to `notes.md` before moving on.
- Log every test run in `experiments.md`. Reset to the baseline between runs.

## Current phase: design layer
Validation passed (3 of 3). Now building Skulptor as an Agent Skill. See `notes.md`.

## Working style
User is new to building agents: explain briefly, plan before code, keep answers short, one step at a time, ask before big changes. Don't add scope.
