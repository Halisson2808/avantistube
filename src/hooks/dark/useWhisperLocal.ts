import { useState, useCallback, useRef } from 'react';
import { pipeline } from '@huggingface/transformers';

export const useWhisperLocal = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const transcriberRef = useRef<any>(null);

    const initializeWhisper = useCallback(async () => {
        if (transcriberRef.current) return transcriberRef.current;
        try {
            setProgress(10);
            const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', { device: 'webgpu', dtype: 'fp32' });
            transcriberRef.current = transcriber;
            setProgress(100);
            return transcriber;
        } catch (error) {
            console.error('Erro ao inicializar Whisper:', error);
            throw new Error('Falha ao carregar modelo Whisper. Verifique se seu navegador suporta WebGPU.');
        }
    }, []);

    const transcribeAudio = useCallback(async (audioData: string | Blob | File): Promise<string> => {
        setIsProcessing(true);
        setProgress(0);
        try {
            setProgress(20);
            const transcriber = await initializeWhisper();
            setProgress(50);
            let audioInput: string | Blob;
            if (typeof audioData === 'string') {
                const byteCharacters = atob(audioData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
                audioInput = new Blob([new Uint8Array(byteNumbers)], { type: 'audio/webm' });
            } else {
                audioInput = audioData;
            }
            setProgress(70);
            const result = await transcriber(audioInput, { language: 'portuguese', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 });
            setProgress(100);
            return result.text || '';
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao transcrever áudio');
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    }, [initializeWhisper]);

    return { transcribeAudio, isProcessing, progress };
};
