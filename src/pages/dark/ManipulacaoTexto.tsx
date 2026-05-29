import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Type, Copy, RotateCcw, ArrowUp, ArrowDown, ArrowRightLeft,
    FileText, AlignLeft, AlignCenter, Sparkles, List
} from "lucide-react";
import { toast } from "sonner";
import { aiChat } from "@/lib/dark/aiClient";

export default function ManipulacaoTexto() {
    const [texto, setTexto] = useState("");
    const [resultado, setResultado] = useState("");
    const [isConverting, setIsConverting] = useState(false);

    const manipularTexto = (tipo: string) => {
        if (!texto.trim()) { toast.error("Digite um texto para manipular"); return; }
        let textoManipulado = "";
        switch (tipo) {
            case "maiusculo": textoManipulado = texto.toUpperCase(); break;
            case "minusculo": textoManipulado = texto.toLowerCase(); break;
            case "primeira_letra_frase": textoManipulado = texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase(); break;
            case "primeira_letra_palavra": textoManipulado = texto.replace(/\b\w/g, c => c.toUpperCase()); break;
            case "inverter": textoManipulado = texto.split("").reverse().join(""); break;
            case "inverter_palavras": textoManipulado = texto.split(" ").reverse().join(" "); break;
            case "alternar_maiusculo": textoManipulado = texto.split("").map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join(""); break;
            case "primeira_palavra_maiusculo": { const p = texto.split(" "); p[0] = p[0].charAt(0).toUpperCase() + p[0].slice(1).toLowerCase(); textoManipulado = p.join(" "); break; }
            case "remover_espacos": textoManipulado = texto.replace(/\s+/g, " ").trim(); break;
            case "quebrar_linhas": textoManipulado = texto.replace(/\s+/g, "\n"); break;
            case "junta_linhas": textoManipulado = texto.replace(/\n+/g, " ").trim(); break;
            case "remover_linhas_vazias": textoManipulado = texto.split("\n").filter(l => l.trim() !== "").join("\n"); break;
            default: textoManipulado = texto;
        }
        setResultado(textoManipulado);
        toast.success("Texto manipulado com sucesso!");
    };

    const converterTituloImpacto = async () => {
        if (!texto.trim()) { toast.error("Digite um título para converter"); return; }
        setIsConverting(true);
        toast.info("Convertendo título para impacto...");
        try {
            const prompt = `Converta o seguinte título em 5 versões de ALTO IMPACTO:\nTÍTULO ORIGINAL: "${texto}"\nREGRAS: USE AS MESMAS PALAVRAS, apenas coloque algumas em MAIÚSCULO.\nFORMATO:\n1. [versão]\n2. [versão]\n3. [versão]\n4. [versão]\n5. [versão]\nRetorne APENAS as 5 versões numeradas.`;
            const content = await aiChat([
                { role: "system", content: "Você é especialista em copywriting." },
                { role: "user", content: prompt }
            ]);
            const versoes = content.split('\n').map((l: string) => l.replace(/^\d+\.\s*/, '').trim()).filter((l: string) => l.length > 0).join('\n');
            setResultado(versoes);
            toast.success("Título convertido com sucesso!");
        } catch (error: any) { toast.error(error.message || "Erro ao processar"); }
        finally { setIsConverting(false); }
    };

    const botoes = [
        { id: "maiusculo", label: "MAIÚSCULO", desc: "Todo em maiúsculo", icon: ArrowUp, color: "bg-red-600 hover:bg-red-700" },
        { id: "minusculo", label: "minúsculo", desc: "Todo em minúsculo", icon: ArrowDown, color: "bg-blue-600 hover:bg-blue-700" },
        { id: "primeira_letra_frase", label: "Primeira letra da frase", desc: "Apenas primeira maiúscula", icon: Type, color: "bg-green-600 hover:bg-green-700" },
        { id: "primeira_letra_palavra", label: "Primeira Letra De Cada Palavra", desc: "Cada palavra com maiúscula", icon: AlignLeft, color: "bg-purple-600 hover:bg-purple-700" },
        { id: "inverter", label: "Inverter Texto", desc: "Inverte os caracteres", icon: ArrowRightLeft, color: "bg-orange-600 hover:bg-orange-700" },
        { id: "inverter_palavras", label: "Inverter Palavras", desc: "Inverte as palavras", icon: RotateCcw, color: "bg-pink-600 hover:bg-pink-700" },
        { id: "alternar_maiusculo", label: "AlTeRnAr", desc: "Alterna maiúsculo/minúsculo", icon: AlignCenter, color: "bg-indigo-600 hover:bg-indigo-700" },
        { id: "primeira_palavra_maiusculo", label: "Primeira palavra", desc: "Apenas a primeira", icon: FileText, color: "bg-teal-600 hover:bg-teal-700" },
        { id: "remover_espacos", label: "Remover espaços extras", desc: "Remove espaços duplos", icon: AlignLeft, color: "bg-gray-600 hover:bg-gray-700" },
        { id: "quebrar_linhas", label: "Quebrar em linhas", desc: "Cada palavra em linha", icon: ArrowDown, color: "bg-cyan-600 hover:bg-cyan-700" },
        { id: "junta_linhas", label: "Juntar linhas", desc: "Remove quebras de linha", icon: ArrowUp, color: "bg-emerald-600 hover:bg-emerald-700" },
        { id: "remover_linhas_vazias", label: "Remover linhas vazias", desc: "Remove linhas sem texto", icon: List, color: "bg-slate-600 hover:bg-slate-700" },
        { id: "titulo_impacto", label: "Converter para IMPACTO", desc: "5 versões com MAIÚSCULO (IA)", icon: Sparkles, color: "bg-yellow-600 hover:bg-yellow-700", isAI: true },
    ];

    const textareaClass = "resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gradient">Manipulação de Texto</h1>
                <p className="text-white/50 mt-2">Transforme seu texto com facilidade</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-panel border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white"><Type className="h-5 w-5 text-blue-400" /> Texto Original</CardTitle>
                        <CardDescription className="text-white/50">Cole ou digite o texto</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="texto-original" className="text-white/70">Seu texto</Label>
                            <Textarea id="texto-original" placeholder="Cole ou digite seu texto aqui..." value={texto} onChange={(e) => setTexto(e.target.value)} className={`min-h-[200px] ${textareaClass}`} />
                        </div>
                        <div className="flex gap-4 text-xs text-white/40">
                            <span>{texto.length} Caracteres</span>
                            <span>{texto.trim().split(/\s+/).filter(p => p.length > 0).length} Palavras</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(texto)} disabled={!texto} className="flex-1 border-white/10 text-white hover:bg-white/5"><Copy className="h-4 w-4 mr-2" /> Copiar Original</Button>
                            <Button variant="outline" size="sm" onClick={() => { setTexto(""); setResultado(""); }} className="flex-1 border-white/10 text-white hover:bg-white/5"><RotateCcw className="h-4 w-4 mr-2" /> Limpar</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white"><FileText className="h-5 w-5 text-green-400" /> Resultado</CardTitle>
                        <CardDescription className="text-white/50">O texto transformado</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="resultado" className="text-white/70">Texto transformado</Label>
                            <Textarea id="resultado" value={resultado} readOnly className={`min-h-[200px] ${textareaClass}`} placeholder="O resultado aparecerá aqui..." />
                        </div>
                        <Button onClick={() => navigator.clipboard.writeText(resultado)} disabled={!resultado} className="w-full bg-blue-600 hover:bg-blue-500">
                            <Copy className="h-4 w-4 mr-2" /> Copiar Resultado
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Ferramentas de Manipulação</CardTitle>
                    <CardDescription className="text-white/50">Clique em qualquer botão para transformar seu texto</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {botoes.map((b) => (
                            <Button
                                key={b.id}
                                onClick={() => b.isAI ? converterTituloImpacto() : manipularTexto(b.id)}
                                disabled={!texto.trim() || (b.isAI ? isConverting : false)}
                                className={`${b.color} text-white font-medium h-auto p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-all duration-200`}
                            >
                                <b.icon className="h-5 w-5" />
                                <div className="text-center">
                                    <div className="text-sm font-semibold">{b.label}</div>
                                    <div className="text-xs opacity-90">{b.desc}</div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
