# Skulptor

Skulptor is an open source coding agent for frontend work. Think of it as a junior frontend engineer with good design taste.

## The problem

Today's coding agents build a UI well when you give them a design to copy. But when you give them a short prompt, they make weak design choices. The result often looks plain and generic.

## The idea

Skulptor makes good design choices on its own. It works in four steps:

1. Plan the design first (layout, colors, type, spacing).
2. Build it in React.
3. Take a screenshot and look at the result.
4. Find what looks wrong and fix it.

## Built with open source AI

Skulptor runs only on open models and open source tools.

* **Models:** open weight coding models such as Qwen, DeepSeek and GLM.
* **Inference:** the Backboard API, with OpenRouter as a backup.
* **Agent:** OpenCode runs the agent loop. Skulptor adds the design layer on top.

## Status

Work in progress. Built for the Hacktoberfest 2026 DEV Challenge, Week 2.

## Credits

* [OpenCode](https://github.com/sst/opencode): the open source coding agent Skulptor is built on.
* [Backboard](https://backboard.io): model access through one API key.
* The teams behind the open weight models used here.

This project was built with help from Claude Code. The product itself runs only on open models.
