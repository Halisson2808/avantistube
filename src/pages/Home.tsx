/**
 * Home.tsx — porta de entrada do Avantis Studio: escolhe o módulo de trabalho.
 *   /youtube   → dados dos canais (busca, monitoramento, meus canais…)
 *   /analytics → cliques e funil dos sites e ofertas
 */
import { useNavigate } from "react-router-dom";
import { Youtube, BarChart3, FileText, ArrowRight, Users, Eye, MousePointerClick, ShoppingCart, BookOpen } from "lucide-react";

import { useMonitoredChannels } from "@/hooks/use-monitored-channels";
import { useAnalyticsOverview } from "@/hooks/use-analytics";

/** O cartão do hub mostra sempre a última semana. */
const SETE_DIAS = { days: 7 };
import { fmtNum, fmtMoney } from "@/components/analytics/AnalyticsShell";

export default function Home() {
    const navigate = useNavigate();
    const { channels } = useMonitoredChannels();
    const { data } = useAnalyticsOverview(null, SETE_DIAS);

    const totalSubs = channels.reduce((s, c) => s + c.currentSubscribers, 0);
    const t = data?.totals;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-xl shadow-red-900/30 flex-shrink-0">
                    <img src="/studiologo.png" alt="Studio" className="w-9 h-9 object-contain" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Avantis <span className="bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">Studio</span>
                    </h1>
                    <p className="text-white/40 text-xs mt-0.5">Canais de YouTube e tráfego dos sites no mesmo lugar</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ModuleCard
                    title="YouTube"
                    description="Busca de vídeos, monitoramento de canais, meus canais, exportação e thumbnails."
                    icon={Youtube}
                    accent="red"
                    onClick={() => navigate("/youtube")}
                    stats={[
                        { icon: Users, label: "Canais", value: String(channels.length) },
                        { icon: Users, label: "Inscritos", value: fmtNum(totalSubs) },
                    ]}
                />
                <ModuleCard
                    title="Sites & Tráfego"
                    description="Rastreio de cliques, origem dos anúncios (UTM), funil de conversão e receita das ofertas."
                    icon={BarChart3}
                    accent="emerald"
                    onClick={() => navigate("/analytics")}
                    stats={[
                        { icon: Eye, label: "Visitas 7d", value: fmtNum(t?.pageviews ?? 0) },
                        { icon: MousePointerClick, label: "Cliques 7d", value: fmtNum(t?.clicks ?? 0) },
                        { icon: ShoppingCart, label: "Receita 7d", value: fmtMoney(t?.revenue ?? 0) },
                    ]}
                />
                <ModuleCard
                    title="Gerador de PDF"
                    description="Ebooks e order bumps prontos para impressão — abre o layout A4 e baixa o PDF pelo navegador."
                    icon={FileText}
                    accent="amber"
                    onClick={() => navigate("/pdf")}
                    stats={[{ icon: BookOpen, label: "Ebooks", value: "30" }]}
                />
            </div>
        </div>
    );
}

function ModuleCard({ title, description, icon: Icon, accent, onClick, stats }: {
    title: string;
    description: string;
    icon: React.ElementType;
    accent: "red" | "emerald" | "amber";
    onClick: () => void;
    stats: Array<{ icon: React.ElementType; label: string; value: string }>;
}) {
    const TONES = {
        red: { ring: "hover:border-red-500/25", bg: "bg-red-500/12 border-red-500/20", text: "text-red-300", glow: "bg-red-500/8" },
        emerald: { ring: "hover:border-emerald-500/25", bg: "bg-emerald-500/12 border-emerald-500/20", text: "text-emerald-300", glow: "bg-emerald-500/8" },
        amber: { ring: "hover:border-amber-500/25", bg: "bg-amber-500/12 border-amber-500/20", text: "text-amber-300", glow: "bg-amber-500/8" },
    } as const;
    const tone = TONES[accent];

    return (
        <button
            onClick={onClick}
            className={`relative text-left rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5 transition-all duration-200 group overflow-hidden ${tone.ring}`}
        >
            <div className={`absolute -top-16 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none ${tone.glow}`} />

            <div className="relative flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${tone.bg}`}>
                    <Icon className={`h-5 w-5 ${tone.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-white font-semibold text-base">{title}</h2>
                        <ArrowRight className="h-3.5 w-3.5 text-white/25 group-hover:translate-x-0.5 group-hover:text-white/60 transition-all" />
                    </div>
                    <p className="text-white/40 text-xs mt-1 leading-relaxed">{description}</p>
                </div>
            </div>

            <div className="relative flex flex-wrap gap-2 mt-4">
                {stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                        <s.icon className="h-3 w-3 text-white/35" />
                        <span className="text-white/40 text-[10px]">{s.label}</span>
                        <span className="text-white text-[11px] font-semibold">{s.value}</span>
                    </div>
                ))}
            </div>
        </button>
    );
}
