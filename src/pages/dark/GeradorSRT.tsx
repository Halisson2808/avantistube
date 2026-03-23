import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Download, Trash2, Sparkles, Settings2 } from "lucide-react";
import { toast } from "sonner";

export default function GeradorSRT() {
    const [textoOriginal, setTextoOriginal] = useState("");
    const [srtGerado, setSrtGerado] = useState("");
    const [limiteCaracteres, setLimiteCaracteres] = useState(450);
    const [duracao, setDuracao] = useState(30);
    const [intervalo, setIntervalo] = useState(15);

    useEffect(() => {
        const savedData = localStorage.getItem('gerador_srt_work');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                setTextoOriginal(data.textoOriginal || "");
                setSrtGerado(data.srtGerado || "");
                setLimiteCaracteres(data.limiteCaracteres || 450);
                setDuracao(data.duracao || 30);
                setIntervalo(data.intervalo || 15);
            } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('gerador_srt_work', JSON.stringify({ textoOriginal, srtGerado, limiteCaracteres, duracao, intervalo }));
    }, [textoOriginal, srtGerado, limiteCaracteres, duracao, intervalo]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const remainingSeconds = seconds % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const secs = Math.floor(remainingSeconds % 60);
        const milliseconds = Math.round((remainingSeconds % 1) * 1000);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
    };

    const splitIntoSentences = (text: string): string[] => {
        const sentences: string[] = [];
        let current = '';
        const cleanText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        for (let i = 0; i < cleanText.length; i++) {
            current += cleanText[i];
            if (/[.!?]/.test(cleanText[i]) && (i === cleanText.length - 1 || cleanText[i + 1] === ' ')) {
                sentences.push(current.trim());
                current = '';
            }
        }
        if (current.trim()) sentences.push(current.trim());
        return sentences;
    };

    const splitLongText = (text: string, charLimit: number): string[] => {
        if (text.length <= charLimit) return [text];
        const chunks: string[] = [];
        let remaining = text;
        while (remaining.length > charLimit) {
            let splitIndex = -1;
            for (let i = charLimit; i >= charLimit * 0.6; i--) {
                if (/[.!?]/.test(remaining[i]) && (i === remaining.length - 1 || remaining[i + 1] === ' ')) { splitIndex = i + 1; break; }
            }
            if (splitIndex === -1) for (let i = charLimit; i >= charLimit * 0.6; i--) { if (remaining[i] === ',') { splitIndex = i + 1; break; } }
            if (splitIndex === -1) for (let i = charLimit; i >= charLimit * 0.6; i--) { if (remaining[i] === ' ') { splitIndex = i; break; } }
            if (splitIndex === -1) splitIndex = charLimit;
            chunks.push(remaining.substring(0, splitIndex).trim());
            remaining = remaining.substring(splitIndex).trim();
        }
        if (remaining) chunks.push(remaining);
        return chunks;
    };

    const generateSrt = (text: string, charLimit: number, duration: number, gap: number): string => {
        if (!text) return '';
        const sentences = splitIntoSentences(text);
        let srtContent = '';
        let currentTime = 0;
        let subtitleIndex = 1;
        let currentSubtitle = '';
        let currentLength = 0;
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            if (sentence.length > charLimit) {
                if (currentSubtitle) {
                    srtContent += `${subtitleIndex}\n${formatTime(currentTime)} --> ${formatTime(currentTime + duration)}\n${currentSubtitle}\n\n`;
                    subtitleIndex++; currentTime += duration + gap; currentSubtitle = ''; currentLength = 0;
                }
                for (const chunk of splitLongText(sentence, charLimit)) {
                    srtContent += `${subtitleIndex}\n${formatTime(currentTime)} --> ${formatTime(currentTime + duration)}\n${chunk}\n\n`;
                    subtitleIndex++; currentTime += duration + gap;
                }
                continue;
            }
            if (currentLength + sentence.length + (currentSubtitle ? 1 : 0) <= charLimit) {
                currentSubtitle += (currentSubtitle ? ' ' : '') + sentence;
                currentLength += sentence.length + (currentSubtitle ? 1 : 0);
            } else {
                if (currentSubtitle) {
                    srtContent += `${subtitleIndex}\n${formatTime(currentTime)} --> ${formatTime(currentTime + duration)}\n${currentSubtitle}\n\n`;
                    subtitleIndex++; currentTime += duration + gap;
                }
                currentSubtitle = sentence; currentLength = sentence.length;
            }
        }
        if (currentSubtitle) { srtContent += `${subtitleIndex}\n${formatTime(currentTime)} --> ${formatTime(currentTime + duration)}\n${currentSubtitle}\n\n`; }
        return srtContent.trim();
    };

    const handleGenerate = () => {
        if (!textoOriginal.trim()) { toast.error("Por favor, insira um texto para converter"); return; }
        try {
            const srt = generateSrt(textoOriginal, limiteCaracteres, duracao, intervalo);
            setSrtGerado(srt);
            if (srt) toast.success(`✅ ${srt.split('\n\n').length} legendas geradas com sucesso!`);
        } catch (error: any) { toast.error(`Erro ao gerar SRT: ${error.message}`); }
    };

    const handleDownload = () => {
        if (!srtGerado) { toast.error("Nenhuma legenda para baixar"); return; }
        const blob = new Blob([srtGerado], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'legendas.srt';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('💾 Arquivo SRT baixado com sucesso!');
    };

    const handleClear = () => {
        setTextoOriginal(''); setSrtGerado(''); setLimiteCaracteres(450); setDuracao(30); setIntervalo(15);
        localStorage.removeItem('gerador_srt_work');
        toast.info('🗑️ Campos limpos!');
    };

    const inputClass = "bg-white/5 border-white/10 text-white";

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gradient">Gerador de Legendas SRT</h1>
                    <p className="text-white/50 mt-2">Transforme seu texto em legendas profissionais automaticamente</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Sparkles className="h-3 w-3 mr-1" /> Automático
                </Badge>
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                        <Settings2 className="h-4 w-4 text-blue-400" /> Configurações
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: "charLimit", label: "Limite de Caracteres", value: limiteCaracteres, set: setLimiteCaracteres, min: 50, max: 1000, color: "bg-blue-400" },
                            { id: "duration", label: "Duração (segundos)", value: duracao, set: setDuracao, min: 1, max: 120, color: "bg-green-400" },
                            { id: "gap", label: "Intervalo (segundos)", value: intervalo, set: setIntervalo, min: 0, max: 120, color: "bg-purple-400" },
                        ].map((field) => (
                            <div key={field.id} className="space-y-2">
                                <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2 text-white/70">
                                    <span className={`w-2 h-2 ${field.color} rounded-full`} /> {field.label}
                                </Label>
                                <Input id={field.id} type="number" value={field.value} onChange={(e) => field.set(parseInt(e.target.value) || field.value)} min={field.min} max={field.max} className={inputClass} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-panel border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white"><FileText className="h-5 w-5 text-blue-400" /> Texto Original</CardTitle>
                        <CardDescription className="text-white/50">Cole o texto que deseja converter</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea placeholder="Cole aqui o texto..." value={textoOriginal} onChange={(e) => setTextoOriginal(e.target.value)} className="min-h-[400px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20" />
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs border-white/10 text-white/40">📊 {textoOriginal.length} caracteres</Badge>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(textoOriginal)} disabled={!textoOriginal} className="border-white/10 text-white hover:bg-white/5">Copiar</Button>
                                <Button size="sm" onClick={handleGenerate} disabled={!textoOriginal.trim()} className="bg-blue-600 hover:bg-blue-500 text-white">
                                    <Sparkles className="h-4 w-4 mr-2" /> Gerar SRT
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white"><FileText className="h-5 w-5 text-green-400" /> Legendas SRT Geradas</CardTitle>
                        <CardDescription className="text-white/50">Resultado da conversão em formato SRT</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea placeholder="As legendas aparecerão aqui..." value={srtGerado} readOnly className="min-h-[400px] resize-none bg-white/5 border-white/10 text-white/80 placeholder:text-white/20 font-mono text-xs" />
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                                {srtGerado ? `✅ ${srtGerado.split('\n\n').length} legendas` : 'Aguardando geração'}
                            </Badge>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(srtGerado)} disabled={!srtGerado} className="border-white/10 text-white hover:bg-white/5">Copiar</Button>
                                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!srtGerado} className="border-green-500/30 hover:bg-green-500/20 text-green-400">
                                    <Download className="h-4 w-4 mr-2" /> Baixar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-panel border-white/10">
                <CardContent className="p-4">
                    <Button variant="outline" onClick={handleClear} className="w-full border-red-500/30 hover:bg-red-500/20 text-red-400">
                        <Trash2 className="h-4 w-4 mr-2" /> Limpar Tudo
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
