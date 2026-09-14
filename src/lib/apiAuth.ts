/**
 * apiAuth.ts — Anexa automaticamente o token de login (Supabase) às chamadas /api.
 * Assim o backend consegue verificar quem está chamando, sem precisar editar
 * cada fetch espalhado pelo código.
 *
 * Só mexe em requisições same-origin para /api. Chamadas para o Supabase
 * (https://...supabase.co) e outras URLs absolutas passam intactas.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

let installed = false;
let refreshInFlight: Promise<Session | null> | null = null;

const RETRYABLE_API_STATUSES = new Set([500, 502, 503, 504]);
const RETRY_DELAYS_MS = [300, 800];

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function refreshSessionOnce(): Promise<Session | null> {
  if (!refreshInFlight) {
    refreshInFlight = supabase.auth
      .refreshSession()
      .then(({ data, error }) => {
        if (error) throw error;
        return data.session;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

async function getUsableSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const session = data.session;
  // Evita enviar um JWT que vai expirar enquanto a função serverless ainda
  // estiver validando a requisição.
  const expiresSoon = session?.expires_at
    ? session.expires_at * 1000 <= Date.now() + 60_000
    : false;
  return expiresSoon ? refreshSessionOnce() : session;
}

export function installApiAuthFetch() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const origFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.href
        : input.url;

    const isLocalApi =
      url.startsWith("/api") || url.startsWith(`${window.location.origin}/api`);
    if (!isLocalApi) return origFetch(input, init);

    const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
    const canRetry = method === "GET" || method === "HEAD";
    const originalHeaders = new Headers(
      init?.headers || (input instanceof Request ? input.headers : undefined),
    );

    let session: Session | null;
    try {
      session = await getUsableSession();
    } catch {
      // Uma indisponibilidade momentânea durante a leitura da sessão não deve
      // virar uma chamada sem token e uma falsa mensagem de "login expirado".
      try {
        session = await refreshSessionOnce();
      } catch {
        throw new Error("Não foi possível renovar sua sessão. Tente novamente em instantes.");
      }
    }

    let refreshedAfterUnauthorized = false;
    for (let attempt = 0; ; attempt += 1) {
      const headers = new Headers(originalHeaders);
      if (session?.access_token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${session.access_token}`);
      }

      let response: Response;
      try {
        response = await origFetch(input, { ...init, headers });
      } catch (error) {
        if (!canRetry || attempt >= RETRY_DELAYS_MS.length) throw error;
        await wait(RETRY_DELAYS_MS[attempt]);
        continue;
      }

      if (response.status === 401 && canRetry && !refreshedAfterUnauthorized) {
        refreshedAfterUnauthorized = true;
        try {
          session = await refreshSessionOnce();
        } catch {
          return response;
        }
        if (session) continue;
      }

      if (
        canRetry &&
        RETRYABLE_API_STATUSES.has(response.status) &&
        attempt < RETRY_DELAYS_MS.length
      ) {
        await wait(RETRY_DELAYS_MS[attempt]);
        continue;
      }

      return response;
    }
  };
}
