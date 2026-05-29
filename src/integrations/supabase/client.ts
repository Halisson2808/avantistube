/**
 * Cliente Supabase do frontend.
 * Usa a chave PÚBLICA (publishable / anon) — segura para o navegador.
 * Mantém a sessão de login persistida (localStorage) para o Supabase Auth.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL ou VITE_SUPABASE_PUBLISHABLE_KEY ausentes no .env"
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
