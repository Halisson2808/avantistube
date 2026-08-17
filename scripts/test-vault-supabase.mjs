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

async function testFallback() {
  const testPayload = JSON.stringify({ version: 1, test: true });
  
  // Upsert test in social_links as fallback storage
  const { data: existing } = await sb
    .from("social_links")
    .select("id")
    .eq("label", "__VAULT_PAYLOAD__")
    .limit(1);

  if (existing && existing.length > 0) {
    const { data, error } = await sb
      .from("social_links")
      .update({ url: testPayload })
      .eq("id", existing[0].id)
      .select();
    console.log("Updated fallback in Supabase:", { data, error });
  } else {
    const { data, error } = await sb
      .from("social_links")
      .insert({ label: "__VAULT_PAYLOAD__", url: testPayload, platform: "other" })
      .select();
    console.log("Inserted fallback in Supabase:", { data, error });
  }

  // Read test
  const { data: readData } = await sb
    .from("social_links")
    .select("url")
    .eq("label", "__VAULT_PAYLOAD__")
    .limit(1)
    .single();

  console.log("Read from Supabase successfully:", readData?.url === testPayload);
}

testFallback();
