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

console.log("Supabase URL:", url);
const sb = createClient(url, key, { auth: { persistSession: false } });

async function check() {
  const { data, error } = await sb.from("auth_vault").select("*").limit(1);
  if (error) {
    console.log("❌ Erro na tabela auth_vault:", error.message, error.code);
    if (error.code === "PGRST204" || error.code === "42P01" || error.message.includes("does not exist")) {
      console.log("Tabela auth_vault AINDA NÃO FOI CRIADA no Supabase!");
    }
  } else {
    console.log("✅ Tabela auth_vault existe no Supabase! Registros:", data);
  }
}

check();
