// Simple static file server for the Next.js export output
import { createServer } from "http";
import { readFile, stat, open } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname  = dirname(fileURLToPath(import.meta.url));
const OUT_DIR    = join(__dirname, "out");
const PUBLIC_DIR = join(__dirname, "public");
const IMAGES_DIR = join(__dirname, "images");   // root staging folder
const PORT = 3000;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".pdf": "application/pdf",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
};

createServer(async (req, res) => {
  let urlPath = decodeURIComponent(req.url?.split("?")[0] ?? "/");
  if (urlPath === "/") urlPath = "/index.html";
  else if (!extname(urlPath)) urlPath = urlPath.replace(/\/$/, "") + ".html";

  // Try out/ → public/ → root images/ (staging folder)
  let filePath = join(OUT_DIR, urlPath);
  try { await stat(filePath); } catch {
    filePath = join(PUBLIC_DIR, urlPath);
    try { await stat(filePath); } catch {
      // Strip leading /images/ and try root images/ folder directly
      filePath = join(IMAGES_DIR, urlPath.replace(/^\/images\//, "/"));
    }
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";

  try {
    const stats = await stat(filePath);
    const fileSize = stats.size;
    const rangeHeader = req.headers["range"];

    if (rangeHeader) {
      // Parse Range: bytes=start-end
      const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
      const start = match[1] ? parseInt(match[1], 10) : 0;
      const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const fd = await open(filePath, "r");
      const buf = Buffer.allocUnsafe(chunkSize);
      await fd.read(buf, 0, chunkSize, start);
      await fd.close();

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType,
      });
      res.end(buf);
    } else {
      const data = await readFile(filePath);
      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": fileSize,
        "Accept-Ranges": "bytes",
      });
      res.end(data);
    }
  } catch {
    // Try 404
    try {
      const data = await readFile(join(OUT_DIR, "404.html"));
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  }
}).listen(PORT, () => {
  console.log(`Serving ${OUT_DIR} at http://localhost:${PORT}`);
});
