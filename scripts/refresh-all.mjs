/**
 * scripts/refresh-all.mjs — Atualiza todos os canais no servidor (stats, histórico e vídeos).
 * Roda pelo agendamento do GitHub Actions (.github/workflows/refresh-channels.yml)
 * ou à mão: `node scripts/refresh-all.mjs` (lê o .env local se existir).
 */
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { refreshAllChannels } = await import("../api/_core.mjs");
const summary = await refreshAllChannels();
if (summary.quotaExceeded) console.warn("Cota do YouTube esgotada: parte dos canais ficou para a próxima execução.");
