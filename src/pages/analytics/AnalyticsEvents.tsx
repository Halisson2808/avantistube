/**
 * AnalyticsEvents.tsx — visitas recebidas pelo pixel.
 *
 * Cada linha é uma visita (sessão): quem entrou, por onde, e quantas coisas fez.
 * Os eventos soltos daquela pessoa só aparecem ao abrir a linha — antes, alguém
 * rolando a página enchia a tela de linhas repetidas.
 */
import { Fragment, useState } from "react";
import { Activity, ChevronDown, ChevronRight, FlaskConical } from "lucide-react";

import {
    useTrackingSessions, useAnalyticsOverview, type TrackingEvent, type TrackingSession,
} from "@/hooks/use-analytics";
import {
    AnalyticsHeader, EmptyState, useAnalyticsFilters, rotasDoOverview, fmtMoney,
} from "@/components/analytics/AnalyticsShell";

const TIPO_COR: Record<TrackingEvent["event_type"], string> = {
    pageview: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    click: "bg-sky-500/15 text-sky-300 border-sky-500/25",
    lead: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    purchase: "bg-violet-500/15 text-violet-300 border-violet-500/25",
    custom: "bg-white/[0.06] text-white/60 border-white/10",
};

const TIPOS: Array<TrackingEvent["event_type"] | "all"> = ["all", "pageview", "click", "lead", "purchase", "custom"];

const dataHora = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

const hora = (iso: string) =>
    new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export default function AnalyticsEvents() {
    const {
        siteKey, setSiteKey, days, setDays, from, to, setFrom, setTo,
        paths, setPaths, range, sites,
    } = useAnalyticsFilters();
    const { sessions, isLoading, reload } = useTrackingSessions(siteKey, range, 150);
    const { data: visaoGeral } = useAnalyticsOverview(siteKey, range);
    const [tipo, setTipo] = useState<TrackingEvent["event_type"] | "all">("all");
    const [aberta, setAberta] = useState<string | null>(null);

    // Chave do site -> nome do painel, para a linha dizer em qual site a pessoa entrou.
    const nomeDoSite = (key: string) => sites.find((x) => x.site_key === key)?.name || key;

    // O filtro de tipo mostra as visitas em que aquilo aconteceu ao menos uma vez.
    const lista = tipo === "all" ? sessions : sessions.filter((s) => (s.types[tipo] || 0) > 0);

    return (
        <div className="space-y-6 pb-10">
            <AnalyticsHeader
                title="Eventos ao Vivo"
                subtitle="Cada linha é uma visita — abra para ver tudo o que a pessoa fez"
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
                        {t === "all" ? "Todas" : t}
                    </button>
                ))}
                {!isLoading && (
                    <span className="ml-auto text-[11px] text-white/30">
                        {lista.length} visita(s)
                    </span>
                )}
            </div>

            {isLoading ? (
                <div className="space-y-1.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-12 rounded-lg bg-white/[0.04] animate-pulse" />
                    ))}
                </div>
            ) : lista.length === 0 ? (
                <EmptyState
                    title="Nenhuma visita no período"
                    description="Instale o pixel no site (aba Meus Sites) e acesse a página: em segundos a primeira visita aparece aqui."
                />
            ) : (
                <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-white/[0.03] text-white/40">
                                <tr>
                                    <Th />
                                    <Th>Última atividade</Th>
                                    <Th>Site</Th>
                                    <Th>Visitante</Th>
                                    <Th>Entrou por</Th>
                                    <Th>Origem</Th>
                                    <Th>Aparelho</Th>
                                    <Th>Eventos</Th>
                                    <Th>Valor</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((s) => (
                                    <Fragment key={s.id}>
                                        <LinhaVisita
                                            sessao={s}
                                            site={nomeDoSite(s.siteKey)}
                                            aberta={aberta === s.id}
                                            onToggle={() => setAberta(aberta === s.id ? null : s.id)}
                                        />
                                        {aberta === s.id && <DetalheVisita sessao={s} />}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function LinhaVisita({ sessao: s, site, aberta, onToggle }: {
    sessao: TrackingSession;
    site: string;
    aberta: boolean;
    onToggle: () => void;
}) {
    const outrasPaginas = s.paths.length - 1;
    return (
        <tr
            onClick={onToggle}
            className={`border-t border-white/[0.05] cursor-pointer transition-colors ${aberta ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
        >
            <Td className="w-6 text-white/40">
                {aberta ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </Td>
            <Td className="text-white/60 whitespace-nowrap">{dataHora(s.lastAt)}</Td>
            <Td className="text-white/80 max-w-[180px] truncate">{site}</Td>
            <Td className="whitespace-nowrap">
                <span className="font-mono text-white/70">{(s.visitorId || s.id).slice(-6)}</span>
                {s.isTest && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300/80 text-[9px]">
                        <FlaskConical className="h-2.5 w-2.5" /> teste
                    </span>
                )}
            </Td>
            <Td className="text-white/60 max-w-[200px] truncate">
                {s.entryPath}
                {outrasPaginas > 0 && <span className="text-white/30"> +{outrasPaginas} pág.</span>}
            </Td>
            <Td className="text-white/50 max-w-[160px] truncate">
                {s.source || "direto"}
                {s.campaign && <span className="text-white/30"> · {s.campaign}</span>}
            </Td>
            <Td className="text-white/40">{s.device || "—"}</Td>
            <Td>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.06] text-white/80 font-medium">
                    <Activity className="h-2.5 w-2.5 text-emerald-300" />
                    {s.eventCount}
                </span>
            </Td>
            <Td className={s.converted ? "text-violet-300 font-medium" : "text-white/40"}>
                {s.converted ? fmtMoney(s.value) : "—"}
            </Td>
        </tr>
    );
}

function DetalheVisita({ sessao: s }: { sessao: TrackingSession }) {
    return (
        <tr className="bg-black/20">
            <td colSpan={9} className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-1.5 mb-2 text-[10px] text-white/40">
                    <span>{dataHora(s.startedAt)} → {dataHora(s.lastAt)}</span>
                    <span>·</span>
                    {(Object.entries(s.types) as Array<[TrackingEvent["event_type"], number]>).map(([t, n]) => (
                        <span key={t} className={`px-1.5 py-0.5 rounded border ${TIPO_COR[t]}`}>
                            {t} {n}
                        </span>
                    ))}
                    {s.browser && <span>· {s.browser}{s.os ? ` / ${s.os}` : ""}</span>}
                </div>
                <div className="max-h-80 overflow-y-auto rounded-lg border border-white/[0.06]">
                    <table className="w-full text-[11px]">
                        <tbody>
                            {s.events.map((ev) => (
                                <tr key={ev.id} className="border-t border-white/[0.04] first:border-t-0">
                                    <td className="px-3 py-1.5 text-white/35 whitespace-nowrap font-mono">{hora(ev.created_at)}</td>
                                    <td className="px-3 py-1.5">
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] ${TIPO_COR[ev.event_type]}`}>
                                            {ev.event_name}
                                        </span>
                                    </td>
                                    <td className="px-3 py-1.5 text-white/50 max-w-[240px] truncate">{ev.path || "—"}</td>
                                    <td className="px-3 py-1.5 text-white/50 text-right">
                                        {ev.value ? fmtMoney(Number(ev.value)) : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </td>
        </tr>
    );
}

const Th = ({ children }: { children?: React.ReactNode }) => (
    <th className="text-left font-medium px-3 py-2 text-[10px] uppercase tracking-wider">{children}</th>
);

const Td = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
    <td className={`px-3 py-2 ${className}`}>{children}</td>
);
