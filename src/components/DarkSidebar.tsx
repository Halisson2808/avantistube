import { NavLink, useNavigate } from "react-router-dom";
import {
    FileText, Languages, PenTool, Home, Settings,
    AlignLeft, ClipboardEdit, X, Download, Minimize2, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import darkLogo from "@/assets/avantis-dark-logo.png";

const toolItems = [
    { title: "Dashboard", url: "/avantisdark", icon: Home },
    { title: "Quadro Branco", url: "/avantisdark/quadro-branco", icon: ClipboardEdit },
    { title: "Gerar Roteiro", url: "/avantisdark/roteiro", icon: PenTool },
    { title: "Traduzir Roteiros", url: "/avantisdark/traduzir-roteiros", icon: Languages },
    { title: "Tradução Simples", url: "/avantisdark/traducao", icon: Languages },
    { title: "Transcrever Vídeos", url: "/avantisdark/transcricao", icon: FileText },
    { title: "Gerador de SRT", url: "/avantisdark/gerador-srt", icon: FileText },
    { title: "Manipulação de Texto", url: "/avantisdark/manipulacao-texto", icon: AlignLeft },
    { title: "Baixar Thumb YouTube", url: "/avantisdark/baixar-thumb", icon: Download },
    { title: "Compactar Thumbnail", url: "/avantisdark/compactar-thumb", icon: Minimize2 },
];

const systemItems = [
    { title: "Configurações", url: "/avantisdark/configuracoes", icon: Settings },
];

interface DarkSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function DarkSidebar({ isOpen = true, onClose }: DarkSidebarProps) {
    const navigate = useNavigate();

    return (
        <div className={`
      fixed left-0 top-0 h-full w-64 z-50 flex flex-col
      bg-[rgba(15,15,18,0.95)] backdrop-blur-[12px] border-r border-white/5
      transition-transform duration-300 ease-in-out
      md:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
            {/* Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 shadow-lg">
                            <img src={darkLogo} alt="Avantis Dark" className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-white">
                                Avantis Dark
                            </h1>
                        </div>
                    </div>
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden h-8 w-8 text-white/50 hover:bg-white/5">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6" style={{ scrollbarWidth: 'thin' }}>
                {/* Ferramentas */}
                <div className="mb-8">
                    <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3 px-2">Ferramentas</h3>
                    <nav className="space-y-1">
                        {toolItems.map((item) => (
                            <NavLink
                                key={item.title}
                                to={item.url}
                                end={item.url === "/avantisdark"}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-white/10 text-white font-medium ring-1 ring-white/10 shadow-sm"
                                        : "text-white/50 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                                <span className="text-sm">{item.title}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Sistema */}
                <div className="mb-6">
                    <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3 px-2">Sistema</h3>
                    <nav className="space-y-1">
                        {systemItems.map((item) => (
                            <NavLink
                                key={item.title}
                                to={item.url}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-white/10 text-white font-medium ring-1 ring-white/10 shadow-sm"
                                        : "text-white/50 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                                <span className="text-sm">{item.title}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Rodapé fixo — Avantis Studio */}
            <div className="border-t border-white/5 p-3">
                <button
                    onClick={() => { onClose?.(); navigate("/"); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:bg-white/5 hover:text-white/80 transition-all duration-200 group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">Avantis Studio</span>
                </button>
            </div>
        </div>
    );
}
