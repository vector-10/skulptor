#!/usr/bin/env node
// Skulptor screenshot script.
// Run it inside an app folder. It starts the dev server, waits for the page,
// saves screenshots to ./screenshots, then stops the server:
//   desktop.png, mobile.png            the first screen (what shows before scrolling)
//   desktop-full.png, mobile-full.png  the whole page
// With --file <page.html> it opens that static file instead (no dev server).
// --out <folder> and --prefix <text> change where images go and how they are named.
// No packages needed: it uses Node and the Chrome already installed.
// Full page screenshots need Node 22+ (built in WebSocket); older Node gets first screen only.

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    file: { type: "string" },
    out: { type: "string", default: "screenshots" },
    prefix: { type: "string", default: "" },
  },
});

const PORT = 5199;
const URL = args.file ? pathToFileURL(resolve(args.file)).href : `http://localhost:${PORT}/`;
const WAIT_MS = 30_000;
// Time for React (or web fonts) to render after the page load event.
const RENDER_MS = 1_000;
// Very tall images get scaled down by models until text is unreadable, so cap the full page height.
const MAX_FULL_HEIGHT = 8_000;
const SIZES = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function withTimeout(promise, ms, message) {
  return Promise.race([promise, sleep(ms).then(() => Promise.reject(new Error(message)))]);
}

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
    await sleep(500);
  }
  throw new Error(`page did not load at ${URL} within ${WAIT_MS / 1000}s`);
}

function outPath(name) {
  return resolve(args.out, `${args.prefix}${name}.png`);
}

function save(name, base64) {
  const out = outPath(name);
  writeFileSync(out, Buffer.from(base64, "base64"));
  return out;
}

// Minimal Chrome DevTools Protocol client over the built in WebSocket.
function connect(wsUrl) {
  return new Promise((resolveConn, rejectConn) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 1;
    const pending = new Map();
    const waiters = [];
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      } else if (msg.method) {
        const i = waiters.findIndex((w) => w.method === msg.method && w.sessionId === msg.sessionId);
        if (i !== -1) waiters.splice(i, 1)[0].res(msg.params);
      }
    };
    ws.onerror = () => rejectConn(new Error("could not connect to Chrome"));
    ws.onopen = () =>
      resolveConn({
        send(method, params = {}, sessionId) {
          const id = nextId++;
          ws.send(JSON.stringify({ id, method, params, sessionId }));
          return new Promise((res, rej) => pending.set(id, { res, rej }));
        },
        once(method, sessionId) {
          return new Promise((res) => waiters.push({ method, sessionId, res }));
        },
        close() {
          ws.close();
        },
      });
  });
}

async function fullScreenshots(chrome) {
  // A temp profile so it never touches the user's open Chrome.
  const profile = mkdtempSync(join(tmpdir(), "skulptor-chrome-"));
  const browser = spawn(
    chrome,
    ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${profile}`, "--remote-debugging-port=0", "about:blank"],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  try {
    const wsUrl = await withTimeout(
      new Promise((res, rej) => {
        let log = "";
        browser.stderr.on("data", (chunk) => {
          log += chunk;
          const match = log.match(/DevTools listening on (ws:\/\/\S+)/);
          if (match) res(match[1]);
        });
        browser.on("exit", (code) => rej(new Error(`Chrome exited early (code ${code})`)));
      }),
      10_000,
      "Chrome did not start within 10s",
    );
    const cdp = await connect(wsUrl);
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    const page = (method, params) => cdp.send(method, params, sessionId);
    await page("Page.enable");

    const outputs = [];
    for (const { name, width, height, mobile } of SIZES) {
      await page("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
      const loaded = cdp.once("Page.loadEventFired", sessionId);
      await page("Page.navigate", { url: URL });
      await withTimeout(loaded, WAIT_MS, `page did not finish loading for ${name}`);
      await sleep(RENDER_MS);

      const first = await page("Page.captureScreenshot", { format: "png" });
      outputs.push(save(name, first.data));

      const { cssContentSize } = await page("Page.getLayoutMetrics");
      const fullHeight = Math.min(Math.ceil(cssContentSize.height), MAX_FULL_HEIGHT);
      const full = await page("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width, height: fullHeight, scale: 1 },
      });
      outputs.push(save(`${name}-full`, full.data));
    }
    cdp.close();
    return outputs;
  } finally {
    // Wait for Chrome to exit before removing its profile, or it is still writing files there.
    if (browser.exitCode === null && browser.signalCode === null) {
      const exited = new Promise((r) => browser.once("exit", r));
      browser.kill();
      await withTimeout(exited, 5_000, "Chrome did not exit").catch(() => browser.kill("SIGKILL"));
    }
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    } catch {
      // Only a temp folder; the OS cleans it up.
    }
  }
}

// Fallback for Node without WebSocket: first screen only, using Chrome's screenshot flag.
function firstScreenScreenshots(chrome) {
  return SIZES.map(({ name, width, height }) => {
    const out = outPath(name);
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
  });
}

async function takeScreenshots(chrome) {
  if (typeof WebSocket === "undefined") {
    console.warn(`Node ${process.version} has no WebSocket (needs 22+). Taking first screen screenshots only.`);
    return firstScreenScreenshots(chrome);
  }
  return fullScreenshots(chrome);
}

async function main() {
  const chrome = findChrome();
  if (!chrome) throw new Error("Chrome not found. Set CHROME_PATH to your Chrome or Chromium binary.");
  mkdirSync(args.out, { recursive: true });

  if (args.file) {
    if (!existsSync(args.file)) throw new Error(`No file at ${args.file}`);
    for (const out of await takeScreenshots(chrome)) console.log(out);
    return;
  }

  if (!existsSync("package.json")) throw new Error("No package.json here. Run this inside the app folder.");
  const server = startServer();
  process.on("SIGINT", () => {
    stopServer(server);
    process.exit(1);
  });

  try {
    await waitForPage(server);
    for (const out of await takeScreenshots(chrome)) console.log(out);
  } finally {
    stopServer(server);
  }
}

main().catch((err) => {
  console.error(`screenshot failed: ${err.message}`);
  process.exit(1);
});
