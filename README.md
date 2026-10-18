# Skulptor

Skulptor is an open Agent Skill that gives a coding agent a design team. Before any code is written, a designer model makes a design. Your coding agent builds it exactly, takes screenshots, and a critic model checks the build against the design.

By default, Skulptor uses open weight models: **Kimi K3** (Moonshot's Kimi K3 License) designs and checks, and **DeepSeek V4.1 Flash** (MIT) builds. Both are called through one Backboard API key.

It is a standard Agent Skill, so any coding agent that supports skills can use it. But it is made for cheap, open coding setups. The goal is good frontend design from low cost open models.

**Live demo:** [Crumb & Co, a bakery page built with Skulptor](https://kaleidoscopic-horse-71483f.netlify.app/)

## Contents

* [Quick start](#quick-start)
* [The problem](#the-problem)
* [How it works](#how-it-works)
* [Setup](#setup)
* [Usage](#usage)
* [Configuration](#configuration)
* [Output](#output)
* [Known limitations](#known-limitations)
* [Results](#results)
* [What's inside](#whats-inside)
* [Credits](#credits)
* [License](#license)

## Quick start

1. Copy `.agents/skills/skulptor/` into your project's `.agents/skills/` folder.
2. Add your Backboard key to a `.env` file in your project: `BACKBOARD_API_KEY=your_key_here`
3. Start your coding agent in the project, load the skill, and write your request after `$skulptor`.

See [Setup](#setup) and [Usage](#usage) for the full steps.

## The problem

Ask most AI models for a website and you get the same page: a dark hero with a centered title, two round buttons, cards with shadows, and small labels over every heading. Short content gets repeated to fill the space.

I tested this. With the same bakery prompt and no skill, a cheap model (DeepSeek) and a top ranked open design model (Kimi K3) built almost the same generic page.

| DeepSeek alone ($0.13) | Kimi K3 alone ($1.09) |
|---|---|
| ![DeepSeek alone](https://raw.githubusercontent.com/vector-10/skulptor-lab/main/notes/test11-raw-deepseek/desktop.png) | ![Kimi alone](https://raw.githubusercontent.com/vector-10/skulptor-lab/main/notes/test10-raw-kimi/desktop.png) |

## How it works

Skulptor copies how a real design team hands work to a developer:

1. **Design.** `design.mjs` sends your request and your photos to the designer model. It writes a handoff: a spec (`design/README.md`) with colors, type, layout and exact copy, plus an HTML prototype and its screenshots.
2. **Build.** Your coding agent ports the prototype into your app exactly. It does not redesign.
3. **Check.** `screenshot.mjs` takes desktop and phone screenshots. `critique.mjs` sends the prototype and the build to the critic model, which lists at most 3 differences to fix.
4. **Fix.** At most 2 rounds, then a report with the cost of each step.

With the skill, the same bakery prompt gave the live demo: real photos, a big serif headline, a glowing "4:00 AM, ovens lit" clock, and a menu grouped into bread and pastries. There is no repeated content, and the build matches the prototype.

| Kimi's prototype | DeepSeek's build |
|---|---|
| ![Prototype](https://raw.githubusercontent.com/vector-10/skulptor-lab/main/notes/test12-demo/prototype-desktop-full.png) | ![Build](https://raw.githubusercontent.com/vector-10/skulptor-lab/main/notes/test12-demo/desktop-full.png) |

## Setup

You need:

* A coding agent that supports Agent Skills. Skulptor was built and tested with [R-CLI](https://github.com/Backboard-io/Backboard-R-CLI).
* A [Backboard](https://backboard.io) API key.
* Node 22 or newer.
* Google Chrome or Chromium, for screenshots.

There are no npm packages to install.

Steps:

1. Copy `.agents/skills/skulptor/` into your project's `.agents/skills/` folder. To use it in all your projects, copy it to `~/.agents/skills/` instead.
2. Add your key to a `.env` file in your project:
   ```
   BACKBOARD_API_KEY=your_key_here
   ```
3. Put any photos you want on the page in `src/assets/` or `public/`. To try the bakery example below, copy the photos from `examples/bakery/` into your app's `src/assets/`.

## Usage

Inside your app folder, start R-CLI with `deepseek/deepseek-v4.1-flash`. Load the skill with `/skills`, then write your request after `$skulptor`:

```
$skulptor Build a one page website for Crumb & Co, a small bakery, in this app. Use only this content:

- Name: Crumb & Co
- Tagline: Fresh bread every morning since 2009
- About: Run by two sisters on Mill Street. The ovens are lit at 4am.
- Menu: Country Sourdough $8.50 (36 hour ferment); Butter Croissant $4.25; Seeded Rye $9.00; Cinnamon Knot $4.75; Almond Danish $5.25; Morning Bun $4.50
- Hours: Monday to Friday 7am to 6pm; Saturday 8am to 4pm; Sunday closed
- Visit: 14 Mill Street. Phone (555) 201-8890. Email hello@crumbandco.com
- Photos: the images in src/assets (bread-hero.jpg, croissants.jpg, loaves.jpg)

Be ambitious. It must work well on desktop and on a phone.
```

Tips for a good request:

* Write it like a client brief: give every fact and every piece of text the page should show.
* Name the photos you want used.
* Leave out style words like "modern" or "clean". Let the designer choose the look.

## Configuration

Set these in your `.env` file or in your environment.

| Setting | Required | Default | What it does |
|---|---|---|---|
| `BACKBOARD_API_KEY` | Yes | None | Your Backboard API key. |
| `SKULPTOR_DESIGNER_MODEL` | No | `moonshotai/kimi-k3` | The model that makes the design. |
| `SKULPTOR_CRITIC_MODEL` | No | `moonshotai/kimi-k3` | The model that checks the build. It must accept images. |
| `SKULPTOR_PROVIDER` | No | `openrouter` | The provider Backboard uses to reach the models. |

Model names use OpenRouter model IDs that Backboard serves.

## Output

Skulptor adds these files to your project:

* `design/request.md`: your request, word for word.
* `design/README.md`: the design spec.
* `design/prototype.html`: the HTML prototype.
* `design/prototype-desktop.png`, `design/prototype-mobile.png` and their `-full` versions: screenshots of the prototype.
* `design/critique-round-1.md` (and round 2, if needed): the critic's notes.
* `screenshots/`: desktop and phone screenshots of your build.

If you don't want these in git, add `design/` and `screenshots/` to your `.gitignore`.

## Known limitations

* A run takes about 25 minutes and costs about $0.70 with the default models.
* Quality varies from run to run. Some designs come out too sparse, with empty space on desktop.
* Pages that fade in content as you scroll can screenshot as blank sections.
* The API sometimes fails with "fetch failed" on the first try. It usually works on the second try.
* It needs Chrome or Chromium installed for screenshots.

## Results

Same bakery prompt every time. Full logs and screenshots, with costs and times, are in [skulptor-lab](https://github.com/vector-10/skulptor-lab). The full story is in the [DEV write up](https://dev.to/vectorware/beyond-the-purple-gradient-i-gave-an-open-coding-agent-a-design-team-2gah).

| Run | Models | Cost | Result |
|---|---|---|---|
| No skill | DeepSeek | $0.13 | Generic template, repeats itself |
| No skill | Kimi K3 | $1.09 | Generic template, repeats itself |
| Skulptor v2 | DeepSeek only | $0.05 | Its own idea (a morning timeline), some empty space |
| Skulptor v3 | Kimi K3 designs and checks, DeepSeek builds | about $0.70 | Its own idea, exact build, but sparse |
| Skulptor v3, fresh run | Same as above | about $0.70 (estimated) | The best page so far (the live demo) |

What I learned:

* Every model gives the same template from a short prompt. A stronger model alone does not fix it.
* Splitting the designer and the builder makes the build exact.
* A critic needs a picture to compare against. Vague critique ("improve it") gives random results.
* A good prompt reads like a client brief: all the facts, and no style words.

## What's inside

```
.agents/skills/skulptor/
  SKILL.md                  steps for the coding agent
  scripts/
    backboard.mjs           calls a model through the Backboard API
    design.mjs              designer: writes the handoff and prototype
    screenshot.mjs          desktop and phone screenshots with Chrome
    critique.mjs            critic: compares the build with the prototype
  references/
    designer-prompt.md, spec-template.md, design-rules.md, critic-prompt.md
examples/bakery/            3 photos for the sample request
```

## Credits

* [R-CLI](https://github.com/Backboard-io/Backboard-R-CLI) by Backboard (MIT): the coding agent Skulptor was built and tested with.
* [Backboard](https://backboard.io): model access through one API key.
* [Kimi K3](https://huggingface.co/moonshotai) by Moonshot AI and [DeepSeek V4.1 Flash](https://huggingface.co/deepseek-ai) by DeepSeek: the open weight models.
* [Anthropic's frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design): the list of common AI design looks to avoid in `design-rules.md` is adapted from it.

## License

MIT. See [LICENSE](LICENSE).

Built for the Hacktoberfest 2026 DEV Challenge, Week 2.
