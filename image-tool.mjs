/**
 * Image crop/rotate tool for portfolio thumbnails.
 * Run: node image-tool.mjs
 * Open: http://localhost:3001
 */

import { createServer } from "http";
import { readFile, writeFile } from "fs/promises";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3002;

// ── Project list (slug → coverImage path relative to project root) ──────────
const PROJECTS = [
  { slug: "l1-rocket",                   label: "L1 Rocket",                       img: "images/L1 rocket/l1-rocket-held-in-lab.jpg" },
  { slug: "l2-rocket",                   label: "L2 Rocket",                       img: "images/L2 rocket/l2-dual-deploy.jpg" },
  { slug: "skyrunners-uav",              label: "SkyRunners UAV",                  img: "images/skurunners/skyrunners-cover.jpg" },
  { slug: "pulse-jet",                   label: "Pulse Jet",                       img: "images/pulse jet/pulse-jet-cover.webp" },
  { slug: "smart-light-switch",          label: "Smart Light Switch",              img: "images/smart light switch/smart-switch-cover.png" },
  { slug: "robotic-arm",                 label: "Robotic Arm",                     img: "images/robotic arm/robotic-arm-on-workbench.jpg" },
  { slug: "rocket-tvc",                  label: "Rocket TVC",                      img: "images/rocket tvc/rocket-tvc-cover.png" },
  { slug: "stratosphere-balloon",        label: "Stratosphere Balloon",            img: "images/stratosphere balloon/stratosphere-balloon-earth-curvature-view.png" },
  { slug: "esa-internship",              label: "ESA Internship",                  img: "images/ESA/esa-airbus-spacecraft-hardware-lab-coats.jpg" },
  { slug: "dlr-internship",             label: "DLR Internship",                  img: "images/DLR/dlr-optics-bench-experiment.jpg" },
  { slug: "eumetsat-internship",         label: "EUMETSAT Internship",             img: "images/EUMETSAT/eumetsat-satellite.jpg" },
  { slug: "fabrication-lab-eg",          label: "Fabrication Lab EG",              img: "images/Fabrication lab/fab-lab-students-3d-printers.jpg" },
  { slug: "ml-robotics-elderly",         label: "ML Robotics",                     img: "images/ML robot/ml-robot-cover.jpg" },
  { slug: "harvard-fabrication",         label: "Harvard Digital Fabrication",     img: "images/Harvard/harvard-cover.jpg" },
  { slug: "additive-manufacturing",      label: "AM Competition",                  img: "images/AM competition/am-championships-lasertec-cnc-slm-machine.jpg" },
  { slug: "bioengineering-ai-startup",   label: "Bioengineering Startup",          img: "images/startup/startup-davinci.jpg" },
  { slug: "infinity-studios",            label: "Short Film",                      img: "images/short film/short-film-cover.png" },
  { slug: "social-media-manager",        label: "Social Media Manager",            img: "images/social media manager/social-media-cover.png" },
  { slug: "dual-enrollment-hsl",         label: "Dual Enrollment HSL",             img: "images/dual enrollment/dual-enrollment-cover.png" },
];

