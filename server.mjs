/**
 * server.mjs — Servidor local de DEV do Avantis Tube (porta 3001).
 *
 * Em produção (Vercel) quem responde /api/* são as funções serverless
 * (api/[...path].mjs). Aqui, no dev, expomos as MESMAS rotas usando o
 * núcleo compartilhado (api/_core.mjs). Storage = Supabase.
 *
 * O Vite (porta 8080) faz proxy de /api para cá — veja vite.config.ts.
 */
import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3001;

// ─── Carregar .env ANTES de importar o núcleo ──────────────────────────────────
(function loadEnv() {
  const envPath = join(__dirname, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").replace(/\r/g, "").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const [k, ...rest] = t.split("=");
    if (k && rest.length) process.env[k.trim()] = rest.join("=").trim().replace(/^"|"$/g, "");
  }
})();

// import dinâmico: garante que o .env já está em process.env
const { handleApiRequest } = await import("./api/_core.mjs");

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
    req.on("error", () => resolve({}));
  });
}

const server = createServer(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const body = req.method === "POST" || req.method === "PUT" ? await readBody(req) : {};
  const authToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "") || null;

  try {
    const result = await handleApiRequest({
      method: req.method,
      pathname: url.pathname,
      searchParams: url.searchParams,
      body,
      authToken,
    });

    if (result.buffer) {
      res.writeHead(result.status, {
        "Content-Type": result.contentType || "application/octet-stream",
        "Content-Length": result.buffer.byteLength,
        ...(result.cacheControl ? { "Cache-Control": result.cacheControl } : {}),
      });
      res.end(result.buffer);
      return;
    }
    res.writeHead(result.status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result.json));
  } catch (err) {
    console.error(`[server] ${req.method} ${url.pathname} →`, err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  const hasSb = !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasYt = !!(process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY);
  console.log(`\x1b[32m✅ Avantis Tube API (dev) em http://localhost:${PORT}\x1b[0m`);
  console.log(`   🗄️  Supabase: ${hasSb ? "✓ configurado" : "✗ FALTANDO (.env)"}`);
  console.log(`   🔑 YouTube:  ${hasYt ? "✓ configurado" : "✗ FALTANDO (.env)"}`);
});
