/**
 * api/handler.mjs — Função serverless única do Vercel.
 * Todas as rotas /api/* são redirecionadas para cá pelo vercel.json (rewrite),
 * e encaminhadas ao núcleo compartilhado (api/_core.mjs).
 *
 * Usar um nome fixo + rewrite (em vez de [...path]) evita o problema do Vercel
 * em que o catch-all de arquivo não captura rotas com 2+ níveis (ex.: /api/youtube/channel).
 */
import { handleApiRequest } from "./_core.mjs";

function readBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  if (typeof req.body === "string") {
    try { return Promise.resolve(req.body ? JSON.parse(req.body) : {}); } catch { return Promise.resolve({}); }
  }
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
    req.on("error", () => resolve({}));
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  // req.url preserva o caminho original solicitado mesmo após o rewrite.
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
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
      res.status(result.status);
      res.setHeader("Content-Type", result.contentType || "application/octet-stream");
      if (result.cacheControl) res.setHeader("Cache-Control", result.cacheControl);
      res.send(result.buffer);
      return;
    }
    res.status(result.status).json(result.json);
  } catch (err) {
    console.error(`[api] ${req.method} ${url.pathname} →`, err.message);
    res.status(500).json({ error: err.message });
  }
}
