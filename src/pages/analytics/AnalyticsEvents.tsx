/**
 * AnalyticsEvents.tsx — lista dos últimos eventos recebidos pelo pixel.
 */
import { useState } from "react";
import { Activity } from "lucide-react";

import { useTrackingEvents, useAnalyticsOverview, type TrackingEvent } from "@/hooks/use-analytics";
import { AnalyticsHeader, EmptyState, useAnalyticsFilters, rotasDoOverview, fmtMoney } from "@/components/analytics/AnalyticsShell";

const TIPO_COR: Record<TrackingEvent["event_type"], string> = {
    pageview: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    click: "bg-sky-500/15 text-sky-300 border-sky-500/25",
    lead: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    purchase: "bg-violet-500/15 text-violet-300 border-violet-500/25",
    custom: "bg-white/[0.06] text-white/60 border-white/10",
};

const TIPOS: Array<TrackingEvent["event_type"] | "all"> = ["all", "pageview", "click", "lead", "purchase", "custom"];

export default function AnalyticsEvents() {
    const {
        siteKey, setSiteKey, days, setDays, from, to, setFrom, setTo,
        paths, setPaths, range, sites,
    } = useAnalyticsFilters();
    const { events, isLoading, reload } = useTrackingEvents(siteKey, range, 200);
    const { data: visaoGeral } = useAnalyticsOverview(siteKey, range);
    const [tipo, setTipo] = useState<TrackingEvent["event_type"] | "all">("all");

    const lista = tipo === "all" ? events : events.filter((e) => e.event_type === tipo);

    return (
        <div className="space-y-6 pb-10">
            <AnalyticsHeader
                title="Eventos ao Vivo"
                subtitle="Os 200 eventos mais recentes recebidos do pixel"
                sites={sites}
                siteKey={siteKey}
                onSiteChange={setSiteKey}
                days={days}
                onDaysChange={setDays}
                from={from}
                to={to}
                onFromChange={setFrom}
                onToChange={setTo}
                routeOptions={rotasDoOverview(visaoGeral)}
                selectedPaths={paths}
                onPathsChange={setPaths}
                onRefresh={reload}
                loading={isLoading}
            />

            <div className="flex flex-wrap items-center gap-1.5">
                {TIPOS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTipo(t)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${tipo === t
                            ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-200"
                            : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:text-white"
                            }`}
                    >
                        {t === "all" ? "Todos" : t}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="space-y-1.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-12 rounded-lg bg-white/[0.04] animate-pulse" />
                    ))}
                </div>
            ) : lista.length === 0 ? (
                <EmptyState
                    title="Nenhum evento recebido"
                    description="Instale o pixel no site (aba Meus Sites) e acesse a página: em segundos o primeiro evento aparece aqui."
                />
            ) : (
                <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-white/[0.03] text-white/40">
                                <tr>
                                    <Th>Quando</Th>
                                    <Th>Evento</Th>
                                    <Th>Site</Th>
                                    <Th>Página</Th>
                                    <Th>Origem</Th>
                                    <Th>Campanha</Th>
                                    <Th>Aparelho</Th>
                                    <Th>Valor</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((ev) => (
                                    <tr key={ev.id} className="border-t border-white/[0.05] hover:bg-white/[0.02]">
                                        <Td className="text-white/40 whitespace-nowrap">
                                            {new Date(ev.created_at).toLocaleString("pt-BR", {
                                                day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                                            })}
                                        </Td>
                                        <Td>
                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] ${TIPO_COR[ev.event_type]}`}>
                                                <Activity className="h-2.5 w-2.5" />
                                                {ev.event_name}
                                            </span>
                                        </Td>
                                        <Td className="text-white/50">{ev.site_key}</Td>
                                        <Td className="text-white/60 max-w-[180px] truncate">{ev.path || "—"}</Td>
                                        <Td className="text-white/50">
                                            {ev.utm_source || ev.referrer_host || "direto"}
                                            {ev.ad_network && (
                                                <span className="ml-1 text-[9px] text-sky-300/80">({ev.ad_network})</span>
                                            )}
                                        </Td>
                                        <Td className="text-white/50 max-w-[140px] truncate">{ev.utm_campaign || "—"}</Td>
                                        <Td className="text-white/40">{ev.device || "—"}</Td>
                                        <Td className="text-white/60">{ev.value ? fmtMoney(Number(ev.value)) : "—"}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

const Th = ({ children }: { children: React.ReactNode }) => (
    <th className="text-left font-medium px-3 py-2 text-[10px] uppercase tracking-wider">{children}</th>
);

const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <td className={`px-3 py-2 ${className}`}>{children}</td>
);
