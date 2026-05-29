import { useNavigate } from "react-router-dom";
import {
    TrendingUp, FileText, Download,
    AlignLeft, ClipboardEdit, Search, Zap, Users, Eye,
    Video, ExternalLink, Image,
} from "lucide-react";
import { useMonitoredChannels } from "@/hooks/use-monitored-channels";

function fmt(n: number): string {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return n.toString();
}

const quickTools = [
    { title: "Monitoramento", url: "/studio/tube/monitoramento", icon: TrendingUp },
    { title: "Buscar Vídeos", url: "/studio/tube/buscar", icon: Search },
    { title: "Exportar Dados", url: "/studio/tube/exportar", icon: Download },
    { title: "Transcrever", url: "/studio/dark/transcricao", icon: FileText },
    { title: "Gerador SRT", url: "/studio/dark/gerador-srt", icon: FileText },
    { title: "Quadro Branco", url: "/studio/dark/quadro-branco", icon: ClipboardEdit },
    { title: "Manipular Texto", url: "/studio/dark/manipulacao-texto", icon: AlignLeft },
    { title: "Thumbnails", url: "/studio/dark/thumbnails", icon: Image },
];

export default function StudioDashboard() {
    const navigate = useNavigate();
    const { channels, isLoading } = useMonitoredChannels();

    const totalSubs = channels.reduce((s, c) => s + c.currentSubscribers, 0);
    const totalViews = channels.reduce((s, c) => s + c.currentViews, 0);
    const totalVideos = channels.reduce((s, c) => s + c.currentVideos, 0);

    const exploding = channels.filter(c => c.isExploding);
    const recent = [...channels]
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        .slice(0, 6);
    const topBySubs = [...channels]
        .sort((a, b) => b.currentSubscribers - a.currentSubscribers)
        .slice(0, 6);

    return (
        <div className="space-y-8 pb-10">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-xl shadow-red-900/30 flex-shrink-0">
                    <img src="/studiologo.png" alt="Studio" className="w-9 h-9 object-contain" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Avantis <span className="bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">Studio</span>
                    </h1>
                    <p className="text-white/40 text-xs mt-0.5">Plataforma unificada · Tube + Dark</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={Users} label="Canais" value={channels.length} loading={isLoading} />
                <StatCard icon={Users} label="Inscritos" value={fmt(totalSubs)} loading={isLoading} />
                <StatCard icon={Eye} label="Visualizações" value={fmt(totalViews)} loading={isLoading} />
                <StatCard icon={Video} label="Vídeos" value={fmt(totalVideos)} loading={isLoading} />
            </div>

            {/* Em explosão */}
            {exploding.length > 0 && (
                <Section title="Em Explosão" icon={Zap} accent="text-red-400" count={exploding.length}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {exploding.slice(0, 6).map(c => (
                            <ChannelCard key={c.channelId} channel={c} badge={
                                c.subscribersLast7Days && c.subscribersLast7Days > 0
                                    ? `+${fmt(c.subscribersLast7Days)} inscritos/7d`
                                    : "em explosão"
                            } />
                        ))}
                    </div>
                </Section>
            )}

            {/* Adicionados recentemente */}
            {recent.length > 0 && (
                <Section title="Adicionados Recentemente" icon={TrendingUp} onMore={() => navigate("/studio/tube/monitoramento")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {recent.map(c => <ChannelCard key={c.channelId} channel={c} />)}
                    </div>
                </Section>
            )}

            {/* Top canais */}
            {topBySubs.length > 0 && (
                <Section title="Top Canais por Inscritos" icon={Users} onMore={() => navigate("/studio/tube/monitoramento")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {topBySubs.map((c, i) => <ChannelCard key={c.channelId} channel={c} rank={i + 1} />)}
                    </div>
                </Section>
            )}

            {/* Acesso rápido */}
            <Section title="Acesso Rápido" icon={Zap}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {quickTools.map(tool => (
                        <button
                            key={tool.url}
                            onClick={() => navigate(tool.url)}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-red-500/8 hover:border-red-500/20 transition-all duration-200 group"
                        >
                            <tool.icon className="h-5 w-5 text-red-400 group-hover:scale-110 transition-transform" />
                            <span className="text-white text-[11px] font-medium text-center leading-tight">{tool.title}</span>
                        </button>
                    ))}
                </div>
            </Section>
        </div>
    );
}

/* ── Sub-components ── */

function StatCard({ icon: Icon, label, value, loading }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    loading?: boolean;
}) {
    return (
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/40">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[11px]">{label}</span>
            </div>
            {loading
                ? <div className="h-6 w-16 rounded bg-white/10 animate-pulse" />
                : <p className="text-white font-bold text-xl leading-none">{value}</p>
            }
        </div>
    );
}

function Section({ title, icon: Icon, accent = "text-white/60", count, onMore, children }: {
    title: string;
    icon: React.ElementType;
    accent?: string;
    count?: number;
    onMore?: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${accent}`} />
                    <h2 className="text-white font-semibold text-sm">{title}</h2>
                    {count !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-md bg-red-500/15 border border-red-500/25 text-red-300 text-[10px] font-bold">{count}</span>
                    )}
                </div>
                {onMore && (
                    <button onClick={onMore} className="text-[11px] text-white/35 hover:text-white transition-colors">
                        Ver todos →
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}

function ChannelCard({ channel, badge, rank }: {
    channel: ReturnType<typeof useMonitoredChannels>["channels"][number];
    badge?: string;
    rank?: number;
}) {
    return (
        <a
            href={`https://youtube.com/channel/${channel.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200 group"
        >
            {rank && (
                <span className="text-[11px] font-bold text-white/25 w-4 flex-shrink-0 text-center">{rank}</span>
            )}
            {channel.channelThumbnail ? (
                <img
                    src={channel.channelThumbnail}
                    alt={channel.channelTitle}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    referrerPolicy="no-referrer"
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate leading-none">{channel.channelTitle}</p>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-white/40 text-[10px]">{fmt(channel.currentSubscribers)} inscritos</span>
                    {channel.niche && (
                        <span className="text-white/25 text-[10px]">· {channel.niche}</span>
                    )}
                </div>
                {badge && (
                    <span className="inline-block mt-1 text-[9px] font-semibold text-red-300 bg-red-500/15 px-1.5 py-0.5 rounded">
                        {badge}
                    </span>
                )}
            </div>
            <ExternalLink className="h-3 w-3 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </a>
    );
}
