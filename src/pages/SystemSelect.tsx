import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { useBranding } from "@/lib/useBranding";
import tubeLogo from "@/assets/logo.png";
import darkLogo from "@/assets/avantis-dark-logo.png";
import studioLogo from "@/assets/avantis-studio-logo.png";

const SystemSelect = () => {
    const navigate = useNavigate();
    useBranding("studio");

    return (
        <div className="min-h-screen bg-[#060b18] flex flex-col items-center justify-center overflow-hidden relative">
            {/* Blue ambient blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-blue-700/20 blur-[140px] animate-pulse" />
                <div className="absolute -bottom-60 -right-60 w-[700px] h-[700px] rounded-full bg-blue-900/20 blur-[140px] animate-pulse" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[100px]" />
            </div>

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center">
                {/* Header — Avantis Studio */}
                <div className="text-center mb-16">
                    {/* Studio logo */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/30 ring-2 ring-blue-500/30">
                            <img src={studioLogo} alt="Avantis Studio" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300/80 mb-6 backdrop-blur-sm">
                        <Zap size={14} className="text-blue-400" />
                        Plataforma Unificada
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Avantis{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                            Studio
                        </span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-md mx-auto">
                        Escolha a plataforma que deseja acessar para continuar
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-6 w-full">
                    {/* Avantis Tube — fundo vermelho */}
                    <button
                        id="btn-avantis-tube"
                        onClick={() => navigate("/avantistube")}
                        className="group relative rounded-2xl p-[1px] cursor-pointer text-left transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] focus:outline-none"
                        style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.7), rgba(239,68,68,0.15))" }}
                    >
                        <div className="relative rounded-2xl bg-[#0b0f1a] p-8 h-full overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-red-600/10 blur-[60px] group-hover:bg-red-600/25 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="mb-6 w-16 h-16 rounded-xl overflow-hidden shadow-xl shadow-red-900/40">
                                    <img src={tubeLogo} alt="Avantis Tube" className="w-full h-full object-cover" />
                                </div>
                                <div className="mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                        Ativo
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Avantis Tube</h2>
                                <p className="text-white/45 text-sm leading-relaxed mb-8">
                                    Monitore canais do YouTube, analise métricas e acompanhe o desempenho dos seus vídeos em tempo real.
                                </p>
                                <div className="flex items-center gap-2 text-red-400 text-sm font-semibold group-hover:text-red-300 transition-colors">
                                    Acessar plataforma
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                                </div>
                            </div>
                        </div>
                    </button>

                    {/* Avantis Dark — fundo preto */}
                    <button
                        id="btn-avantis-dark"
                        onClick={() => navigate("/avantisdark")}
                        className="group relative rounded-2xl p-[1px] cursor-pointer text-left transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] focus:outline-none"
                        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))" }}
                    >
                        <div className="relative rounded-2xl bg-[#0b0f1a] p-8 h-full overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-[60px] group-hover:bg-white/10 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="mb-6 w-16 h-16 rounded-xl overflow-hidden shadow-xl ring-1 ring-white/10">
                                    <img src={darkLogo} alt="Avantis Dark" className="w-full h-full object-cover" />
                                </div>
                                <div className="mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/8 border border-white/15 text-white/60">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                                        Ativo
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Avantis Dark</h2>
                                <p className="text-white/45 text-sm leading-relaxed mb-8">
                                    Sistema completo de gestão, transcrições, fábrica de conteúdo e ferramentas avançadas de produção.
                                </p>
                                <div className="flex items-center gap-2 text-white/50 text-sm font-semibold group-hover:text-white transition-colors">
                                    Acessar plataforma
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                                </div>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-12 text-white/15 text-xs text-center">
                    Avantis Studio · {new Date().getFullYear()} · Todos os sistemas ativos
                </p>
            </div>
        </div>
    );
};

export default SystemSelect;
