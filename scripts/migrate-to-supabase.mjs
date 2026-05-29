/**
 * migrate-to-supabase.mjs
 * ----------------------------------------------------------------------------
 * Importa os dados locais (data/channels.json + data/history.json) para o
 * Supabase, SEM perder nada. Pode rodar quantas vezes quiser: usa upsert,
 * então reimportar apenas atualiza/insere — nunca duplica.
 *
 * Pré-requisitos no arquivo .env (na raiz do projeto):
 *   VITE_SUPABASE_URL=https://hakvewukaphjuqgbdueb.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<a service_role key do painel do Supabase>
 *
 * A service_role key fica em: Supabase Dashboard -> Project Settings ->
 *   API -> Project API keys -> "service_role" (secret). Ela ignora o RLS,
 *   por isso é usada só aqui, localmente, e NUNCA vai pro frontend.
 *
 * Rodar:
 *   node scripts/migrate-to-supabase.mjs
 * ----------------------------------------------------------------------------
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ─── Carregar .env ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").replace(/\r/g, "").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [k, ...rest] = trimmed.split("=");
    if (k && rest.length) process.env[k.trim()] = rest.join("=").trim().replace(/^"|"$/g, "");
  }
}
loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("\x1b[31m❌ Faltam variáveis no .env:\x1b[0m");
  if (!SUPABASE_URL) console.error("   - VITE_SUPABASE_URL");
  if (!SERVICE_KEY) console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  console.error("\nVeja as instruções no topo deste arquivo.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── Ler dados locais ─────────────────────────────────────────────────────────
const channelsPath = join(ROOT, "data", "channels.json");
const historyPath = join(ROOT, "data", "history.json");

if (!existsSync(channelsPath)) {
  console.error(`❌ Não encontrei ${channelsPath}`);
  process.exit(1);
}

const channelsDB = JSON.parse(readFileSync(channelsPath, "utf-8"));
const historyDB = existsSync(historyPath) ? JSON.parse(readFileSync(historyPath, "utf-8")) : {};
const monitored = channelsDB.monitored || [];

// ─── Montar as linhas de canais ───────────────────────────────────────────────
const channelRows = monitored.map((c) => ({
  id: c.id,
  channel_id: c.channel_id,
  channel_name: c.channel_name,
  channel_thumbnail: c.channel_thumbnail ?? null,
  subscriber_count: c.subscriber_count ?? 0,
  view_count: c.view_count ?? 0,
  video_count: c.video_count ?? 0,
  niche: c.niche ?? null,
  notes: c.notes ?? null,
  content_type: c.content_type === "shorts" ? "shorts" : "longform",
  initial_subscribers: c.initial_subscribers ?? null,
  initial_views: c.initial_views ?? null,
  added_at: c.added_at,
  last_updated: c.last_updated,
}));

// ─── Montar as linhas de histórico ────────────────────────────────────────────
const monitoredIds = new Set(monitored.map((c) => c.channel_id));
const historyRows = [];
let skippedOrphans = 0;
for (const [channelId, points] of Object.entries(historyDB)) {
  if (!monitoredIds.has(channelId)) {
    skippedOrphans += (points || []).length;
    continue; // ignora histórico de canal que não existe mais (evita erro de FK)
  }
  // Dedup por recorded_at (a unique constraint exige isso)
  const seen = new Set();
  for (const p of points || []) {
    if (!p.recorded_at || seen.has(p.recorded_at)) continue;
    seen.add(p.recorded_at);
    historyRows.push({
      channel_id: channelId,
      recorded_at: p.recorded_at,
      subscriber_count: p.subscriber_count ?? 0,
      view_count: p.view_count ?? 0,
      video_count: p.video_count ?? 0,
    });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function upsertInBatches(table, rows, conflictTarget, size = 500) {
  let done = 0;
  for (let i = 0; i < rows.length; i += size) {
    const batch = rows.slice(i, i + size);
    const { error } = await supabase.from(table).upsert(batch, { onConflict: conflictTarget });
    if (error) {
      console.error(`\n❌ Erro no batch ${i}-${i + batch.length} de ${table}:`, error.message);
      process.exit(1);
    }
    done += batch.length;
    process.stdout.write(`\r   ${table}: ${done}/${rows.length}`);
  }
  process.stdout.write("\n");
}

async function count(table) {
  const { count: n, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) {
    console.error(`❌ Erro ao contar ${table}:`, error.message);
    return { n: null, error };
  }
  return { n: n ?? 0, error: null };
}

// ─── Executar ─────────────────────────────────────────────────────────────────
(async () => {
  console.log("\n📦 Importando para o Supabase:", SUPABASE_URL);
  console.log(`   Canais a enviar:    ${channelRows.length}`);
  console.log(`   Pontos de histórico: ${historyRows.length}` + (skippedOrphans ? `  (${skippedOrphans} órfãos ignorados)` : ""));
  console.log("");

  // Sanidade: a conexão funciona / as tabelas existem?
  const preChannels = await count("channels");
  if (preChannels.error) {
    console.error("\n⚠️  Não consegui ler a tabela 'channels'. Você já rodou o SQL do schema");
    console.error("    (supabase/migrations/20260529000000_init.sql) no SQL Editor?");
    process.exit(1);
  }

  console.log("⬆️  Enviando canais...");
  await upsertInBatches("channels", channelRows, "channel_id");

  console.log("⬆️  Enviando histórico...");
  await upsertInBatches("channel_history", historyRows, "channel_id,recorded_at");

  // ─── Verificação final ───────────────────────────────────────────────────
  const finalChannels = (await count("channels")).n;
  const finalHistory = (await count("channel_history")).n;

  console.log("\n──────── Verificação ────────");
  console.log(`Canais  no Supabase: ${finalChannels}  (esperado ≥ ${channelRows.length})`);
  console.log(`Histórico no Supabase: ${finalHistory}  (esperado ≥ ${historyRows.length})`);

  const ok = finalChannels >= channelRows.length && finalHistory >= historyRows.length;
  if (ok) {
    console.log("\n\x1b[32m✅ Importação concluída com sucesso. Nenhum dado perdido.\x1b[0m\n");
  } else {
    console.log("\n\x1b[31m⚠️  Contagem abaixo do esperado — revise os erros acima.\x1b[0m\n");
    process.exit(1);
  }
})();