const HTML = /* html */`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Thumbnail Editor</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #07080C; --surface: #0D0F17; --raised: #14161F;
    --border: rgba(255,255,255,0.08); --accent: #C8865A;
    --fg: #ECEDF2; --muted: #5A5F6E; --dim: #2A2D3A;
    --font: "Inter", system-ui, sans-serif;
  }
  html, body { height: 100%; background: var(--bg); color: var(--fg); font-family: var(--font); font-size: 13px; }
  body { display: flex; overflow: hidden; }

  /* Sidebar */
  #sidebar {
    width: 220px; flex-shrink: 0; background: var(--surface);
    border-right: 1px solid var(--border); overflow-y: auto;
    display: flex; flex-direction: column;
  }
  #sidebar h2 {
    padding: 16px 14px 10px; font-size: 10px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent);
    border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .proj-item {
    padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.04);
    color: var(--muted); transition: background 0.15s, color 0.15s; line-height: 1.3;
  }
  .proj-item:hover { background: var(--raised); color: var(--fg); }
  .proj-item.active { background: rgba(200,134,90,0.1); color: var(--accent); border-left: 2px solid var(--accent); }

  /* Main area */
  #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  #toolbar {
    display: flex; align-items: center; gap: 20px; padding: 12px 20px;
    background: var(--surface); border-bottom: 1px solid var(--border); flex-shrink: 0; flex-wrap: wrap;
  }
  #toolbar label { display: flex; align-items: center; gap: 8px; color: var(--muted); white-space: nowrap; }
  #toolbar input[type=range] { width: 120px; accent-color: var(--accent); cursor: pointer; }
  #toolbar span.val { color: var(--fg); font-variant-numeric: tabular-nums; min-width: 38px; }

  button {
    padding: 7px 16px; border-radius: 6px; border: none; cursor: pointer;
    font-size: 12px; font-weight: 600; letter-spacing: 0.03em; transition: opacity 0.15s;
  }
  button:hover { opacity: 0.85; }
  #btn-reset { background: var(--raised); color: var(--muted); border: 1px solid var(--border); }
  #btn-save  { background: var(--accent); color: #07080C; }
  #btn-load  { background: var(--raised); color: var(--fg); border: 1px solid var(--border); }
  #file-input { display: none; }

  #canvas-wrap {
    flex: 1; display: flex; align-items: center; justify-content: center;
    background: var(--bg); overflow: hidden; position: relative;
  }
  #canvas-outer {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  #frame-label {
    font-size: 10px; color: var(--dim); letter-spacing: 0.06em; text-transform: uppercase;
  }
  /* The thumbnail frame */
  #thumb-frame {
    position: relative; overflow: hidden;
    box-shadow: 0 0 0 1px var(--accent), 0 8px 40px rgba(0,0,0,0.6);
    border-radius: 6px; cursor: grab; user-select: none;
  }
  #thumb-frame:active { cursor: grabbing; }
  #thumb-frame canvas { display: block; }

  #hint {
    font-size: 11px; color: var(--dim); text-align: center; line-height: 1.6;
  }
  #status {
    position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
    background: rgba(200,134,90,0.15); border: 1px solid rgba(200,134,90,0.3);
    color: var(--accent); padding: 7px 18px; border-radius: 20px; font-size: 12px;
    opacity: 0; transition: opacity 0.3s; pointer-events: none;
  }
  #status.show { opacity: 1; }
  #divider { width: 1px; height: 24px; background: var(--border); }
</style>
</head>
<body>

<div id="sidebar">
  <h2>Projects</h2>
  ${PROJECTS.map((p, i) => `<div class="proj-item" data-idx="${i}">${p.label}</div>`).join("")}
</div>

<div id="main">
  <div id="toolbar">
    <input type="file" id="file-input" accept="image/*">
    <button id="btn-load" onclick="document.getElementById('file-input').click()">Load image…</button>
    <div id="divider"></div>

    <label>Zoom
      <input type="range" id="sl-zoom" min="10" max="400" value="100" step="1">
      <span class="val" id="val-zoom">100%</span>
    </label>

    <label>Rotate
      <input type="range" id="sl-rotate" min="-180" max="180" value="0" step="0.5">
      <span class="val" id="val-rotate">0°</span>
    </label>

    <div id="divider"></div>
    <button id="btn-reset">Reset</button>
    <button id="btn-save">Save thumbnail</button>
  </div>

  <div id="canvas-wrap">
    <div id="canvas-outer">
      <div id="frame-label">THUMBNAIL FRAME — drag · scroll to zoom · slider to rotate</div>
      <div id="thumb-frame">
        <canvas id="c"></canvas>
      </div>
      <div id="hint">Scroll to zoom &nbsp;·&nbsp; Drag to pan &nbsp;·&nbsp; Use sliders above</div>
    </div>
    <div id="status">Saved ✓</div>
  </div>
</div>

<script>
const PROJECTS = ${JSON.stringify(PROJECTS)};

// Frame dimensions: match the card thumbnail (370×160 shown at 2×)
const FW = 740, FH = 320;

const canvas = document.getElementById("c");
const ctx    = canvas.getContext("2d");
canvas.width  = FW;
canvas.height = FH;

const frame = document.getElementById("thumb-frame");
frame.style.width  = FW + "px";
frame.style.height = FH + "px";

// State
let img    = null;
let ox     = 0, oy = 0;   // pan offset (pixels)
let scale  = 1;             // zoom
let angle  = 0;             // rotation in degrees
let active = -1;

// ── Sliders ────────────────────────────────────────────────────────────────
const slZoom   = document.getElementById("sl-zoom");
const slRotate = document.getElementById("sl-rotate");
const valZoom  = document.getElementById("val-zoom");
const valRotate= document.getElementById("val-rotate");

slZoom.addEventListener("input", () => {
  scale = slZoom.value / 100;
  valZoom.textContent = slZoom.value + "%";
  draw();
});
slRotate.addEventListener("input", () => {
  angle = parseFloat(slRotate.value);
  valRotate.textContent = angle.toFixed(1) + "°";
  draw();
});

// ── Load project image ──────────────────────────────────────────────────────
function activateProject(idx) {
  document.querySelectorAll(".proj-item").forEach((el, i) => {
    el.classList.toggle("active", i === idx);
  });
  active = idx;
  const p = PROJECTS[idx];
  loadUrl("/img?path=" + encodeURIComponent(p.img));
}

document.querySelectorAll(".proj-item").forEach((el, i) => {
  el.addEventListener("click", () => activateProject(i));
});

// ── Load from file picker ───────────────────────────────────────────────────
document.getElementById("file-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  active = -1;
  document.querySelectorAll(".proj-item").forEach(el => el.classList.remove("active"));
  const url = URL.createObjectURL(file);
  loadUrl(url, true);
});

function loadUrl(url, isBlob = false) {
  const i = new Image();
  i.crossOrigin = "anonymous";
  i.onload = () => {
    img = i;
    // Fit image to frame initially
    const scaleW = FW / img.naturalWidth;
    const scaleH = FH / img.naturalHeight;
    scale = Math.max(scaleW, scaleH);   // start with cover behaviour
    ox = 0; oy = 0; angle = 0;
    // Sync sliders
    slZoom.value = Math.round(scale * 100);
    valZoom.textContent = slZoom.value + "%";
    slRotate.value = 0;
    valRotate.textContent = "0°";
    draw();
    if (isBlob) URL.revokeObjectURL(url);
  };
  i.onerror = () => { alert("Could not load image — check the path."); };
  i.src = url;
}

// ── Draw ────────────────────────────────────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, FW, FH);
  ctx.fillStyle = "#0D0F17";
  ctx.fillRect(0, 0, FW, FH);
  if (!img) {
    ctx.fillStyle = "#2A2D3A";
    ctx.font = "14px Inter, system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Select a project or load an image", FW / 2, FH / 2);
    return;
  }
  ctx.save();
  ctx.translate(FW / 2 + ox, FH / 2 + oy);
  ctx.rotate(angle * Math.PI / 180);
  ctx.scale(scale, scale);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  ctx.restore();
}

draw();

// ── Pan (drag) ───────────────────────────────────────────────────────────────
let dragging = false, lx = 0, ly = 0;
canvas.addEventListener("mousedown", (e) => { dragging = true; lx = e.clientX; ly = e.clientY; });
window.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  ox += e.clientX - lx; oy += e.clientY - ly;
  lx = e.clientX; ly = e.clientY;
  draw();
});
window.addEventListener("mouseup", () => { dragging = false; });

// ── Zoom (scroll) ────────────────────────────────────────────────────────────
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = e.deltaY < 0 ? 1.08 : 0.93;
  scale = Math.max(0.1, Math.min(4, scale * delta));
  slZoom.value = Math.round(scale * 100);
  valZoom.textContent = slZoom.value + "%";
  draw();
}, { passive: false });

// ── Reset ────────────────────────────────────────────────────────────────────
document.getElementById("btn-reset").addEventListener("click", () => {
  if (!img) return;
  const scaleW = FW / img.naturalWidth;
  const scaleH = FH / img.naturalHeight;
  scale = Math.max(scaleW, scaleH);
  ox = 0; oy = 0; angle = 0;
  slZoom.value = Math.round(scale * 100);
  valZoom.textContent = slZoom.value + "%";
  slRotate.value = 0;
  valRotate.textContent = "0°";
  draw();
});

// ── Save ─────────────────────────────────────────────────────────────────────
document.getElementById("btn-save").addEventListener("click", async () => {
  if (!img) { alert("No image loaded."); return; }
  const dataUrl = canvas.toDataURL("image/jpeg", 0.93);
  const base64  = dataUrl.split(",")[1];

  if (active < 0) {
    // No project selected — just download
    const a = document.createElement("a");
    a.href = dataUrl; a.download = "thumbnail.jpg"; a.click();
    return;
  }

  const path = PROJECTS[active].img;
  const res  = await fetch("/save?path=" + encodeURIComponent(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64 }),
  });
  if (res.ok) {
    const status = document.getElementById("status");
    status.classList.add("show");
    setTimeout(() => status.classList.remove("show"), 2500);
  } else {
    alert("Save failed: " + await res.text());
  }
});

// ── Load first project on start ───────────────────────────────────────────────
activateProject(0);
</script>
</body>
</html>`;

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  // Serve editor UI
  if (url.pathname === "/" || url.pathname === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(HTML);
    return;
  }

  // Serve an image file
  if (url.pathname === "/img") {
    const rel = url.searchParams.get("path") || "";
    const filePath = join(__dirname, rel);
    try {
      const data = await readFile(filePath);
      const ext  = extname(filePath).toLowerCase();
      const mime = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
                     ".webp": "image/webp", ".heic": "image/heic", ".gif": "image/gif" };
      res.writeHead(200, { "Content-Type": mime[ext] ?? "application/octet-stream" });
      res.end(data);
    } catch {
      res.writeHead(404); res.end("Not found: " + rel);
    }
    return;
  }

  // Save a cropped image back to disk
  if (url.pathname === "/save" && req.method === "POST") {
    const rel = url.searchParams.get("path") || "";
    const filePath = join(__dirname, rel);
    let body = "";
    req.on("data", c => body += c);
    req.on("end", async () => {
      try {
        const { base64 } = JSON.parse(body);
        await writeFile(filePath, Buffer.from(base64, "base64"));
        res.writeHead(200); res.end("ok");
      } catch (e) {
        res.writeHead(500); res.end(e.message);
      }
    });
    return;
  }

  res.writeHead(404); res.end("Not found");

}).listen(PORT, () => {
  console.log(`\nThumbnail editor → http://localhost:${PORT}\n`);
});
