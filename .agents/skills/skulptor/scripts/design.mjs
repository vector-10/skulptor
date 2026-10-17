#!/usr/bin/env node
// Skulptor designer step. Save the user's request, word for word, to design/request.md,
// then run this inside the app folder:
//   node <skill folder>/scripts/design.mjs
// (A file, not a command line argument, so text like "$8.50" is not changed by the shell.)
// A designer model (Kimi K3 by default) writes a handoff into ./design:
//   README.md       the spec: tokens, layout per section, exact copy, checklist
//   prototype.html  a static page showing the intended design
// Then it screenshots the prototype: design/prototype-{desktop,mobile}[-full].png
// Change the model with SKULPTOR_DESIGNER_MODEL (an OpenRouter model id).

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { ask, DEFAULT_MODEL, formatCost } from "./backboard.mjs";

const SKILL = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = "design";
const MODEL = process.env.SKULPTOR_DESIGNER_MODEL || DEFAULT_MODEL;
// Photos the designer can see and use. Larger files are listed but not attached.
const IMAGE_DIRS = ["src/assets", "public", "assets", "images"];
const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;
const MAX_ATTACH = 6;
const MAX_ATTACH_BYTES = 8 * 1024 * 1024;

const read = (path) => readFileSync(join(SKILL, path), "utf8");

function findImages() {
  const found = [];
  for (const dir of IMAGE_DIRS) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (IMAGE_EXT.test(name) && statSync(path).isFile()) found.push(path);
    }
  }
  return found;
}

// The reply holds files between <<<FILE path>>> and <<<END>>> markers.
function parseFiles(text) {
  const files = {};
  for (const match of text.matchAll(/<<<FILE\s+([^\s>]+)\s*>>>\s*\n([\s\S]*?)\n?<<<END>>>/g)) {
    files[match[1].replace(/^design\//, "")] = match[2].replace(/^```[a-z]*\n/, "").replace(/\n```\s*$/, "");
  }
  return files;
}

async function main() {
  if (!existsSync("package.json")) throw new Error("No package.json here. Run this inside the app folder.");
  const requestFile = join(OUT, "request.md");
  if (!existsSync(requestFile)) throw new Error(`Save the user's request, word for word, to ${requestFile} first.`);
  const request = readFileSync(requestFile, "utf8").trim();
  if (!request) throw new Error(`${requestFile} is empty.`);

  const images = findImages();
  const attach = images.filter((p) => statSync(p).size <= MAX_ATTACH_BYTES).slice(0, MAX_ATTACH);
  const imageList = images.length
    ? images.map((p) => `- ${relative(OUT, p)}${attach.includes(p) ? " (attached, in this order)" : ""}`).join("\n")
    : "- none. Design without photos.";

  const content = [
    "# The user's request (word for word)",
    request,
    "",
    "# Images in the app",
    "Paths are relative to design/prototype.html. Use only these images, and only if they fit.",
    imageList,
    "",
    "# Spec template (fill it in for design/README.md)",
    read("references/spec-template.md"),
    "",
    "# Design rules",
    read("references/design-rules.md"),
  ].join("\n");

  console.log(`Asking ${MODEL} for a design. This can take a few minutes...`);
  const reply = await ask({
    model: MODEL,
    system: read("references/designer-prompt.md"),
    content,
    images: attach.map((path) => ({ path })),
  });
  writeFileSync(join(OUT, "designer-reply.md"), reply.text);

  const files = parseFiles(reply.text);
  for (const name of ["README.md", "prototype.html"]) {
    if (!files[name]) {
      throw new Error(`The designer's reply has no ${name}. Raw reply saved to ${OUT}/designer-reply.md. ${formatCost(reply)}`);
    }
    writeFileSync(join(OUT, name), files[name]);
  }

  const shot = spawnSync(
    process.execPath,
    [join(SKILL, "scripts/screenshot.mjs"), "--file", join(OUT, "prototype.html"), "--out", OUT, "--prefix", "prototype-"],
    { stdio: "inherit" },
  );
  if (shot.status !== 0) throw new Error("Could not screenshot the prototype (see the error above).");

  console.log(`
Design ready in ${OUT}/:
  README.md                  the spec. Follow it exactly.
  prototype.html             the prototype. Port it to this app.
  prototype-desktop-full.png the visual source of truth (desktop)
  prototype-mobile-full.png  the visual source of truth (mobile)
Designer: ${MODEL}, ${formatCost(reply)}`);
}

main().catch((err) => {
  console.error(`design failed: ${err.message}`);
  process.exit(1);
});
