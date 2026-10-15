#!/usr/bin/env node
// Skulptor screenshot script.
// Run it inside an app folder. It starts the dev server, waits for the page,
// saves desktop and mobile screenshots to ./screenshots, then stops the server.
// No packages needed: it uses Node (18+) and the Chrome already installed.

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const PORT = 5199;
const URL = `http://localhost:${PORT}/`;
const WAIT_MS = 30_000;
const SIZES = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    if (spawnSync("which", [name]).status === 0) return name;
  }
  const mac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(mac)) return mac;
  return null;
}

function startServer() {
  // pnpm passes extra args to the script; npm needs "--" first.
  const usePnpm = existsSync("pnpm-lock.yaml");
  const cmd = usePnpm ? "pnpm" : "npm";
  const args = usePnpm
    ? ["run", "dev", "--port", String(PORT), "--strictPort"]
    : ["run", "dev", "--", "--port", String(PORT), "--strictPort"];
  // detached: the server gets its own process group, so we can stop all of it.
  return spawn(cmd, args, { detached: true, stdio: "ignore" });
}

function stopServer(server) {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    // already stopped
  }
}

async function waitForPage(server) {
  const start = Date.now();
  while (Date.now() - start < WAIT_MS) {
    if (server.exitCode !== null) throw new Error(`dev server exited early (code ${server.exitCode})`);
    try {
      const res = await fetch(URL);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`page did not load at ${URL} within ${WAIT_MS / 1000}s`);
}

function screenshot(chrome, { name, width, height }) {
  const out = resolve("screenshots", `${name}.png`);
  // A temp profile so it never touches the user's open Chrome.
  const profile = mkdtempSync(join(tmpdir(), "skulptor-chrome-"));
  const result = spawnSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--user-data-dir=${profile}`,
    `--window-size=${width},${height}`,
    "--virtual-time-budget=3000", // give React time to render
    `--screenshot=${out}`,
    URL,
  ]);
  rmSync(profile, { recursive: true, force: true });
  if (result.status !== 0 || !existsSync(out)) {
    throw new Error(`Chrome failed on ${name}: ${result.stderr?.toString().trim()}`);
  }
  return out;
}

async function main() {
  const chrome = findChrome();
  if (!chrome) throw new Error("Chrome not found. Set CHROME_PATH to your Chrome or Chromium binary.");
  if (!existsSync("package.json")) throw new Error("No package.json here. Run this inside the app folder.");

  mkdirSync("screenshots", { recursive: true });
  const server = startServer();
  process.on("SIGINT", () => {
    stopServer(server);
    process.exit(1);
  });

  try {
    await waitForPage(server);
    for (const size of SIZES) console.log(screenshot(chrome, size));
  } finally {
    stopServer(server);
  }
}

main().catch((err) => {
  console.error(`screenshot failed: ${err.message}`);
  process.exit(1);
});
