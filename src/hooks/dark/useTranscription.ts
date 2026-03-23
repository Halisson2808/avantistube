import { useState } from "react";
import { toast } from "sonner";

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
            const openaiApiKey = localStorage.getItem('openai_api_key');
            if (!openaiApiKey) {
                toast.error('Configure a API key da OpenAI em Configurações');
                setIsProcessing(false);
                return null;
            }
            const audioBlob = await fetch(`data:audio/mp3;base64,${audioData}`).then(r => r.blob());
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.mp3');
            formData.append('model', 'whisper-1');
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${openaiApiKey}` },
                body: formData
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erro na transcrição');
            }
            const data = await response.json();
            toast.success('Transcrição concluída!');
            return data.text;
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
            const openaiApiKey = localStorage.getItem('openai_api_key');
            if (!openaiApiKey) {
                toast.error('Configure a API key da OpenAI em Configurações');
                setIsProcessing(false);
                return null;
            }
            const systemPrompt = action === 'correct'
                ? 'Você é um corretor de texto profissional. Corrija erros de gramática, ortografia e pontuação, mantendo o conteúdo original.'
                : `Você é um tradutor profissional. Traduza o texto a seguir para ${targetLanguage || 'português'}, mantendo o tom e contexto.`;
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiApiKey}` },
                body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }], temperature: 0.3 })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erro ao processar');
            }
            const data = await response.json();
            toast.success(action === 'correct' ? 'Texto corrigido!' : 'Texto traduzido!');
            return data.choices[0].message.content;
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
