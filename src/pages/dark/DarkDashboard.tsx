import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText, Languages, PenTool, Video, Subtitles, FileType,
    Wrench, FileBarChart, Sparkles, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const toolCategories = [
    {
        name: "Criação Magnética",
        description: "Ferramentas para gerar roteiros, títulos e retenção.",
        tools: [
            { title: "Script Forge AI", description: "Roteiros criados para prender a atenção do segundo 1 ao fim.", icon: PenTool, href: "/avantisdark/roteiro", color: "text-violet-400", bg: "bg-violet-500/10", borderhover: "hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]" },
            { title: "Baixar Thumbnail", description: "Baixe a thumb de qualquer vídeo do YouTube em alta qualidade.", icon: Video, href: "/avantisdark/baixar-thumb-youtube", color: "text-amber-400", bg: "bg-amber-500/10", borderhover: "hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]" },
            { title: "Quadro Branco", description: "Estruture suas ideias de forma visual antes de gravar.", icon: FileType, href: "/avantisdark/quadro-branco", color: "text-blue-400", bg: "bg-blue-500/10", borderhover: "hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
        ]
    },
    {
        name: "Pós-Produção IA",
        description: "Deixe o trabalho pesado para os agentes.",
        tools: [
            { title: "Transcrição Neural", description: "Extraia texto perfeito de qualquer áudio ou vídeo.", icon: Video, href: "/avantisdark/transcricao", color: "text-emerald-400", bg: "bg-emerald-500/10", borderhover: "hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]" },
            { title: "Tradução Global", description: "Expanda seu alcance traduzindo vídeos para 50+ idiomas.", icon: Languages, href: "/avantisdark/traducao", color: "text-rose-400", bg: "bg-rose-500/10", borderhover: "hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]" },
            { title: "Legendas Mágicas", description: "Gere arquivos .SRT perfeitamente sincronizados.", icon: Subtitles, href: "/avantisdark/gerador-srt", color: "text-cyan-400", bg: "bg-cyan-500/10", borderhover: "hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]" },
            { title: "Compactar Thumb", description: "Deixe sua thumb mais leve sem perder qualidade.", icon: FileBarChart, href: "/avantisdark/compactar-thumb", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", borderhover: "hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)]" },
        ]
    }
];

export default function DarkDashboard() {
    const [stats, setStats] = useState({ roteiros: 0, transcricoes: 0, thumbs_baixadas: 0, thumbs_comprimidas: 0 });

    useEffect(() => {
        const roteiros = JSON.parse(localStorage.getItem('roteiro_historico') || '[]');
        const transcricoes = JSON.parse(localStorage.getItem('transcricoes_historico') || '[]');
        const thumbs_baixadas = JSON.parse(localStorage.getItem('thumbs_baixadas_historico') || '[]');
        const thumbs_comprimidas = JSON.parse(localStorage.getItem('thumbs_comprimidas_historico') || '[]');
        setStats({ roteiros: roteiros.length, transcricoes: transcricoes.length, thumbs_baixadas: thumbs_baixadas.length, thumbs_comprimidas: thumbs_comprimidas.length });
    }, []);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Hero Banner */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 glass-panel p-8 md:p-12">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/50 mb-6">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>Bem-vindo à nova era da criação</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gradient">
                        Escale sua produtividade criativa
                    </h1>
                    <p className="text-white/50 text-lg mb-8 leading-relaxed">
                        Seu estúdio inteligente. Utilize fluxos de inteligência artificial para dominar o YouTube, desde o roteiro até a conversão.
                    </p>
                    <div className="flex gap-4">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" asChild>
                            <Link to="/avantisdark/roteiro">
                                Começar Roteiro <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white" asChild>
                            <Link to="/avantisdark/transcricao">Transcrever Mídia</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: "Roteiros Magnéticos", value: stats.roteiros, desc: "Processados" },
                    { label: "Áudios Transcritos", value: stats.transcricoes, desc: "Horas salvas" },
                    { label: "Thumbs Capturadas", value: stats.thumbs_baixadas, desc: "Downloads" },
                    { label: "Imagens Otimizadas", value: stats.thumbs_comprimidas, desc: "Mbs economizados" },
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/5 shadow-sm">
                        <span className="text-white/50 text-sm font-medium mb-2">{stat.label}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-white">{stat.value}</span>
                            <span className="text-xs text-white/40">{stat.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tools grid */}
            <div className="space-y-16">
                {toolCategories.map((cat, idx) => (
                    <section key={idx} className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white">{cat.name}</h2>
                            <p className="text-white/50">{cat.description}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {cat.tools.map((tool) => (
                                <Link key={tool.title} to={tool.href} className="group block h-full">
                                    <div className={`relative flex flex-col h-full p-6 bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 ${tool.borderhover} hover:-translate-y-1 overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${tool.bg} ring-1 ring-inset ring-white/10`}>
                                            <tool.icon className={`w-6 h-6 ${tool.color}`} />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-white/90 transition-colors">{tool.title}</h3>
                                        <p className="text-sm text-white/50 leading-relaxed flex-1">{tool.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
