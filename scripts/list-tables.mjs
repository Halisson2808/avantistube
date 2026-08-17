import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const envPath = join(ROOT, ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").replace(/\r/g, "").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [k, ...rest] = trimmed.split("=");
    if (k && rest.length) process.env[k.trim()] = rest.join("=").trim().replace(/^"|"$/g, "");
  }
}

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = createClient(url, key, { auth: { persistSession: false } });

async function listExisting() {
  const tables = ['channels', 'channel_history', 'social_links', 'channel_video_cache', 'profiles', 'users'];
  for (const t of tables) {
    const { data, error } = await sb.from(t).select('*').limit(1);
    if (!error) {
      console.log(`✅ Tabela '${t}' existe no Supabase!`);
    } else {
      console.log(`❌ Tabela '${t}' não existe (${error.message})`);
    }
  }
}

listExisting();
