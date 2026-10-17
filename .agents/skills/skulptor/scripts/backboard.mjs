// Skulptor: one shared function to ask a model through the Backboard API.
// Sends text plus optional images, streams the reply, returns text and cost.
// Needs BACKBOARD_API_KEY, from the environment or a .env file in this folder or a parent.
// No packages needed: Node 22+ (fetch, FormData, Blob).

import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";

const API = "https://app.backboard.io/api/threads/messages";
const PROVIDER = process.env.SKULPTOR_PROVIDER || "openrouter";
export const DEFAULT_MODEL = "moonshotai/kimi-k3";

const IMAGE_TYPES = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

function findKey() {
  if (process.env.BACKBOARD_API_KEY) return process.env.BACKBOARD_API_KEY;
  // Walk up from the current folder, so a key in the repo root works inside an app folder.
  let dir = resolve(".");
  while (true) {
    const file = join(dir, ".env");
    if (existsSync(file)) {
      for (const line of readFileSync(file, "utf8").split("\n")) {
        const match = line.match(/^\s*BACKBOARD_API_KEY\s*=\s*(.*)\s*$/);
        if (match) return match[1].replace(/^["']|["']$/g, "");
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("BACKBOARD_API_KEY not found. Set it in the environment or in a .env file.");
}

// images: [{ path, name }] in the order the model should see them.
export async function ask({ model = DEFAULT_MODEL, system, content, images = [] }) {
  const form = new FormData();
  form.append("content", content);
  if (system) form.append("system_prompt", system);
  form.append("llm_provider", PROVIDER);
  form.append("model_name", model);
  form.append("memory", "off");
  // Streaming keeps the connection busy, so long replies don't hit Node's 5 minute header timeout.
  form.append("stream", "true");
  for (const image of images) {
    const type = IMAGE_TYPES[extname(image.path).toLowerCase()];
    if (!type) throw new Error(`not a supported image: ${image.path}`);
    form.append("files", new Blob([readFileSync(image.path)], { type }), image.name || basename(image.path));
  }

  const res = await fetch(API, { method: "POST", headers: { "X-API-Key": findKey() }, body: form });
  if (!res.ok) throw new Error(`Backboard returned ${res.status}: ${(await res.text()).slice(0, 500)}`);

  // Some setups may answer with plain JSON instead of a stream.
  if ((res.headers.get("content-type") || "").includes("application/json")) {
    const j = await res.json();
    return { text: j.content ?? "", cost: j.cost_usd ?? null, inputTokens: j.input_tokens, outputTokens: j.output_tokens };
  }

  let text = "";
  let ended = null;
  let buffer = "";
  const decoder = new TextDecoder();
  const handle = (line) => {
    if (!line.startsWith("data:")) return;
    const data = line.slice(5).trim();
    if (!data || data === "[DONE]") return;
    let event;
    try {
      event = JSON.parse(data);
    } catch {
      return;
    }
    if (event.type === "content_streaming") text += event.content ?? "";
    else if (event.type === "run_ended") ended = event;
    else if (event.type === "run_failed" || event.type === "error") {
      throw new Error(`model run failed: ${event.error_type ?? ""} ${event.error ?? JSON.stringify(event)}`);
    }
    // Other event types are ignored on purpose.
  };
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    lines.forEach(handle);
  }
  handle(buffer);

  // Per the Backboard docs, a stream without run_ended has failed.
  if (!ended) throw new Error("the reply stream ended without finishing (no run_ended event)");
  return { text, cost: ended.cost_usd ?? null, inputTokens: ended.input_tokens, outputTokens: ended.output_tokens };
}

export function formatCost({ cost, inputTokens, outputTokens }) {
  const money = typeof cost === "number" ? `$${cost.toFixed(4)}` : "cost unknown";
  return `${money} (${inputTokens ?? "?"} tokens in, ${outputTokens ?? "?"} out)`;
}
