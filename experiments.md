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

Baseline: fresh Vite React + TS app with one planted bug (the counter's `count + 1` changed to `count - 1`).

Task prompts, pasted exactly:

1. Create a ContactCard component in src/components/ContactCard.tsx. It takes name, phone, email and company as typed props. Render one ContactCard in App.tsx with sample data.
2. Add a button that switches the page between light and dark mode. Remember the choice in localStorage so it stays after a page reload.
3. The counter button goes down when I click it. It should go up. Find the bug and fix it.

Pass criteria, checked with tools: `pnpm exec tsc -b` passes, `pnpm build` passes, `pnpm dev` shows the change in the browser, and at least 2 of 3 tasks pass with no help.

Reset between runs, from the repo root:

```
git checkout -- test-app
git clean -fd test-app
rm -rf test-app/.backboard test-app/screenshots
```

| Date | Task | tsc | build | Renders | Result | Cost | Time | Notes |
|---|---|---|---|---|---|---|---|---|
| Oct 15 | 1. Add ContactCard component | Pass | Pass | Pass | Pass | < $0.01 | Fast | Card with typed props, real tel/mailto links, unstyled (expected) |
| Oct 15 | 2. Light/dark toggle with localStorage | Pass | Pass | Pass | Pass | ~$0.02 | 6m 50s | Read the code first, set theme before paint (no flash), reused existing button styles, ran tsc, build and eslint itself, then wrote a headless Chrome test and fixed its own wrong test assumptions. 15/15 checks. |
| Oct 15 | 3. Fix planted counter bug | Pass | Pass | Pass | Pass | | Fast | Found the bug from the symptom alone, one line fix, ran build and lint. Did not read tasks.md. Its search tool failed because ripgrep (`rg`) isn't installed, so it fell back to `find`. |

**Result: 3 of 3 tasks passed. DeepSeek V4.1 Flash in R-CLI can reliably change a real React + TypeScript app. Validation passed; move on to the design layer.**

## Test 4: Skulptor skill, first run

R-CLI 3.0.5, deepseek/deepseek-v4.1-flash, inside `test-app/`, fresh thread, memory off, skill loaded with `/skills`. Compare with Test 1.

> $skulptor Create a contact card page in this app. Show name, phone, email and company.

| Date | tsc | build | Renders | Cost | Time | Result |
|---|---|---|---|---|---|---|
| Oct 15 | Pass | Pass | Pass | | 6m 45s | Big design jump: "letterpress" direction, large serif name, one amber accent, mono labels, no icons or avatar. No default template, nothing invented beyond sample data, real tel/mailto links, mobile stacks fine. It ran the screenshot script and checked light mode on its own. Misses: lots of empty space on desktop (rule 3), Vite starter borders still visible (it saw the leftover CSS but called it out of scope). The report had no brief, no rounds and no issue list, so the critique step was weak or skipped. |

## Test 5: Skulptor skill, bakery landing page

Same setup as Test 4, with the 8 design rules and full page screenshots. Prompt: one page site for "Crumb & Co" bakery (hero, 6 item menu, hours, visit us), warm and modern, must look great on a phone.

| Date | tsc | build | Renders | Cost | Time | Result |
|---|---|---|---|---|---|---|
| Oct 15 | Pass | Pass | Pass | Small (credits left: $4.65) | 22m 58s | Real brand: cream, espresso, paprika accent, Fraunces serif, arch photo, stamp, menu with price leaders. Did 2 critique rounds and fixed 3 issues. Mobile strong. Misses: desktop feels basic and sparse, stamp text overlaps ("BAKEDBAKED"), "14 Mill Street" may render as "¼", fonts and photos load from the internet, report skipped the brief and critique text. User verdict: tasteful but basic, better on mobile than desktop. |

## Test 6: Skill v2, bakery landing page

Skill v2 (Plan step, 5 default looks to avoid, rule 9) and a new prompt (no style adjectives, asks for ambition, no screen size bias). Skill and prompt changed together, so this is not a clean comparison with Test 5.

| Date | tsc | build | Renders | Cost | Time | Result |
|---|---|---|---|---|---|---|
| Oct 16 | Not checked | Not checked | Pass | $0.05 ($4.61 → $4.56) | ~20m+ | Best page so far. "Pre-dawn kitchen" direction: near black night sections alternate with off white day sections, one amber "oven glow" accent, Bricolage Grotesque + Newsreader. Signature: a weekday timeline (4am ovens lit → 7am open → 10am croissants gone → 6pm close), vertical list on mobile. Avoided cliché 1 and cliché 5. Real two column desktop layouts (rule 9 worked). Stamp bug gone. Good accessibility (44px targets, focus rings, reduced motion, alt text). Misses: desktop dead space (hours, visit, hero title fills a third of the width), very tall menu banner, same rounded photo treatment 3 times, small low contrast menu descriptions, Google Fonts load from the internet. To check against the prompt: "since 2009", "two sisters", "36 hour ferment". |

## Test 7: skill v2 vs skill v3 (Kimi K3 designs and critiques, DeepSeek builds)

Same prompt for both, pasted exactly. 7a: skill v2 (commit d2f55c2). 7b: skill v3. R-CLI, deepseek/deepseek-v4.1-flash, inside `test-app/`, fresh thread, memory off, skill loaded with `/skills`. Reset between runs.

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

| Test | Date | tsc | build | Renders | Cost | Time | Result |
|---|---|---|---|---|---|---|---|
| 7a (v2) | Skipped | | | | | | User's call: Test 6 (v2, similar bakery prompt) serves as the visual baseline. |
| 7b (v3) | Oct 16 | Pass | Pass | Pass | $0.67 Kimi ($0.48 design + $0.19 critique) + DeepSeek | 25m 06s | The handoff works: the build is almost pixel identical to Kimi's prototype on desktop and mobile, critic said MATCH in round 1. Design: "the page is set at 4am": warm near black, flour white type, amber only on the "4am" oven clock (signature, with a glow), prices and link hovers; Fraunces + Work Sans; real menu with dotted leaders. No invented facts (Test 6 had added "seventy two layers" etc.). No clichés from the list. DeepSeek also fixed a leftover favicon on its own. Misses: dead space on desktop (under the hero text, around the 4am block, below the menu list, under hours) and a big gap on mobile between photos; plainer than Test 6 (no timeline); still Google Fonts. Critic missed one real difference ("Closed" is italic in the prototype, upright in the build) and claimed both were italic. Both scripts hit "fetch failed" on the first try and worked on retry. |

## Test 8: skill v3, fashion label, client style prompt

Not a clean run: `test-app/` still had the Test 7b bakery page (no reset). Prompt: a client message from a made up Lagos womenswear designer (Ọ̀dà Studio, adire and aso-oke, collection "Indigo Hours", 6 pieces with ₦ prices, studio, hours, contacts), no photos, "Surprise me", laptop and phone. Full prompt in the chat log of Oct 16.

| Date | tsc | build | Renders | Cost | Time | Result |
|---|---|---|---|---|---|---|
| Oct 16 | Pass | Pass | Pass | $0.67 Kimi ($0.54 design + $0.13 critique) + DeepSeek | 34m 15s | Build matches the prototype again (critic MATCH). Design drawn from the subject: indigo and gold, adire resist rings as an SVG pattern, an aso-oke strip band through a huge "Ọ̀dà" wordmark, real price list, "Made for you, not off a rack." No invented facts. User verdict: worse than the bakery. Misses: no photos (the prompt said none), which leaves a fashion site with nothing to show; a small fabric swatch tile looks like a placeholder; dead space left of the collection list; wordmark and band collide awkwardly; lowercase italic labels with a dash before each heading (a template habit close to default 5); contact links 32px tall although the spec asked for 44px, and neither builder nor critic fixed it. |

## Test 9: raw Kimi K3 by script (did not complete)

A Node script (outside R-CLI) sent the bakery prompt plus "Fill the page: make it rich and full, not sparse" straight to Kimi K3 through the Backboard API, with no skill rules. Oct 16. The user reported it did not work; no output kept. Replaced by Test 10.

## Test 10: raw Kimi K3 in R-CLI, no skill

Kimi K3 (`moonshotai/kimi-k3`) as the only model in R-CLI, building the bakery page in a fresh Vite React app at `~/Desktop/kimi-test`, with no Skulptor skill. Prompt: the Test 7 bakery prompt, without `$skulptor`. The goal was to check whether a top open design model does better alone. Screenshots are in `notes/test10-raw-kimi/`. They were taken with reduced motion on, because the page hides each section until you scroll to it, so a normal full page screenshot shows blank sections.

| Date | tsc | build | Renders | Cost | Time | Result |
|---|---|---|---|---|---|---|
| Oct 17 | | Pass (dist built) | Pass | $1.09 ($3.10 → $2.01) | ~20m | User verdict: only a bit better than Skulptor with DeepSeek. It uses all 3 photos, fills the page, and has a clean menu with dotted leaders and a muted "Closed" for Sunday. But it is the standard bakery template: centered hero title with two pill buttons, a scroll mouse icon, a scrolling text band, an eyebrow label over every heading, cards with shadows, and everything centered from the menu down. Copy repeats a lot: "Fresh bread every morning since 2009" appears 5 times (hero, band, menu heading, footer) and "ovens are lit at 4am" 3 times, because the prompt's content is short. The About section is one line. There is still dead space (around the hours card and the visit block). Content is invisible until you scroll (fade in animations). |

## Test 11: raw DeepSeek V4.1 Flash in R-CLI, no skill

Same setup as Test 10 with `deepseek/deepseek-v4.1-flash`: a fresh Vite React app at `~/Desktop/deepseek-test`, the Test 7 bakery prompt without `$skulptor`, fresh thread. Screenshots (reduced motion) are in `notes/test11-raw-deepseek/`.

| Date | tsc | build | Renders | Cost | Time | Result |
|---|---|---|---|---|---|---|
| Oct 17 | | | Pass | $0.13 ($2.01 → $1.88) | 23m 26s | User verdict: almost the same as raw Kimi; fills more space and repeats a lot. Real two column layouts on desktop, all 3 photos used (loaves twice), menu as 6 small cards, a live "Open now, until 4pm" badge and a "TODAY" highlight on the hours (a real, useful touch), call and email buttons. But the same generic template: eyebrow labels with a line, rounded cards with shadows everywhere, pill tags, a dark gradient hero. Repeats: "since 2009" 5 times (eyebrow, tagline, tag, menu heading, footer), "Mill Street" 4 times, the open badge twice, the address, phone and email twice. Tags like "Two sisters" just restate the About line. Dead space on the right of the hours card. Scroll fade in animations again. |

### Three way comparison, same bakery prompt

| Run | Models | Cost | Time | Look |
|---|---|---|---|---|
| Test 11 | DeepSeek alone | $0.13 | 23m | Generic template, full, repeats a lot |
| Test 10 | Kimi K3 alone | $1.09 | ~20m | Generic template, centered, repeats a lot |
| Test 7b | Skulptor v3 (Kimi designs and checks, DeepSeek builds) | $0.67 + DeepSeek | 25m | Its own idea ("set at 4am"), no repeats, nothing invented, but sparse with dead space |
| Test 6 | Skulptor v2 (DeepSeek alone with the skill) | $0.05 | ~20m | Its own idea (morning timeline), some dead space |

## Test 12: skill v3, bakery, live demo run

Fresh Vite React app at `~/Desktop/fullstack/skulptor-demo`, the Test 7 bakery prompt, photos from `examples/bakery/`, skill v3 copied into `.agents/skills/`. R-CLI with deepseek/deepseek-v4.1-flash. This is the page deployed as the live demo. Screenshots in `notes/test12-demo/`.

| Date | tsc | build | Renders | Cost | Time | Result |
|---|---|---|---|---|---|---|
| Oct 18 | | Pass (dist built) | Pass | | | Best page of the project. Build matches Kimi's prototype exactly. Dark hero with a real croissant photo and a big serif headline with amber italic words, a "4:00 AM, Ovens lit" clock card as the signature, menu grouped into Bread and Pastries with dotted leaders, hours and visit side by side, a large wordmark footer ("See you in the morning."). No repeated copy, nothing invented. Misses: empty space left of the About text on desktop, an abrupt amber glow band under the hero. |

## Findings so far

* Different models produce the same default template from a short prompt.
* The model can design well. One round of critique unlocked it. Skulptor's job is to automate that critique.
* Context matters: nearby files or memory change the output a lot. Clean tests need an empty folder and a fresh thread. The design layer can use this on purpose with good examples.
* Keep task prompts and answers outside the agent's reach. The agent can see the whole repo (it ran git status on the parent folder), so tasks.md inside the repo could spoil a test.
* Vague critique ("improve it") gives random results, even worse ones. Critique must say what to fix, what to keep, and why.
* Critique rules seen so far: don't repeat information, don't invent content that wasn't asked for, avoid empty dead space, use one consistent icon set, keep labels readable.
