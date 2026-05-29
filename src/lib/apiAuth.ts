/**
 * apiAuth.ts — Anexa automaticamente o token de login (Supabase) às chamadas /api.
 * Assim o backend consegue verificar quem está chamando, sem precisar editar
 * cada fetch espalhado pelo código.
 *
 * Só mexe em requisições same-origin para /api. Chamadas para o Supabase
 * (https://...supabase.co) e outras URLs absolutas passam intactas.
 */
import { supabase } from "@/integrations/supabase/client";

let installed = false;

export function installApiAuthFetch() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const origFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.href
          : input.url;

      const isLocalApi =
        url.startsWith("/api") || url.startsWith(`${window.location.origin}/api`);

      if (isLocalApi) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token) {
          const headers = new Headers(
            init?.headers || (input instanceof Request ? input.headers : undefined)
          );
          if (!headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          return origFetch(input, { ...init, headers });
        }
      }
    } catch {
      /* se algo falhar, segue a requisição normal */
    }
    return origFetch(input, init);
  };
}
