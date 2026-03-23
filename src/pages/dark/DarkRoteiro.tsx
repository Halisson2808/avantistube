import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PenTool, Copy, Download, Eye, Trash2, Settings2, Loader2, FileText, File } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSyncNicho } from "@/hooks/dark/useSyncNicho";
import { callClaude } from "@/services/dark/claudeApi";
import { callOpenAI } from "@/services/dark/openaiApi";
import { hasApiKeys } from "@/lib/dark/apiKeysStorage";
import { saveRoteiro, getRoteiros, deleteRoteiro } from "@/lib/dark/localStorage";
import { exportToDocx } from "@/lib/dark/docxExporter";

const modelosIA = [
    { value: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
    { value: "claude-sonnet-4", label: "Claude Sonnet 4" },
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
];

const idiomasDisponiveis = [
    { code: "pt", name: "Português" },
    { code: "es", name: "Espanhol" },
    { code: "en", name: "Inglês" },
    { code: "de", name: "Alemão" },
    { code: "pl", name: "Polonês" },
    { code: "ko", name: "Coreano" },
];

const nichosDisponiveis = [
    { value: "mecanico", label: "Mecânico 🔧" },
    { value: "militar", label: "Militar 🎖️" },
    { value: "historiaEpoca", label: "História de Época 🏛️" },
];

const promptBase = (nicho: string, idioma: string, chars: number) =>
    `Você é um roteirista profissional especializado em histórias dramáticas para YouTube.\nNicho: ${nicho}\nIdioma: ${idioma}\nTamanho: aproximadamente ${chars} caracteres.\nCrie um roteiro completo, envolvente e profissional. Comece diretamente com a história, sem títulos de seções.`;

interface RoteiroGerado {
    id: string; titulo: string; conteudo: string; caracteres: number;
    nicho: string; idioma: string; modelo_ia: string; created_at: string;
}

export default function DarkRoteiro() {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState("");
    const [tamanhoCaracteres, setTamanhoCaracteres] = useState(30000);
    const [nichoSelecionado, setNichoSelecionado] = useSyncNicho("");
    const [modeloSelecionado, setModeloSelecionado] = useState("claude-sonnet-4-5");
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentIdioma, setCurrentIdioma] = useState("");
    const [gerarMultiIdioma, setGerarMultiIdioma] = useState(false);
    const [idiomasSelecionados, setIdiomasSelecionados] = useState<string[]>(["pt"]);
    const [roteirosGerados, setRoteirosGerados] = useState<RoteiroGerado[]>([]);

    useEffect(() => { setRoteirosGerados(getRoteiros()); }, []);

    const toggleIdioma = (code: string) => {
        if (idiomasSelecionados.includes(code)) { if (idiomasSelecionados.length > 1) setIdiomasSelecionados(idiomasSelecionados.filter(i => i !== code)); }
        else setIdiomasSelecionados([...idiomasSelecionados, code]);
    };

    const calcularMaxTokens = (c: number) => Math.min(Math.ceil(Math.ceil(c / 3.5) * 1.2), 16000);

    const handleGenerate = async () => {
        if (!hasApiKeys()) { toast.error("Configure as API keys primeiro"); navigate("/avantisdark/configuracoes"); return; }
        setIsGenerating(true); setProgress(0);
        try {
            const isClaude = modeloSelecionado.startsWith('claude');
            const idiomasParaGerar = gerarMultiIdioma ? idiomasSelecionados : ["pt"];
            const novosRoteiros: RoteiroGerado[] = [];
            for (let i = 0; i < idiomasParaGerar.length; i++) {
                const idiomaCode = idiomasParaGerar[i];
                const idiomaInfo = idiomasDisponiveis.find(id => id.code === idiomaCode);
                setCurrentIdioma(idiomaInfo?.name || "");
                setProgress(Math.floor((i / idiomasParaGerar.length) * 100));
                toast.info(`Gerando roteiro em ${idiomaInfo?.name}...`);
                const maxTokens = calcularMaxTokens(tamanhoCaracteres);
                const prompt = promptBase(nichoSelecionado, idiomaInfo?.name || "pt", tamanhoCaracteres);
                let conteudo: string;
                if (isClaude) {
                    const r = await callClaude([{ role: 'user', content: `${prompt}\n\nTÍTULO: ${titulo}\n\nGere o roteiro completo agora:` }], modeloSelecionado, maxTokens);
                    conteudo = r.content;
                } else {
                    const r = await callOpenAI([
                        { role: 'system', content: 'Você é um roteirista profissional.' },
                        { role: 'user', content: `${prompt}\n\nTÍTULO: ${titulo}\n\nGere o roteiro completo agora:` }
                    ], modeloSelecionado, maxTokens);
                    conteudo = r.content;
                }
                const novoRoteiro: RoteiroGerado = {
                    id: `roteiro-${Date.now()}-${idiomaCode}`,
                    titulo: titulo.trim() || `Roteiro ${Date.now()}`,
                    idioma: idiomaCode, conteudo, caracteres: tamanhoCaracteres,
                    nicho: nichoSelecionado, modelo_ia: modeloSelecionado, created_at: new Date().toISOString()
                };
                saveRoteiro(novoRoteiro);
                novosRoteiros.push(novoRoteiro);
                toast.success(`✅ Roteiro em ${idiomaInfo?.name} concluído!`);
            }
            setProgress(100);
            setRoteirosGerados([...novosRoteiros, ...roteirosGerados]);
            toast.success(`🎉 ${novosRoteiros.length} roteiro(s) gerado(s) com sucesso!`);
        } catch (error: any) { toast.error(error.message || 'Erro ao gerar roteiro'); }
        finally { setIsGenerating(false); setProgress(0); setCurrentIdioma(""); }
    };

    const handleExport = async (roteiro: RoteiroGerado, format: 'txt' | 'docx') => {
        try {
            const nomeArquivo = roteiro.titulo.startsWith('Roteiro ') ? `${roteiro.idioma.toUpperCase()} - ${nichoSelecionado}` : roteiro.titulo;
            if (format === 'docx') { await exportToDocx({ content: roteiro.conteudo, filename: `${nomeArquivo}.docx` }); toast.success('Arquivo DOCX baixado!'); return; }
            const blob = new Blob([roteiro.conteudo], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `${nomeArquivo}.txt`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            toast.success('Arquivo TXT baixado!');
        } catch { toast.error('Erro ao baixar arquivo'); }
    };

    const handleDelete = (id: string) => { deleteRoteiro(id); setRoteirosGerados(roteirosGerados.filter(r => r.id !== id)); toast.success('Roteiro excluído!'); };
    const getIdiomaName = (code: string) => idiomasDisponiveis.find(i => i.code === code)?.name || code;
    const cardClass = "glass-panel border-white/10";
    const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-white/20";

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gradient flex items-center gap-2"><PenTool className="h-8 w-8" /> Gerar Roteiro</h1>
                    <p className="text-white/50 mt-2">Crie roteiros profissionais usando IA</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/avantisdark/configuracoes")} className="border-white/10 text-white hover:bg-white/10">
                    <Settings2 className="h-4 w-4 mr-2" /> Configurar APIs
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
                <Card className={`${cardClass} h-fit`}>
                    <CardHeader>
                        <CardTitle className="text-white">Configurações</CardTitle>
                        <CardDescription className="text-white/50">Configure os parâmetros para o roteiro</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-white/70">Nicho</Label>
                                <select value={nichoSelecionado} onChange={(e) => setNichoSelecionado(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                                    <option value="">Selecione...</option>
                                    {nichosDisponiveis.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label className="text-white/70">Modelo de IA</Label>
                                <select value={modeloSelecionado} onChange={(e) => setModeloSelecionado(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                                    {modelosIA.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <Label className="text-white/70">Título (Opcional)</Label>
                            <Input placeholder="Ex: A Grande Aventura" value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={200} className={`mt-1 ${inputClass}`} />
                        </div>
                        <div>
                            <Label className="text-white/70">Tamanho (caracteres)</Label>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                {[20000, 30000, 40000, 50000].map(t => (
                                    <Button key={t} variant={tamanhoCaracteres === t ? "default" : "outline"} onClick={() => setTamanhoCaracteres(t)} className={tamanhoCaracteres === t ? "bg-blue-600 text-white border-blue-600" : "border-white/10 text-white hover:bg-white/10"}>
                                        {t / 1000}k
                                    </Button>
                                ))}
                            </div>
                            <Input type="number" placeholder="Customizado (máx. 150k)" value={tamanhoCaracteres} onChange={(e) => setTamanhoCaracteres(Number(e.target.value))} min={1000} max={150000} className={`mt-2 ${inputClass}`} />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="multi-idioma" checked={gerarMultiIdioma} onCheckedChange={(c) => setGerarMultiIdioma(c as boolean)} />
                                <Label htmlFor="multi-idioma" className="text-white/70">Gerar em múltiplos idiomas</Label>
                            </div>
                            {gerarMultiIdioma && (
                                <div className="grid grid-cols-2 gap-2 pl-6">
                                    {idiomasDisponiveis.map(i => (
                                        <div key={i.code} className="flex items-center space-x-2">
                                            <Checkbox id={i.code} checked={idiomasSelecionados.includes(i.code)} onCheckedChange={() => toggleIdioma(i.code)} />
                                            <Label htmlFor={i.code} className="text-white/70">{i.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1 bg-blue-600 hover:bg-blue-500">
                                {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Gerando...</> : <><PenTool className="h-4 w-4 mr-2" /> Gerar Roteiro</>}
                            </Button>
                            <Button variant="outline" onClick={() => { setTitulo(""); setTamanhoCaracteres(30000); }} className="border-white/10 text-white hover:bg-white/10"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        {isGenerating && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-white/50">
                                    <span>{currentIdioma && `🌐 Gerando em ${currentIdioma}`}</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div>
                    {roteirosGerados.length === 0 ? (
                        <Card className={cardClass}>
                            <CardContent className="p-6 text-center">
                                <PenTool className="h-10 w-10 text-white/20 mx-auto mb-3" />
                                <h3 className="text-base font-medium text-white/50 mb-1">Nenhum roteiro gerado ainda</h3>
                                <p className="text-sm text-white/30">Configure e clique em "Gerar Roteiro" para começar</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className={cardClass}>
                            <CardHeader>
                                <CardTitle className="text-white">Roteiros Gerados ({roteirosGerados.length})</CardTitle>
                                <CardDescription className="text-white/50">Seus roteiros salvos localmente</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {roteirosGerados.map((roteiro) => (
                                        <Card key={roteiro.id} className="bg-white/5 border-white/10">
                                            <CardContent className="p-4">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-white">{roteiro.titulo}</h3>
                                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{getIdiomaName(roteiro.idioma)}</Badge>
                                                                <Badge className="bg-white/10 text-white/50 border-white/10">{roteiro.conteudo.length} chars</Badge>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-white/10 text-white hover:bg-white/10"><Eye className="h-3.5 w-3.5" /></Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-4xl max-h-[80vh] bg-[rgba(15,15,18,0.98)] border-white/10">
                                                                    <DialogHeader>
                                                                        <DialogTitle className="text-white">{roteiro.titulo}</DialogTitle>
                                                                        <DialogDescription className="text-white/50">{getIdiomaName(roteiro.idioma)} • {roteiro.conteudo.length} caracteres</DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="mt-4 p-6 bg-white/5 rounded-lg border border-white/10 max-h-[60vh] overflow-y-auto">
                                                                        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">{roteiro.conteudo}</pre>
                                                                    </div>
                                                                    <div className="flex gap-2 mt-4">
                                                                        <Button variant="outline" onClick={() => { navigator.clipboard.writeText(roteiro.conteudo); toast.success("Copiado!"); }} className="border-white/10 text-white hover:bg-white/10"><Copy className="h-4 w-4 mr-2" /> Copiar</Button>
                                                                        <Button onClick={() => handleExport(roteiro, 'txt')} className="bg-blue-600 hover:bg-blue-500"><FileText className="h-4 w-4 mr-2" /> TXT</Button>
                                                                        <Button onClick={() => handleExport(roteiro, 'docx')} className="bg-blue-600 hover:bg-blue-500"><File className="h-4 w-4 mr-2" /> DOCX</Button>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(roteiro.conteudo)} className="h-8 w-8 p-0 border-white/10 text-white hover:bg-white/10"><Copy className="h-3.5 w-3.5" /></Button>
                                                            <Button variant="outline" size="sm" onClick={() => handleExport(roteiro, 'docx')} className="h-8 w-8 p-0 border-white/10 text-white hover:bg-white/10"><Download className="h-3.5 w-3.5" /></Button>
                                                            <Button variant="outline" size="sm" onClick={() => handleDelete(roteiro.id)} className="h-8 w-8 p-0 border-red-500/30 hover:bg-red-500/20 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 h-24 overflow-hidden">
                                                        <p className="text-sm text-white/40 line-clamp-4">{roteiro.conteudo.substring(0, 200)}...</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
