# Experiments

## Test 1: base design quality (no design layer)

Same prompt for every model, in a fresh folder, with no extra rules:

> Create a contact.html page with a modern contact card using HTML and CSS. Show name, phone, email and company. Tell me your plan before you code it, and wait for my OK.

| Date | Harness | Model | Waited for OK? | Worked? | Cost | Time | Notes | Screenshot |
|---|---|---|---|---|---|---|---|---|
| Oct 14 | R-CLI 3.0.5 | moonshotai/kimi-k3 | No | Yes | ~$0.06 (with hello tests) | | Generic purple gradient, low contrast labels, mixed emoji icons | notes/kimi.png |
| Oct 14 | R-CLI 3.0.5 | z-ai/glm-5.3 (medium) | ? | Yes | ~$0.06 (both GLM runs) | | Same template as Kimi, only colors changed (blue on navy) | notes/glm.png |
| Oct 14 | R-CLI 3.0.5 | deepseek/deepseek-v4.1-flash (clean folder) | ? | Yes | ~$0.01 | | Same template again: purple accent, initials circle, centered dark card | notes/deepseek.png |

## Test 2: one round of human critique

Follow up prompt, same GLM session:

> That was decent but it looks boring like AI, maybe make the card landscape, less border radius. Do your best work like you want to get hired as a SWE.

| Date | Harness | Model | Result | Screenshot |
|---|---|---|---|---|
| Oct 14 | R-CLI 3.0.5 | deepseek/deepseek-v4.1-flash | Big jump: editorial look, serif name, dark side panel, red accent, cream background. Invented almost nothing. Still small with lots of empty space; "CONTACT" label under initials means nothing. | notes/deepseek-improved.png |
| Oct 14 | R-CLI 3.0.5 | z-ai/glm-5.3 (medium) | Big jump: landscape card, matching line icons, clear hierarchy, yellow accent. Still repeats the company, invents fields (location, timezone, "NO. 0042"), empty left panel. | notes/glm-improved.png |

## Test 1b: contaminated runs (not a fair test)

Run in the same folder as the GLM files, with R-CLI memory possibly on.

| Date | Harness | Model | Result | Cost | Screenshot |
|---|---|---|---|---|---|
| Oct 14 | R-CLI 3.0.5 | deepseek/deepseek-v4.1-flash | Copied the improved GLM layout and its invented extras (ref number, status, hours). Best looking so far, but not its own work. | ~$0.01 for both runs | notes/seek-contaminated.png |
| Oct 14 | R-CLI 3.0.5 | deepseek/deepseek-v4.1-flash | After "improve it": removed all color and character. Overcorrected into a plain form. | (included above) | notes/seek-overcorrected.png |

## Test 3: React + TypeScript validation (tasks.md)

R-CLI 3.0.5, deepseek/deepseek-v4.1-flash, run inside `test-app/`, fresh thread, memory off. Reset to baseline between tasks.

| Date | Task | tsc | build | Renders | Result | Cost | Time | Notes |
|---|---|---|---|---|---|---|---|---|
| Oct 15 | 1. Add ContactCard component | Pass | Pass | Pass | Pass | < $0.01 | Fast | Card with typed props, real tel/mailto links, unstyled (expected) |
| Oct 15 | 2. Light/dark toggle with localStorage | Pass | Pass | Pass | Pass | ~$0.02 | 6m 50s | Read the code first, set theme before paint (no flash), reused existing button styles, ran tsc, build and eslint itself, then wrote a headless Chrome test and fixed its own wrong test assumptions. 15/15 checks. |
| Oct 15 | 3. Fix planted counter bug | Pass | Pass | Pass | Pass | | Fast | Found the bug from the symptom alone, one line fix, ran build and lint. Did not read tasks.md. Its search tool failed because ripgrep (`rg`) isn't installed, so it fell back to `find`. |

**Result: 3 of 3 tasks passed. DeepSeek V4.1 Flash in R-CLI can reliably change a real React + TypeScript app. Validation passed; move on to the design layer.**

## Findings so far

* Different models produce the same default template from a short prompt.
* The model can design well. One round of critique unlocked it. Skulptor's job is to automate that critique.
* Context matters: nearby files or memory change the output a lot. Clean tests need an empty folder and a fresh thread. The design layer can use this on purpose with good examples.
* Keep task prompts and answers outside the agent's reach. The agent can see the whole repo (it ran git status on the parent folder), so tasks.md inside the repo could spoil a test.
* Vague critique ("improve it") gives random results, even worse ones. Critique must say what to fix, what to keep, and why.
* Critique rules seen so far: don't repeat information, don't invent content that wasn't asked for, avoid empty dead space, use one consistent icon set, keep labels readable.
