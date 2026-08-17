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

async function testAccountsDirect() {
  const initialAccounts = [
    {
      id: "acc_demo_1",
      channelName: "Halisson",
      channelUrl: "https://youtube.com/channel/UC63dhjjyajWtDZuYRIwoQTw",
      email: "exemplo@gmail.com",
      password: "",
      secret2fa: "JBSWY3DPEHPK3PXP",
      backupCodes: [
        { code: "1234 5678", used: false },
        { code: "8765 4321", used: false }
      ],
      notes: "Conta principal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Salva no Supabase via fallback seguro
  const { data: existing } = await sb
    .from("social_links")
    .select("id")
    .eq("label", "__YOUTUBE_ACCOUNTS__")
    .limit(1);

  if (existing && existing.length > 0) {
    await sb
      .from("social_links")
      .update({ url: JSON.stringify(initialAccounts) })
      .eq("id", existing[0].id);
  } else {
    await sb
      .from("social_links")
      .insert({
        label: "__YOUTUBE_ACCOUNTS__",
        url: JSON.stringify(initialAccounts),
        platform: "other"
      });
  }

  // Leitura
  const { data: readData } = await sb
    .from("social_links")
    .select("url")
    .eq("label", "__YOUTUBE_ACCOUNTS__")
    .limit(1)
    .single();

  const accounts = JSON.parse(readData.url);
  console.log("✅ Contas salvas e lidas com sucesso no Supabase:", accounts.length, "contas");
  console.log(accounts[0]);
}

testAccountsDirect();
