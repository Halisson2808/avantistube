import Anthropic from "@anthropic-ai/sdk";
import { getApiKeys } from "@/lib/dark/apiKeysStorage";

export interface ClaudeMessage { role: "user" | "assistant"; content: string; }
export interface ClaudeResponse { content: string; usage?: { input_tokens: number; output_tokens: number; }; }

export const callClaude = async (messages: ClaudeMessage[], model: string = "claude-sonnet-4-5", maxTokens: number = 8000): Promise<ClaudeResponse> => {
    const { claudeKey } = getApiKeys();
    if (!claudeKey) throw new Error("Claude API Key não configurada. Configure em Configurações.");
    const anthropic = new Anthropic({ apiKey: claudeKey, dangerouslyAllowBrowser: true });
    try {
        const response = await anthropic.messages.create({ model, max_tokens: maxTokens, messages: messages.map(m => ({ role: m.role, content: m.content })) });
        const content = response.content[0];
        if (content.type !== "text") throw new Error("Resposta inesperada da API");
        return { content: content.text, usage: { input_tokens: response.usage.input_tokens, output_tokens: response.usage.output_tokens } };
    } catch (error: any) {
        throw new Error(error.message || "Erro ao gerar conteúdo com Claude");
    }
};
