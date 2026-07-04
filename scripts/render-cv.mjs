import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const htmlPath = path.join(root, "cv", "tiger-strake-cv.html");
const pdfPath = path.join(root, "public", "docs", "tiger-strake-cv.pdf");
const publicTexPath = path.join(root, "public", "docs", "tiger-strake-cv.tex");
const sourceTexPath = path.join(root, "cv", "tiger-strake-cv.tex");
const screenshotDir = path.join(root, "tmp", "cv-render");
const chromeProfileDir = path.join(root, "tmp", "chrome-cv-profile");

const htmlUrl = pathToFileURL(htmlPath).href;

await fs.mkdir(screenshotDir, { recursive: true });
await fs.mkdir(chromeProfileDir, { recursive: true });
await fs.copyFile(sourceTexPath, publicTexPath);

const baseArgs = [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-dev-shm-usage",
  `--user-data-dir=${chromeProfileDir}`,
];

async function waitForOutput(filePath, minBytes, timeoutMs = 30000) {
  const start = Date.now();
  let previousSize = -1;
  let stableReads = 0;

  while (Date.now() - start < timeoutMs) {
    try {
      const stats = await fs.stat(filePath);
      if (stats.size >= minBytes) {
        if (stats.size === previousSize) {
          stableReads += 1;
        } else {
          stableReads = 0;
          previousSize = stats.size;
        }
        if (stableReads >= 2) return stats;
      }
    } catch {
      // File is not ready yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${path.relative(root, filePath)}`);
}

async function runChrome(args, outputPath, minBytes) {
  await fs.rm(outputPath, { force: true });

  const child = spawn(chromePath, args, {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let logs = "";
  child.stdout.on("data", (chunk) => { logs += chunk.toString(); });
  child.stderr.on("data", (chunk) => { logs += chunk.toString(); });

  try {
    const stats = await waitForOutput(outputPath, minBytes);
    child.kill("SIGTERM");
    setTimeout(() => child.kill("SIGKILL"), 2500).unref();
    return { stats, logs };
  } catch (error) {
    child.kill("SIGKILL");
    throw new Error(`${error.message}\n${logs}`);
  }
}

console.log("Printing CV PDF...");
const pdfResult = await runChrome(
  [
    ...baseArgs,
    "--no-pdf-header-footer",
    `--print-to-pdf=${pdfPath}`,
    htmlUrl,
  ],
  pdfPath,
  100000,
);

console.log("Capturing page screenshots...");
for (const pageNumber of [1, 2]) {
  await runChrome(
    [
      ...baseArgs,
      "--hide-scrollbars",
      "--window-size=816,1056",
      `--screenshot=${path.join(screenshotDir, `page-${pageNumber}.png`)}`,
      `${htmlUrl}?page=${pageNumber}`,
    ],
    path.join(screenshotDir, `page-${pageNumber}.png`),
    10000,
  );
}

console.log(`Wrote ${path.relative(root, pdfPath)} (${Math.round(pdfResult.stats.size / 1024)} KB)`);
console.log(`Copied ${path.relative(root, publicTexPath)}`);
console.log(`Screenshots in ${path.relative(root, screenshotDir)}`);
