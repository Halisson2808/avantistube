import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileText, Type, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "quadro_branco_temp";

export default function QuadroBranco() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [nicho, setNicho] = useState("");
    const [projetoId, setProjetoId] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [sheetOpen, setSheetOpen] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [selectedCharCount, setSelectedCharCount] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { const data = JSON.parse(saved); setNicho(data.nicho || ""); setProjetoId(data.projetoId || ""); setConteudo(data.conteudo || ""); } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ nicho, projetoId, conteudo }));
        setCharCount(conteudo.length);
    }, [nicho, projetoId, conteudo]);

    useEffect(() => {
        const handler = () => setSelectedCharCount(window.getSelection()?.toString().length || 0);
        document.addEventListener("selectionchange", handler);
        return () => document.removeEventListener("selectionchange", handler);
    }, []);

    const getSelectedText = () => {
        const textarea = textareaRef.current;
        if (!textarea) return null;
        const start = textarea.selectionStart, end = textarea.selectionEnd;
        return { start, end, text: conteudo.substring(start, end) };
    };

    const replaceSelectedText = (newText: string) => {
        const selection = getSelectedText();
        if (!selection || !selection.text) { toast.error("Selecione um texto para manipular"); return; }
        setConteudo(conteudo.substring(0, selection.start) + newText + conteudo.substring(selection.end));
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newPos = selection.start + newText.length;
                textareaRef.current.setSelectionRange(newPos, newPos);
            }
        }, 0);
    };

    const manipularTexto = (tipo: string) => {
        const selection = getSelectedText();
        if (!selection?.text) { toast.error("Selecione um texto para manipular"); return; }
        let r = "";
        switch (tipo) {
            case "maiusculo": r = selection.text.toUpperCase(); break;
            case "minusculo": r = selection.text.toLowerCase(); break;
            case "primeira_letra_frase": r = selection.text.charAt(0).toUpperCase() + selection.text.slice(1).toLowerCase(); break;
            case "primeira_letra_palavra": r = selection.text.replace(/\b\w/g, c => c.toUpperCase()); break;
            default: r = selection.text;
        }
        replaceSelectedText(r);
        toast.success("Texto manipulado!");
    };

    const manipularBotoes = [
        { id: "maiusculo", label: "MAIÚSCULO", icon: ArrowUp, action: () => manipularTexto("maiusculo") },
        { id: "minusculo", label: "minúsculo", icon: ArrowDown, action: () => manipularTexto("minusculo") },
        { id: "primeira_letra_frase", label: "Primeira letra da frase", icon: Type, action: () => manipularTexto("primeira_letra_frase") },
        { id: "primeira_letra_palavra", label: "Primeira Letra De Cada Palavra", icon: Type, action: () => manipularTexto("primeira_letra_palavra") },
    ];

    const ManipulacaoContent = () => (
        <div className="space-y-2 p-4">
            <p className="text-xs text-white/40 mb-3">Selecione um texto nas anotações para manipular</p>
            {manipularBotoes.map((botao) => (
                <Button key={botao.id} onClick={botao.action} variant="outline" className="w-full justify-start h-auto py-3 border-white/10 text-white hover:bg-white/10">
                    <botao.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="text-left text-sm">{botao.label}</span>
                </Button>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)]">
            <Card className="flex-1 flex flex-col glass-panel border-white/10">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="flex items-center gap-2 text-white text-lg md:text-xl">
                        <FileText className="h-5 w-5 text-blue-400" /> Quadro Branco
                    </CardTitle>
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="lg:hidden border-white/10 text-white hover:bg-white/10">
                                <Type className="h-4 w-4 mr-2" /> Manipular
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 bg-[rgba(15,15,18,0.98)] border-white/10">
                            <SheetHeader className="p-4 border-b border-white/10">
                                <SheetTitle className="text-white">Manipulação de Texto</SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-5rem)]">
                                <ManipulacaoContent />
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col gap-3 md:gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {[
                            { id: "nicho", label: "Nicho", placeholder: "Ex: Terror, Romance...", value: nicho, set: setNicho },
                            { id: "projetoId", label: "ID do Projeto", placeholder: "Ex: PROJ-001", value: projetoId, set: setProjetoId },
                        ].map(field => (
                            <div key={field.id} className="space-y-1.5">
                                <Label htmlFor={field.id} className="text-sm text-white/70">{field.label}</Label>
                                <Input id={field.id} placeholder={field.placeholder} value={field.value} onChange={(e) => field.set(e.target.value)} className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/20" />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="conteudo" className="text-sm text-white/70">Anotações</Label>
                            <span className="text-xs text-white/40">
                                {selectedCharCount > 0 ? <span className="text-blue-400 font-medium">{selectedCharCount} selecionados</span> : <span>{charCount} caracteres</span>}
                            </span>
                        </div>
                        <Textarea
                            ref={textareaRef}
                            id="conteudo"
                            placeholder="Digite suas anotações aqui..."
                            className="flex-1 resize-none text-sm bg-white/5 border-white/10 text-white placeholder:text-white/20"
                            value={conteudo}
                            onChange={(e) => setConteudo(e.target.value)}
                        />
                    </div>

                    <div className="flex pt-3 border-t border-white/10">
                        <Button onClick={() => { setNicho(""); setProjetoId(""); setConteudo(""); localStorage.removeItem(STORAGE_KEY); toast.info("Campos limpos"); }} variant="outline" className="w-full h-9 text-sm border-white/10 text-white hover:bg-white/10">
                            Limpar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="hidden lg:flex w-80 flex-col glass-panel border-white/10">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <Type className="h-5 w-5 text-blue-400" /> Manipulação de Texto
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1">
                        <ManipulacaoContent />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
