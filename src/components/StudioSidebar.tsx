import { NavLink } from "react-router-dom";
import {
    FileText, Home,
    AlignLeft, ClipboardEdit, X, Download,
    Search, TrendingUp, ChevronDown, ChevronRight,
    ExternalLink, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMonitoredChannels } from "@/hooks/use-monitored-channels";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

const tubeItems = [
    { title: "Buscar Vídeos", url: "/studio/tube/buscar", icon: Search },
    { title: "Monitoramento", url: "/studio/tube/monitoramento", icon: TrendingUp },
    { title: "Exportar Dados", url: "/studio/tube/exportar", icon: Download },
];

const darkItems = [
    { title: "Quadro Branco", url: "/studio/dark/quadro-branco", icon: ClipboardEdit },
    { title: "Transcrever Vídeos", url: "/studio/dark/transcricao", icon: FileText },
    { title: "Gerador de SRT", url: "/studio/dark/gerador-srt", icon: FileText },
    { title: "Manipulação de Texto", url: "/studio/dark/manipulacao-texto", icon: AlignLeft },
    { title: "Thumbnails", url: "/studio/dark/thumbnails", icon: Download },
];

interface StudioSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

function SectionLabel({
    label,
    dot,
    expanded,
    onToggle,
}: {
    label: string;
    dot: string;
    expanded: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] group mb-1"
        >
            <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-white/80 transition-colors">
                    {label}
                </span>
            </div>
            {expanded
                ? <ChevronDown className="h-2.5 w-2.5 text-white/50" />
                : <ChevronRight className="h-2.5 w-2.5 text-white/50" />}
        </button>
    );
}

export function StudioSidebar({ isOpen = true, onClose }: StudioSidebarProps) {
    const [tubeOpen, setTubeOpen] = useState(true);
    const [darkOpen, setDarkOpen] = useState(true);
    const [channelsOpen, setChannelsOpen] = useState(true);
    const { channels } = useMonitoredChannels();
    const { signOut } = useAuth();

    const sortedChannels = [...channels].sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-200 group text-xs ${isActive
            ? "bg-red-500/15 text-white font-medium ring-1 ring-red-500/25"
            : "text-white hover:bg-white/6"
        }`;

    return (
        <div className={`
            fixed left-0 top-0 h-full w-64 z-50 flex flex-col
            bg-[rgba(10,10,14,0.98)] backdrop-blur-[14px] border-r border-white/5
            transition-transform duration-300 ease-in-out
            md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* studiologo.png — garra branca com fundo vermelho */}
                    <div className="h-10 w-10 rounded-xl overflow-hidden flex-shrink-0 bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/30">
                        <img
                            src="/studiologo.png"
                            alt="Avantis Studio"
                            className="h-7 w-7 object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight text-white leading-none">Avantis</h1>
                        <span className="text-xs font-semibold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
                            Studio
                        </span>
                    </div>
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="md:hidden h-7 w-7 text-white hover:bg-white/5"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Nav */}
            <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-3">

                    {/* Home */}
                    <NavLink
                        to="/"
                        end
                        onClick={onClose}
                        className={linkClass}
                    >
                        <Home className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Início</span>
                    </NavLink>

                    {/* TUBE — container só no label */}
                    <div>
                        <SectionLabel
                            label="Tube"
                            dot="bg-red-500"
                            expanded={tubeOpen}
                            onToggle={() => setTubeOpen(v => !v)}
                        />
                        {tubeOpen && (
                            <nav className="space-y-0.5">
                                {tubeItems.map((item) => (
                                    <NavLink
                                        key={item.url}
                                        to={item.url}
                                        end={item.url === "/studio/tube"}
                                        onClick={onClose}
                                        className={linkClass}
                                    >
                                        <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>{item.title}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        )}
                    </div>

                    {/* DARK — container só no label */}
                    <div>
                        <SectionLabel
                            label="Dark"
                            dot="bg-white/50"
                            expanded={darkOpen}
                            onToggle={() => setDarkOpen(v => !v)}
                        />
                        {darkOpen && (
                            <nav className="space-y-0.5">
                                {darkItems.map((item) => (
                                    <NavLink
                                        key={item.url}
                                        to={item.url}
                                        end={item.url === "/studio/dark"}
                                        onClick={onClose}
                                        className={linkClass}
                                    >
                                        <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>{item.title}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        )}
                    </div>

                    {/* CANAIS */}
                    {channels.length > 0 && (
                        <div>
                            <SectionLabel
                                label={`Canais (${channels.length})`}
                                dot="bg-red-400"
                                expanded={channelsOpen}
                                onToggle={() => setChannelsOpen(v => !v)}
                            />
                            {channelsOpen && (
                                <div className="max-h-52 overflow-y-auto space-y-0.5 scrollbar-hidden">
                                    {sortedChannels.slice(0, 15).map((channel) => (
                                        <a
                                            key={channel.channelId}
                                            href={`https://youtube.com/channel/${channel.channelId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white hover:bg-white/6 transition-colors group cursor-pointer"
                                        >
                                            {channel.channelThumbnail ? (
                                                <img
                                                    src={channel.channelThumbnail}
                                                    alt={channel.channelTitle}
                                                    className="w-5 h-5 rounded-full flex-shrink-0"
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-white/10 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-white truncate leading-none">
                                                    {channel.channelTitle}
                                                </p>
                                                {channel.niche && (
                                                    <p className="text-[9px] text-white/40 truncate mt-0.5">{channel.niche}</p>
                                                )}
                                            </div>
                                            <ExternalLink className="w-2.5 h-2.5 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Footer — sair */}
            <div className="p-3 border-t border-white/5">
                <button
                    onClick={() => { onClose?.(); signOut(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/6 transition-all duration-200"
                >
                    <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs font-medium">Sair</span>
                </button>
            </div>
        </div>
    );
}
