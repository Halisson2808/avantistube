/**
 * aiClient.ts — Chamadas de IA via backend (/api), SEM chave no front.
 * As chaves ficam só no servidor (variáveis de ambiente do Vercel).
 */

const API = "/api";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/** Chat (OpenAI) via /api/ai/openai. Retorna o texto da resposta. */
export async function aiChat(messages: AIMessage[], opts: ChatOptions = {}): Promise<string> {
  const res = await fetch(`${API}/ai/openai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      model: opts.model ?? "gpt-4o-mini",
      maxTokens: opts.maxTokens,
      temperature: opts.temperature,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro na IA");
  return data.content as string;
}

/** Transcrição (Whisper na OpenAI) via /api/ai/transcribe. */
export async function aiTranscribe(
  audioBase64: string,
  opts: { mimeType?: string; language?: string } = {}
): Promise<string> {
  const res = await fetch(`${API}/ai/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioBase64, mimeType: opts.mimeType, language: opts.language }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro na transcrição");
  return data.text as string;
}
