import { useState } from "react";
import { toast } from "sonner";
import { aiChat, aiTranscribe } from "@/lib/dark/aiClient";

export interface TranscriptionFile {
    id: string;
    name: string;
    file_path: string;
    mime_type: string | null;
    size_bytes: number | null;
    original_url: string | null;
    thumbnail_url: string | null;
    created_at: string;
}

export function useTranscription() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [files, setFiles] = useState<TranscriptionFile[]>([]);

    const transcribeAudio = async (audioData: string): Promise<string | null> => {
        try {
            setIsProcessing(true);
            const text = await aiTranscribe(audioData, { mimeType: 'audio/mp3' });
            toast.success('Transcrição concluída!');
            return text;
        } catch (error: any) {
            toast.error(error.message || 'Erro ao transcrever áudio');
            return null;
        } finally {
            setIsProcessing(false);
        }
    };

    const processWithGPT = async (text: string, action: 'correct' | 'translate', targetLanguage?: string): Promise<string | null> => {
        try {
            setIsProcessing(true);
            const systemPrompt = action === 'correct'
                ? 'Você é um corretor de texto profissional. Corrija erros de gramática, ortografia e pontuação, mantendo o conteúdo original.'
                : `Você é um tradutor profissional. Traduza o texto a seguir para ${targetLanguage || 'português'}, mantendo o tom e contexto.`;
            const content = await aiChat(
                [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }],
                { temperature: 0.3 }
            );
            toast.success(action === 'correct' ? 'Texto corrigido!' : 'Texto traduzido!');
            return content;
        } catch (error: any) {
            toast.error(error.message || 'Erro ao processar com GPT');
            return null;
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchFiles = async (): Promise<void> => { setFiles([]); };
    const deleteFile = async (_fileId: string): Promise<void> => { };
    const deleteAllFiles = async (): Promise<void> => { };

    return { isProcessing, files, transcribeAudio, processWithGPT, fetchFiles, deleteFile, deleteAllFiles };
}
