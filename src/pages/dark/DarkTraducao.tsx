import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Languages, Copy, Download, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getApiKeys, hasApiKeys } from "@/lib/dark/apiKeysStorage";
import { useNavigate } from "react-router-dom";

const idiomasDisponiveis = [
    { code: "es", name: "Espanhol", flag: "🇪🇸" },
    { code: "en", name: "Inglês", flag: "🇺🇸" },
    { code: "de", name: "Alemão", flag: "🇩🇪" },
    { code: "pl", name: "Polonês", flag: "🇵🇱" },
    { code: "ko", name: "Coreano", flag: "🇰🇷" },
    { code: "fr", name: "Francês", flag: "🇫🇷" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
];

interface Translation { idioma: string; code: string; flag: string; texto: string; }

export default function DarkTraducao() {
    const navigate = useNavigate();
    const [textoOriginal, setTextoOriginal] = useState("");
    const [idiomasSelecionados, setIdiomasSelecionados] = useState<string[]>(["es"]);
    const [traducoes, setTraducoes] = useState<Translation[]>([]);
    const [isTranslating, setIsTranslating] = useState(false);
    const [currentLang, setCurrentLang] = useState("");
    const [progress, setProgress] = useState(0);

    const toggleIdioma = (code: string) => {
        setIdiomasSelecionados(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
    };

    const translateChunk = async (text: string, targetLang: string, apiKey: string): Promise<string> => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: `Você é um tradutor profissional especializado em roteiros de YouTube. Traduza o texto para ${targetLang}, mantendo o estilo narrativo, dramaticidade e fluidez do original. Traduza APENAS o texto, sem adicionais ou explicações.` },
                    { role: 'user', content: text }
                ],
                temperature: 0.3
            })
        });
        if (!response.ok) { const e = await response.json(); throw new Error(e.error?.message || 'Erro na API'); }
        const data = await response.json();
        return data.choices[0].message.content;
    };

    const handleTranslate = async () => {
        if (!textoOriginal.trim()) { toast.error("Cole um texto para traduzir"); return; }
        if (idiomasSelecionados.length === 0) { toast.error("Selecione pelo menos um idioma"); return; }
        if (!hasApiKeys()) { toast.error("Configure suas API Keys"); navigate("/avantisdark/configuracoes"); return; }
        const keys = getApiKeys();
        if (!keys.openaiKey) { toast.error("Configure a API key da OpenAI"); return; }

        setIsTranslating(true); setTraducoes([]); setProgress(0);
        try {
            const novasTraducoes: Translation[] = [];
            for (let i = 0; i < idiomasSelecionados.length; i++) {
                const code = idiomasSelecionados[i];
                const info = idiomasDisponiveis.find(l => l.code === code)!;
                setCurrentLang(info.name);
                setProgress(Math.floor((i / idiomasSelecionados.length) * 100));
                toast.info(`Traduzindo para ${info.name}...`);
                const texto = await translateChunk(textoOriginal, info.name, keys.openaiKey);
                novasTraducoes.push({ idioma: info.name, code, flag: info.flag, texto });
                toast.success(`✅ ${info.name} concluído!`);
            }
            setTraducoes(novasTraducoes);
            setProgress(100);
            toast.success('🎉 Todas as traduções concluídas!');
        } catch (error: any) { toast.error(error.message || 'Erro ao traduzir'); }
        finally { setIsTranslating(false); setCurrentLang(""); setProgress(0); }
    };

    const downloadAll = () => {
        traducoes.forEach(t => {
            const blob = new Blob([t.texto], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `traducao-${t.code}-${Date.now()}.txt`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        toast.success('Downloads iniciados!');
    };

    const cardClass = "glass-panel border-white/10";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gradient flex items-center gap-2"><Languages className="h-8 w-8" /> Traduzir Roteiros</h1>
                <p className="text-white/50 mt-2">Traduza seu roteiro para múltiplos idiomas com IA</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
                <div className="space-y-6">
                    <Card className={cardClass}>
                        <CardHeader>
                            <CardTitle className="text-white">Texto Original</CardTitle>
                            <CardDescription className="text-white/50">Cole o roteiro que deseja traduzir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Cole aqui o roteiro para traduzir..."
                                value={textoOriginal}
                                onChange={(e) => setTextoOriginal(e.target.value)}
                                className="min-h-[300px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20"
                            />
                            <div className="flex items-center justify-between mt-2">
                                <Badge className="bg-white/10 text-white/50 border-white/10">{textoOriginal.length} caracteres</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={cardClass}>
                        <CardHeader>
                            <CardTitle className="text-white">Idiomas Destino</CardTitle>
                            <CardDescription className="text-white/50">Selecione os idiomas da tradução</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                {idiomasDisponiveis.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => toggleIdioma(lang.code)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${idiomasSelecionados.includes(lang.code) ? 'border-blue-500 bg-blue-500/20 text-white' : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        <span>{lang.flag}</span> {lang.name}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Button onClick={handleTranslate} disabled={isTranslating || !textoOriginal.trim() || idiomasSelecionados.length === 0} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6">
                        {isTranslating ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Traduzindo {currentLang}...</> : <><Sparkles className="h-5 w-5 mr-2" /> Traduzir Roteiro</>}
                    </Button>

                    {isTranslating && (
                        <Card className={cardClass}>
                            <CardContent className="p-4 space-y-2">
                                <div className="flex justify-between text-xs text-white/50">
                                    <span>{currentLang && `🌐 Traduzindo ${currentLang}...`}</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-4">
                    {traducoes.length > 0 && (
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">{traducoes.length} Tradução(ões) Concluída(s)</h2>
                            <Button onClick={downloadAll} variant="outline" className="border-white/10 text-white hover:bg-white/10">
                                <Download className="h-4 w-4 mr-2" /> Baixar Todos
                            </Button>
                        </div>
                    )}
                    {traducoes.length === 0 && !isTranslating && (
                        <Card className={cardClass}>
                            <CardContent className="p-10 text-center">
                                <Languages className="h-12 w-12 text-white/20 mx-auto mb-4" />
                                <h3 className="text-white/50 font-medium">Nenhuma tradução ainda</h3>
                                <p className="text-white/30 text-sm mt-1">Cole um roteiro e selecione os idiomas</p>
                            </CardContent>
                        </Card>
                    )}
                    {traducoes.map(t => (
                        <Card key={t.code} className={cardClass}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white flex items-center gap-2">{t.flag} {t.idioma}</CardTitle>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(t.texto)} className="border-white/10 text-white hover:bg-white/10">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => {
                                            const blob = new Blob([t.texto], { type: 'text/plain' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a'); a.href = url; a.download = `traducao-${t.code}.txt`;
                                            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
                                        }} className="border-white/10 text-white hover:bg-white/10">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Badge className="w-fit bg-white/10 text-white/50 border-white/10">{t.texto.length} caracteres</Badge>
                            </CardHeader>
                            <CardContent>
                                <Textarea value={t.texto} readOnly className="min-h-[300px] resize-none bg-white/5 border-white/10 text-white/80 font-mono text-xs" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
