import OpenAI from "openai";
import { getApiKeys } from "@/lib/dark/apiKeysStorage";

export interface OpenAIMessage { role: "system" | "user" | "assistant"; content: string; }
export interface OpenAIResponse { content: string; usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number; }; }

export const callOpenAI = async (messages: OpenAIMessage[], model: string = "gpt-4o-mini", maxTokens: number = 4000): Promise<OpenAIResponse> => {
    const { openaiKey } = getApiKeys();
    if (!openaiKey) throw new Error("OpenAI API Key não configurada. Configure em Configurações.");
    const openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
    try {
        const response = await openai.chat.completions.create({ model, messages, max_tokens: maxTokens });
        const content = response.choices[0]?.message?.content || "";
        return { content, usage: response.usage };
    } catch (error: any) {
        throw new Error(error.message || "Erro ao gerar conteúdo com OpenAI");
    }
};
