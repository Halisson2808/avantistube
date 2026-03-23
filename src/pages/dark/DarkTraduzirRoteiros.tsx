import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Languages, Upload, Download, Copy, Settings2, Sparkles, Trash2, Eye, GitCompare, FileText, File, FileImage, Boxes, Info, Zap } from "lucide-react";
import { toast } from "sonner";
import { OptimizedTranslator, Chunk, MetadataCleaner } from "@/lib/dark/translationOptimizer";
import { Progress } from "@/components/ui/progress";
import { TranslationEstimator, getConfig } from "@/lib/dark/translationConfig";
import { translationLogger } from "@/lib/dark/translationLogger";
import { exportToDocx } from "@/lib/dark/docxExporter";
import { callOpenAI } from "@/services/dark/openaiApi";
import { callClaude } from "@/services/dark/claudeApi";
import { hasApiKeys, getApiKeys } from "@/lib/dark/apiKeysStorage";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const idiomas = [
    { code: "en", name: "Inglês" },
    { code: "es", name: "Espanhol" },
    { code: "fr", name: "Francês" },
    { code: "de", name: "Alemão" },
    { code: "it", name: "Italiano" },
    { code: "ja", name: "Japonês" },
    { code: "pl", name: "Polonês" },
    { code: "pt", name: "Português" },
    { code: "hi", name: "Hindi" },
    { code: "bg", name: "Búlgaro" },
    { code: "ko", name: "Coreano" },
];

const modelosGPT = [
    { value: "gpt-4o-mini", label: "GPT-4o Mini", description: "Modelo rápido e eficiente" },
    { value: "gpt-4o", label: "GPT-4o", description: "Alta qualidade" },
    { value: "claude-sonnet-4-5", label: "Claude Sonnet 4.5", description: "Raciocínio superior" },
    { value: "claude-3-5-haiku-20241022", label: "Claude Haiku 3.5", description: "Rápido e preciso" },
];

interface Traducao { idioma: string; texto: string; id: string; }

