import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit3, Copy, Sparkles, Download, Upload, FileVideo, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { useWhisperLocal } from "@/hooks/dark/useWhisperLocal";
import { useTranscription } from "@/hooks/dark/useTranscription";
import { exportToDocx } from "@/lib/dark/docxExporter";
import { saveTranscricao } from "@/lib/dark/localStorage";

export default function DarkTranscricao() {
    const [transcription, setTranscription] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const { transcribeAudio, isProcessing: whisperProcessing, progress } = useWhisperLocal();
    const { processWithGPT, isProcessing: gptProcessing } = useTranscription();

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) { toast.error('Arquivo deve ser de vídeo ou áudio'); return; }
        setSelectedFile(file);
        try {
            toast.info('Iniciando transcrição local com Whisper...');
            const result = await transcribeAudio(file);
            if (result) {
                setTranscription(result);
                saveTranscricao({ original_text: result });
                toast.success('Transcrição concluída!');
            }
        } catch (error: any) { toast.error(error.message || 'Erro ao transcrever áudio'); setSelectedFile(null); }
    };

    const handleCorrect = async () => {
        const corrected = await processWithGPT(transcription, 'correct');
        if (corrected) setTranscription(corrected);
    };

    const handleExport = async () => {
        try {
            await exportToDocx({ content: transcription, filename: `transcricao-${Date.now()}.docx`, title: 'Transcrição de Vídeo' });
            toast.success('Transcrição exportada com sucesso!');
        } catch { toast.error('Erro ao exportar transcrição'); }
    };

    const isProcessing = whisperProcessing || gptProcessing;
    const cardClass = "glass-panel border-white/10";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gradient">Transcrever Vídeos</h1>
                <p className="text-white/50 mt-2">Transcrição local com Whisper (100% offline)</p>
            </div>

            {/* Upload */}
            <Card className={cardClass}>
                <CardContent className="p-6">
                    <div
                        className={`relative p-8 border-2 border-dashed rounded-lg transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5'}`}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('video/') || f.type.startsWith('audio/')); if (f) handleFile(f); }}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                    >
                        <div className="text-center space-y-4">
                            {selectedFile ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                    <div>
                                        <p className="font-medium text-white">{selectedFile.name}</p>
                                        <p className="text-sm text-white/40">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></Button>
                                </div>
                            ) : (
                                <>
                                    <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-white">Arraste seu vídeo ou áudio aqui</h3>
                                        <p className="text-white/40 mb-4">Transcrição local com Whisper (100% offline)</p>
                                        <input type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" id="video-upload" disabled={isProcessing} />
                                        <label htmlFor="video-upload">
                                            <Button variant="outline" className="cursor-pointer border-white/20 text-white hover:bg-white/10" disabled={isProcessing} asChild>
                                                <span><FileVideo className="w-4 h-4 mr-2" /> Selecionar Arquivo</span>
                                            </Button>
                                        </label>
                                    </div>
                                </>
                            )}
                            {whisperProcessing && (
                                <div className="mt-4 space-y-2">
                                    <Progress value={progress} className="h-2" />
                                    <p className="text-sm text-white/40 text-center">
                                        {progress < 20 && "Carregando modelo Whisper..."}
                                        {progress >= 20 && progress < 50 && "Preparando áudio..."}
                                        {progress >= 50 && progress < 100 && "Transcrevendo..."}
                                        {progress === 100 && "Finalizando..."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Result */}
            {transcription ? (
                <>
                    <Card className={cardClass}>
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center space-x-2">
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Transcrição Completa</Badge>
                                <span className="text-sm text-white/40">{transcription.length} caracteres</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="border-white/10 text-white hover:bg-white/10">
                                <Edit3 className="w-4 h-4 mr-2" /> {isEditing ? 'Visualizar' : 'Editar'}
                            </Button>
                        </div>
                        <CardContent className="p-6">
                            {isEditing ? (
                                <Textarea value={transcription} onChange={(e) => setTranscription(e.target.value)} className="min-h-[400px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20" />
                            ) : (
                                <div className="min-h-[400px] p-4 bg-white/5 rounded-lg border border-white/10">
                                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-white/80">{transcription}</pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className={cardClass}>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" onClick={() => navigator.clipboard.writeText(transcription)} className="border-white/10 text-white hover:bg-white/10"><Copy className="w-4 h-4 mr-2" /> Copiar Texto</Button>
                                <Button variant="outline" onClick={handleCorrect} disabled={gptProcessing} className="border-yellow-500/30 hover:bg-yellow-500/20 text-yellow-400"><Sparkles className="w-4 h-4 mr-2" /> Corrigir com GPT</Button>
                                <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-500"><Download className="w-4 h-4 mr-2" /> Baixar DOCX</Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : null}
        </div>
    );
}
