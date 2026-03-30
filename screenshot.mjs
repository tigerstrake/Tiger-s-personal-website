// Usage: node screenshot.mjs <url> [label]
// Saves to ./temporary\ screenshots/screenshot-N[-label].png

import puppeteer from "puppeteer";
import { mkdir, readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOTS_DIR = join(__dirname, "temporary screenshots");

const url = process.argv[2] ?? "http://localhost:3000";
const label = process.argv[3];

await mkdir(SHOTS_DIR, { recursive: true });

// Find next N
const existing = await readdir(SHOTS_DIR).catch(() => []);
const nums = existing
  .map((f) => parseInt(f.match(/^screenshot-(\d+)/)?.[1] ?? "0"))
  .filter((n) => !isNaN(n));
const n = (Math.max(0, ...nums) + 1);
const filename = `screenshot-${n}${label ? `-${label}` : ""}.png`;
const outPath = join(SHOTS_DIR, filename);

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
// Wait a moment for canvas animation to settle
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();

console.log(`Saved: ${outPath}`);
