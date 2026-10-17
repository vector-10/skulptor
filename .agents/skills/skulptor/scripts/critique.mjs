#!/usr/bin/env node
// Skulptor critic step. Run it inside the app folder, after screenshot.mjs:
//   node <skill folder>/scripts/critique.mjs --round 1
// A critic model (Kimi K3 by default) compares the build with the prototype,
// section by section, and returns at most 3 mismatches with fixes.
// Saves the critique to design/critique-round-<n>.md and prints it.
// Change the model with SKULPTOR_CRITIC_MODEL (an OpenRouter model id).

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { ask, DEFAULT_MODEL, formatCost } from "./backboard.mjs";

const SKILL = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODEL = process.env.SKULPTOR_CRITIC_MODEL || DEFAULT_MODEL;

// Fixed order and names, so the critic never mixes up which image is which.
const IMAGES = [
  { path: "design/prototype-desktop-full.png", name: "1-PROTOTYPE-desktop.png" },
  { path: "screenshots/desktop-full.png", name: "2-BUILD-desktop.png" },
  { path: "design/prototype-mobile-full.png", name: "3-PROTOTYPE-mobile.png" },
  { path: "screenshots/mobile-full.png", name: "4-BUILD-mobile.png" },
];

async function main() {
  const { values } = parseArgs({ options: { round: { type: "string", default: "1" } } });
  for (const { path } of IMAGES) {
    if (!existsSync(path)) throw new Error(`Missing ${path}. Run design.mjs and screenshot.mjs first.`);
  }
  if (!existsSync("design/README.md")) throw new Error("Missing design/README.md. Run design.mjs first.");

  const content = [
    `# Round ${values.round}`,
    "",
    "Four images are attached, in this order:",
    "1. PROTOTYPE, desktop (1440px wide): the target",
    "2. BUILD, desktop (1440px wide): what was built",
    "3. PROTOTYPE, mobile (390px wide): the target",
    "4. BUILD, mobile (390px wide): what was built",
    "",
    "# The spec (design/README.md)",
    readFileSync("design/README.md", "utf8"),
  ].join("\n");

  console.log(`Asking ${MODEL} to compare the build with the prototype...`);
  const reply = await ask({ model: MODEL, system: readFileSync(join(SKILL, "references/critic-prompt.md"), "utf8"), content, images: IMAGES });

  const out = `design/critique-round-${values.round}.md`;
  writeFileSync(out, reply.text);
  console.log(`\n${reply.text}\n\nSaved to ${out}. Critic: ${MODEL}, ${formatCost(reply)}`);
}

main().catch((err) => {
  console.error(`critique failed: ${err.message}`);
  process.exit(1);
});