export default function DarkTraduzirRoteiros() {
    const navigate = useNavigate();
    const [textoOriginal, setTextoOriginal] = useState("");
    const [idiomasSelecionados, setIdiomasSelecionados] = useState<string[]>(['en', 'es', 'de']);
    const [modeloSelecionado, setModeloSelecionado] = useState("gpt-4o-mini");
    const [layoutQuadros, setLayoutQuadros] = useState<"separados" | "unico">("separados");
    const [isTranslating, setIsTranslating] = useState(false);
    const [traducoes, setTraducoes] = useState<Traducao[]>([]);
    const [selectedTranslation, setSelectedTranslation] = useState<Traducao | null>(null);
    const [showComparison, setShowComparison] = useState(false);
    const [traducaoComparacao, setTraducaoComparacao] = useState<Traducao | null>(null);
    const [tituloArquivo, setTituloArquivo] = useState("");
    const [translator] = useState(() => new OptimizedTranslator());
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [chunkStats, setChunkStats] = useState<any>(null);
    const [showChunksPreview, setShowChunksPreview] = useState(false);
    const [currentChunkProgress, setCurrentChunkProgress] = useState(0);
    const [currentLanguageProgress, setCurrentLanguageProgress] = useState("");
    const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
    const [totalChunks, setTotalChunks] = useState(0);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const savedTexto = localStorage.getItem('dark_traducao_texto_original');
        const savedTraducoes = localStorage.getItem('dark_traducao_traducoes');
        if (savedTexto) setTextoOriginal(savedTexto);
        if (savedTraducoes) { try { setTraducoes(JSON.parse(savedTraducoes)); } catch { } }
    }, []);

    useEffect(() => { if (textoOriginal) localStorage.setItem('dark_traducao_texto_original', textoOriginal); }, [textoOriginal]);
    useEffect(() => { if (traducoes.length > 0) localStorage.setItem('dark_traducao_traducoes', JSON.stringify(traducoes)); }, [traducoes]);
    useEffect(() => { return () => { abortControllerRef.current?.abort(); }; }, []);

    const retryWithBackoff = async <T,>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> => {
        let lastError: any;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try { return await fn(); } catch (error: any) {
                lastError = error;
                const isRetryable = error.status === 429 || error.message?.includes('rate limit') || error.message?.includes('timeout');
                if (!isRetryable || attempt === maxRetries - 1) throw error;
                const delay = baseDelay * Math.pow(2, attempt);
                toast.info(`⏳ Rate limit detectado, aguardando ${delay / 1000}s...`, { duration: 2000 });
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw lastError;
    };

    const handleIdiomaChange = (idiomaCode: string, checked: boolean) => {
        if (checked) setIdiomasSelecionados(prev => [...prev, idiomaCode]);
        else setIdiomasSelecionados(prev => prev.filter(id => id !== idiomaCode));
    };

    const handleTranslate = async () => {
        if (!textoOriginal.trim()) { toast.error("Por favor, insira o texto para traduzir"); return; }
        if (idiomasSelecionados.length === 0) { toast.error("Por favor, selecione pelo menos um idioma"); return; }
        if (!hasApiKeys()) {
            toast.error("Configure suas API keys em Configurações");
            navigate("/avantisdark/configuracoes");
            return;
        }
        const keys = getApiKeys();
        const usarClaude = modeloSelecionado.includes("claude");
        if (usarClaude && !keys.claudeKey) { toast.error("Configure a API key da Claude"); return; }
        if (!usarClaude && !keys.openaiKey) { toast.error("Configure a API key da OpenAI"); return; }

        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();
        setIsTranslating(true);
        try {
            await handleOptimizedTranslation();
            if (!abortControllerRef.current.signal.aborted) {
                toast.success(`Tradução para ${idiomasSelecionados.length} idioma(s) concluída!`);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') toast.info("Tradução cancelada");
            else toast.error(error.message || "Erro ao traduzir texto");
        } finally {
            setIsTranslating(false); setCurrentChunkProgress(0);
            setCurrentLanguageProgress(""); setCurrentChunkIndex(0); setTotalChunks(0);
            abortControllerRef.current = null;
        }
    };

    const handleCancelTranslation = () => { abortControllerRef.current?.abort(); toast.info("Cancelando tradução..."); };

    const handleOptimizedTranslation = async () => {
        const config = getConfig();
        const languageNames = idiomasSelecionados.map(code => idiomas.find(i => i.code === code)?.name || code);
        translationLogger.logTranslationStart(languageNames, textoOriginal.length);
        const { chunks: preparedChunks, stats } = translator.prepareTranslation(textoOriginal);
        setChunks(preparedChunks); setChunkStats(stats); setTotalChunks(preparedChunks.length);
        translationLogger.logChunkingComplete(preparedChunks);
        toast.info(`Texto dividido em ${preparedChunks.length} chunks`, { duration: 3000 });
        const todasTraducoes: Traducao[] = [];
        for (let langIdx = 0; langIdx < idiomasSelecionados.length; langIdx++) {
            if (abortControllerRef.current?.signal.aborted) throw new DOMException('Tradução cancelada', 'AbortError');
            const idiomaCode = idiomasSelecionados[langIdx];
            const idiomaInfo = idiomas.find(i => i.code === idiomaCode);
            const languageName = idiomaInfo?.name || idiomaCode;
            setCurrentLanguageProgress(languageName);
            const languageTranslator = new OptimizedTranslator();
            const { chunks: langChunks } = languageTranslator.prepareTranslation(textoOriginal);
            const chunkTranslations: string[] = new Array(langChunks.length);
            for (let i = 0; i < langChunks.length; i++) {
                if (abortControllerRef.current?.signal.aborted) throw new DOMException('Tradução cancelada', 'AbortError');
                const chunk = langChunks[i];
                setCurrentChunkIndex(i + 1);
                setCurrentChunkProgress(((i + 1) / langChunks.length) * 100);
                try {
                    const contextPrompt = languageTranslator.getContextPrompt();
                    const chunkTranslation = await retryWithBackoff(async () => {
                        const usarClaude = modeloSelecionado.includes("claude");
                        const prompt = `Traduza o seguinte texto para ${languageName}:\n\n${contextPrompt ? `CONTEXTO ANTERIOR:\n${contextPrompt}\n\n` : ''}TEXTO PARA TRADUZIR:\n${chunk.text}\n\nREGRAS:\n- Mantenha o tom, estilo e formatação originais\n- Traduza de forma natural e fluente\n- NÃO adicione explicações ou comentários\n- Retorne APENAS a tradução`;
                        if (usarClaude) {
                            const r = await callClaude([{ role: "user", content: prompt }], modeloSelecionado);
                            return r.content;
                        } else {
                            const r = await callOpenAI([{ role: "system", content: "Você é um tradutor profissional especializado." }, { role: "user", content: prompt }], modeloSelecionado, 4000);
                            return r.content;
                        }
                    });
                    const cleaned = MetadataCleaner.cleanTranslation(chunkTranslation);
                    chunkTranslations[i] = cleaned;
                    languageTranslator.updateContext(cleaned);
                    if (i < langChunks.length - 1) await new Promise(r => setTimeout(r, config.delay_between_chunks * 1000));
                } catch (error: any) {
                    if (error.name === 'AbortError') throw error;
                    chunkTranslations[i] = `[ERRO NO CHUNK ${i + 1}]`;
                }
            }
            const validChunks = chunkTranslations.filter(c => c && !c.includes('[ERRO NO CHUNK'));
            if (validChunks.length === 0) { toast.error(`❌ Todos os chunks falharam em ${languageName}`); continue; }
            const merged = languageTranslator.mergeTranslatedChunks(validChunks);
            const finalCleaned = MetadataCleaner.finalClean(merged);
            todasTraducoes.push({ id: `traducao-${idiomaCode}-${Date.now()}`, idioma: idiomaCode, texto: finalCleaned });
            translationLogger.logLanguageComplete(languageName);
            if (langIdx < idiomasSelecionados.length - 1) await new Promise(r => setTimeout(r, config.delay_between_languages * 1000));
        }
        if (todasTraducoes.length > 0) {
            setTraducoes(prev => {
                const updated = [...prev.filter(t => t.idioma !== 'combinado')];
                todasTraducoes.forEach(nova => {
                    const idx = updated.findIndex(t => t.idioma === nova.idioma);
                    if (idx >= 0) updated[idx] = nova; else updated.push(nova);
                });
                if (layoutQuadros === "unico") {
                    const combinado = updated.map(t => {
                        const info = idiomas.find(i => i.code === t.idioma);
                        return `${info?.name}:\n${t.texto}\n\n${'-'.repeat(50)}`;
                    }).join('\n\n');
                    return [{ id: `combinado-${Date.now()}`, idioma: 'combinado', texto: combinado.trim() }];
                }
                return updated;
            });
        }
    };

    const handlePreviewChunks = () => {
        if (!textoOriginal.trim()) { toast.error("Insira um texto primeiro"); return; }
        const { chunks: pc, stats } = translator.prepareTranslation(textoOriginal);
        setChunks(pc); setChunkStats(stats); setShowChunksPreview(true);
        toast.success(`Texto dividido em ${pc.length} chunks inteligentes`);
    };

    const handleCopy = (texto: string) => { navigator.clipboard.writeText(texto); toast.success("Texto copiado!"); };

    const handleLimpar = () => {
        setTextoOriginal(""); setTraducoes([]);
        localStorage.removeItem('dark_traducao_texto_original');
        localStorage.removeItem('dark_traducao_traducoes');
        toast.success("Limpo!");
    };

    const handleExport = async (format: 'txt' | 'docx' | 'srt' | 'json') => {
        if (traducoes.length === 0) { toast.error("Nenhuma tradução para exportar"); return; }
        let sucessos = 0;
        for (const traducao of traducoes) {
            try {
                const idiomaCode = traducao.idioma === 'combinado' ? 'ALL' : traducao.idioma.toUpperCase();
                const titulo = tituloArquivo.trim() || 'Roteiro';
                if (format === 'docx') {
                    await exportToDocx({ content: traducao.texto, filename: `${idiomaCode} - ${titulo}.docx` });
                    sucessos++; continue;
                }
                let content = "", filename = "", mimeType = "";
                if (format === 'txt') { content = traducao.texto; filename = `${idiomaCode} - ${titulo}.txt`; mimeType = "text/plain"; }
                else if (format === 'srt') {
                    const lines = traducao.texto.split('\n').filter(l => l.trim());
                    content = lines.map((line, i) => `${i + 1}\n00:00:${(i * 2).toString().padStart(2, '0')},000 --> 00:00:${((i + 1) * 2).toString().padStart(2, '0')},000\n${line}\n\n`).join('');
                    filename = `${idiomaCode} - ${titulo}.srt`; mimeType = "text/plain";
                } else if (format === 'json') {
                    content = JSON.stringify({ idioma: traducao.idioma, model: modeloSelecionado, text: traducao.texto }, null, 2);
                    filename = `${idiomaCode} - ${titulo}.json`; mimeType = "application/json";
                }
                const blob = new Blob([content], { type: mimeType });
                const url = URL.createObjectURL(blob); const a = document.createElement('a');
                a.href = url; a.download = filename; document.body.appendChild(a); a.click();
                document.body.removeChild(a); URL.revokeObjectURL(url); sucessos++;
            } catch { }
        }
        if (sucessos > 0) toast.success(`${sucessos} arquivo(s) baixado(s)!`); else toast.error("Erro ao baixar");
    };

    const removeTraducao = (id: string) => setTraducoes(prev => prev.filter(t => t.id !== id));
    const cardClass = "glass-panel border-white/10";

    return (
        <div className="space-y-6 pb-28">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gradient flex items-center gap-2"><Sparkles className="h-8 w-8" /> Traduzir Roteiros</h1>
                    <p className="text-white/50 mt-2">Engine de chunking inteligente com contexto acumulativo</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/avantisdark/configuracoes")} className="border-white/10 text-white hover:bg-white/10">
                    <Settings2 className="h-4 w-4 mr-2" /> APIs
                </Button>
            </div>

            {/* Seleção de Idiomas + Configurações */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={cardClass}>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-white text-lg"><Languages className="h-4 w-4 text-blue-400" /> Idiomas de Destino</CardTitle>
                        <CardDescription className="text-white/50">{idiomasSelecionados.length} idioma(s) selecionado(s)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {idiomas.map((idioma) => (
                                <div key={idioma.code} className="flex items-center space-x-2 p-2 border border-white/10 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                                    <Checkbox id={idioma.code} checked={idiomasSelecionados.includes(idioma.code)} onCheckedChange={(c) => handleIdiomaChange(idioma.code, c as boolean)} />
                                    <Label htmlFor={idioma.code} className="cursor-pointer text-sm text-white/70">{idioma.name}</Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className={cardClass}>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-white text-lg"><Settings2 className="h-4 w-4 text-blue-400" /> Configurações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-white/70 text-sm">Modelo de IA</Label>
                            <select value={modeloSelecionado} onChange={(e) => setModeloSelecionado(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                                {modelosGPT.map(m => <option key={m.value} value={m.value}>{m.label} — {m.description}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label className="text-white/70 text-sm">Layout</Label>
                            <select value={layoutQuadros} onChange={(e) => setLayoutQuadros(e.target.value as "separados" | "unico")} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                                <option value="separados">Quadros Separados</option>
                                <option value="unico">Quadro Único</option>
                            </select>
                        </div>
                        <Button variant="outline" size="sm" onClick={handlePreviewChunks} disabled={!textoOriginal.trim()} className="w-full border-blue-500/30 hover:bg-blue-500/20 text-white">
                            <Boxes className="h-4 w-4 mr-2" /> Preview de Chunks
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Texto original + Botões */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={cardClass}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white"><Upload className="h-5 w-5 text-blue-400" /> Roteiro Original</CardTitle>
                        <CardDescription className="text-white/50">Cole o roteiro ou texto que deseja traduzir</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea placeholder="Cole aqui seu roteiro..." value={textoOriginal} onChange={(e) => setTextoOriginal(e.target.value)} className="min-h-[400px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20" />
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Badge className="bg-white/10 text-white/50 border-white/10 text-xs">📊 {textoOriginal.length} chars • {Math.ceil(textoOriginal.length / 4)} tokens</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Button variant="outline" size="sm" onClick={handleLimpar} disabled={!textoOriginal && traducoes.length === 0} className="border-red-500/30 hover:bg-red-500/20 text-red-400"><Trash2 className="h-4 w-4" /></Button>
                                <Button variant="outline" size="sm" onClick={() => handleCopy(textoOriginal)} disabled={!textoOriginal} className="border-white/10 text-white hover:bg-white/10"><Copy className="h-4 w-4" /></Button>
                                <Button size="sm" onClick={handleTranslate} disabled={isTranslating || !textoOriginal.trim() || idiomasSelecionados.length === 0} className="bg-blue-600 hover:bg-blue-500 text-white">
                                    {isTranslating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Languages className="h-4 w-4 mr-1" /> Traduzir</>}
                                </Button>
                            </div>
                            {isTranslating && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-white/50">
                                        <span>{currentLanguageProgress && `🌐 Traduzindo ${currentLanguageProgress} (chunk ${currentChunkIndex}/${totalChunks})`}</span>
                                        <div className="flex gap-2">
                                            <span>{Math.round(currentChunkProgress)}%</span>
                                            <button onClick={handleCancelTranslation} className="text-red-400 hover:text-red-300 text-xs">Cancelar</button>
                                        </div>
                                    </div>
                                    {currentChunkProgress > 0 && <Progress value={currentChunkProgress} className="h-2" />}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Traduções */}
                <div>
                    {traducoes.length === 0 ? (
                        <Card className={cardClass}>
                            <CardContent className="p-10 text-center">
                                <Languages className="h-10 w-10 text-white/20 mx-auto mb-3" />
                                <h3 className="text-base font-medium text-white/50 mb-1">Nenhuma tradução ainda</h3>
                                <p className="text-sm text-white/30">Selecione idiomas e clique em "Traduzir"</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {traducoes.map((traducao) => (
                                <Card key={traducao.id} className={cardClass}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Languages className="h-4 w-4 text-blue-400" />
                                                <span className="text-sm font-medium text-white">
                                                    {traducao.idioma === 'combinado' ? 'Combinado' : idiomas.find(i => i.code === traducao.idioma)?.name}
                                                </span>
                                                <Badge className="text-xs bg-white/10 text-white/50 border-white/10">{traducao.texto.length} chars</Badge>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="outline" size="sm" onClick={() => setSelectedTranslation(traducao)} className="border-white/10 text-white hover:bg-white/10 h-8 w-8 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                                                <Button variant="outline" size="sm" onClick={() => { setTraducaoComparacao(traducao); setShowComparison(true); }} className="border-white/10 text-white hover:bg-white/10 h-8 w-8 p-0"><GitCompare className="h-3.5 w-3.5" /></Button>
                                                <Button variant="outline" size="sm" onClick={() => handleCopy(traducao.texto)} className="border-white/10 text-white hover:bg-white/10 h-8 w-8 p-0"><Copy className="h-3.5 w-3.5" /></Button>
                                                <Button variant="outline" size="sm" onClick={() => removeTraducao(traducao.id)} className="border-red-500/30 hover:bg-red-500/20 text-red-400 h-8 w-8 p-0"><Trash2 className="h-3.5 w-3.5" /></Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="h-24 overflow-hidden p-3 bg-white/5 rounded-lg border border-white/10">
                                            <p className="text-sm text-white/40 line-clamp-4">{traducao.texto.substring(0, 200)}...</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialogs */}
            <Dialog open={!!selectedTranslation} onOpenChange={() => setSelectedTranslation(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] bg-[rgba(15,15,18,0.98)] border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2"><Languages className="h-5 w-5 text-blue-400" /> {selectedTranslation && (idiomas.find(i => i.code === selectedTranslation.idioma)?.name || 'Tradução')}</DialogTitle>
                        <DialogDescription className="text-white/50">{selectedTranslation?.texto.length} caracteres</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 p-6 bg-white/5 rounded-lg border border-white/10 max-h-[70vh] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-white/80">{selectedTranslation?.texto}</pre>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={() => { if (selectedTranslation) handleCopy(selectedTranslation.texto); }} className="border-white/10 text-white hover:bg-white/10"><Copy className="h-4 w-4 mr-2" /> Copiar</Button>
                        <Button onClick={() => { if (selectedTranslation) { const t = selectedTranslation; handleExport('txt'); } }} className="bg-blue-600 hover:bg-blue-500"><Download className="h-4 w-4 mr-2" /> TXT</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showChunksPreview} onOpenChange={setShowChunksPreview}>
                <DialogContent className="max-w-4xl max-h-[90vh] bg-[rgba(15,15,18,0.98)] border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2"><Boxes className="h-5 w-5 text-blue-400" /> Preview de Chunks ({chunks.length})</DialogTitle>
                        <DialogDescription className="text-white/50">Como o texto será dividido para tradução otimizada</DialogDescription>
                    </DialogHeader>
                    {chunkStats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg">
                            <div><p className="text-xs text-white/40">Chunks</p><p className="text-2xl font-bold text-white">{chunkStats.total_chunks}</p></div>
                            <div><p className="text-xs text-white/40">Médio</p><p className="text-2xl font-bold text-white">{chunkStats.avg_size}</p><p className="text-xs text-white/40">chars</p></div>
                            <div><p className="text-xs text-white/40">Min/Max</p><p className="text-lg font-bold text-white">{chunkStats.min_size}/{chunkStats.max_size}</p></div>
                            <div><p className="text-xs text-white/40">Total</p><p className="text-2xl font-bold text-white">{chunkStats.total_chars}</p></div>
                        </div>
                    )}
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto mt-2">
                        {chunks.map((chunk) => (
                            <Card key={chunk.index} className="bg-white/5 border-white/10">
                                <CardHeader className="pb-2 pt-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Chunk {chunk.index}/{chunks.length}</Badge>
                                        <Badge className={`text-xs ${chunk.break_type === 'paragraph' ? 'bg-green-500/20 text-green-400' : chunk.break_type === 'sentence' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                            {chunk.break_type === 'paragraph' ? '📄 Parágrafo' : chunk.break_type === 'sentence' ? '📝 Sentença' : '⚠️ Forçado'}
                                        </Badge>
                                        <span className="text-xs text-white/40">{chunk.char_count} chars</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-3">
                                    <p className="text-sm text-white/60 line-clamp-3 font-mono">{chunk.text.substring(0, 300)}{chunk.text.length > 300 ? '...' : ''}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showComparison} onOpenChange={setShowComparison}>
                <DialogContent className="max-w-6xl max-h-[90vh] bg-[rgba(15,15,18,0.98)] border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2"><GitCompare className="h-5 w-5" /> Original vs Traduzido</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                        <div>
                            <h4 className="text-white font-semibold mb-3">Texto Original <span className="text-xs text-white/40">({textoOriginal.length} chars)</span></h4>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 h-[55vh] overflow-y-auto">
                                <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{textoOriginal}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-3">Traduzido ({idiomas.find(i => i.code === traducaoComparacao?.idioma)?.name}) <span className="text-xs text-white/40">({traducaoComparacao?.texto.length} chars)</span></h4>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 h-[55vh] overflow-y-auto">
                                <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{traducaoComparacao?.texto}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Barra fixa de download */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-[rgba(15,15,18,0.95)] backdrop-blur-md border-t border-white/5 z-40">
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0"><Download className="h-4 w-4 text-blue-400" /></div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-medium text-white">{traducoes.length > 0 ? `${traducoes.length} tradução(ões)` : 'Aguardando traduções'}</p>
                        </div>
                        <Input value={tituloArquivo} onChange={(e) => setTituloArquivo(e.target.value)} placeholder="Título do arquivo" className="max-w-[200px] h-8 bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs" />
                    </div>
                    <div className="flex items-center gap-1">
                        {(['txt', 'docx', 'srt', 'json'] as const).map(fmt => (
                            <Button key={fmt} variant="outline" size="sm" onClick={() => handleExport(fmt)} disabled={traducoes.length === 0} className="border-white/10 text-white hover:bg-white/10 px-2 md:px-3 text-xs">
                                {fmt === 'docx' ? <File className="h-3.5 w-3.5 md:mr-1" /> : <FileText className="h-3.5 w-3.5 md:mr-1" />}
                                <span className="hidden md:inline">{fmt.toUpperCase()}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
