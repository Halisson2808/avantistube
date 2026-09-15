/**
 * AnalyticsDashboard.tsx — visão geral do tráfego dos sites e ofertas.
 * Números vindos de /api/analytics/overview (eventos do pixel no Supabase).
 */
import { useNavigate } from "react-router-dom";
import {
    Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
    Eye, MousePointerClick, Users, ShoppingCart, DollarSign, Filter,
    Globe, Megaphone, FileText, Smartphone, Plus, ScrollText, PlayCircle,
    Clock, LogOut, Activity,
} from "lucide-react";

import { useAnalyticsOverview, useAnalyticsFunnel } from "@/hooks/use-analytics";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import {
    AnalyticsHeader, MetricCard, Panel, RankedList, EmptyState, MilestoneBars,
    useAnalyticsFilters, rotasDoOverview, fmtNum, fmtMoney, fmtPct, fmtDuration,
} from "@/components/analytics/AnalyticsShell";

export default function AnalyticsDashboard() {
    const navigate = useNavigate();
    const {
        siteKey, setSiteKey, days, setDays, from, to, setFrom, setTo,
        paths, setPaths, hideTests, setHideTests, range, sites, sitesLoading,
    } = useAnalyticsFilters({ startAt24Hours: true });
    const { data, isLoading, reload } = useAnalyticsOverview(siteKey, range);
    // O mesmo funil da tela dedicada, resumido aqui para ver de relance.
    const { steps: funil } = useAnalyticsFunnel(siteKey, range);

    const t = data?.totals;
    const semSites = !sitesLoading && sites.length === 0;
    const porHora = data?.range?.granularity === "hour";
    // Na janela de 24h, marca onde começa o dia de hoje e diferencia as horas de ontem.
    const serie = data?.timeseries || [];
    const hojeDia = data?.range?.to;
    const viradaDoDia = porHora
        ? serie.find((p, i) => i > 0 && p.day === hojeDia && serie[i - 1].day !== hojeDia)?.label
        : undefined;
    const rotuloTooltip = (label: string) => {
        if (!porHora) return label;
        const ponto = serie.find((p) => p.label === label);
        return ponto?.day && ponto.day !== hojeDia ? `ontem, ${label}` : `hoje, ${label}`;
    };
    const periodoLabel = porHora
        ? data?.range?.custom
            ? `Evolução — ${data.range.from}, hora a hora`
            : "Evolução — últimas 24h, hora a hora"
        : data?.range?.custom
            ? `Evolução — ${data.range.from} até ${data.range.to}`
            : `Evolução — últimos ${days} dias`;

    return (
        <div className="space-y-6 pb-10">
            <AnalyticsHeader
                title="Sites & Tráfego"
                subtitle="Visitas, origens, comportamento e conversões dos seus sites"
                sites={sites}
                siteKey={siteKey}
                onSiteChange={setSiteKey}
                days={days}
                onDaysChange={setDays}
                from={from}
                to={to}
                onFromChange={setFrom}
                onToChange={setTo}
                routeOptions={rotasDoOverview(data)}
                selectedPaths={paths}
                onPathsChange={setPaths}
                onRefresh={reload}
                loading={isLoading}
                testsToggle={{
                    value: hideTests,
                    onChange: setHideTests,
                    hiddenCount: data?.hiddenTestSessions,
                }}
                actions={
                    <button
                        onClick={() => navigate("/analytics/sites")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-200 hover:bg-emerald-500/25 transition-colors text-xs"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Novo site
                    </button>
                }
            />

            {semSites ? (
                <EmptyState
                    title="Nenhum site cadastrado ainda"
                    description="Cadastre um site ou página de oferta para receber a chave do pixel e começar a registrar visitas, cliques e vendas."
                >
                    <button
                        onClick={() => navigate("/analytics/sites")}
                        className="mt-2 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-200 hover:bg-emerald-500/25 transition-colors text-xs"
                    >
                        Cadastrar primeiro site
                    </button>
                </EmptyState>
            ) : (
                <>
                    {/* Métricas principais */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <MetricCard icon={Eye} label="Visitas" value={fmtNum(t?.pageviews ?? 0)} loading={isLoading} />
                        <MetricCard icon={Users} label="Visitantes" value={fmtNum(t?.visitors ?? 0)} loading={isLoading} />
                        <MetricCard icon={MousePointerClick} label="Cliques" value={fmtNum(t?.clicks ?? 0)}
                            hint={t ? `${fmtPct(t.clickRate)} das visitas` : undefined} loading={isLoading} accent="text-sky-400" />
                        <MetricCard icon={Filter} label="Leads" value={fmtNum(t?.leads ?? 0)} loading={isLoading} accent="text-amber-400" />
                        <MetricCard icon={ShoppingCart} label="Vendas" value={fmtNum(t?.purchases ?? 0)}
                            hint={t ? `${fmtPct(t.conversionRate)} por sessão` : undefined} loading={isLoading} accent="text-violet-400" />
                        <MetricCard icon={DollarSign} label="Receita" value={fmtMoney(t?.revenue ?? 0)} loading={isLoading} />
                    </div>

                    {/* Funil — o mesmo de /analytics/funil */}
                    {funil.some((e) => e.sessions > 0) && (
                        <Panel
                            title="Funil de conversão"
                            icon={Filter}
                            right={
                                <button
                                    onClick={() => navigate("/analytics/funil")}
                                    className="text-[11px] text-white/35 hover:text-white transition-colors"
                                >
                                    Abrir funil →
                                </button>
                            }
                        >
                            <FunnelChart steps={funil} />
                        </Panel>
                    )}

                    {/* Série temporal */}
                    {/* Engajamento — só faz sentido com o pixel novo instalado */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <MetricCard icon={Clock} label="Tempo médio" value={fmtDuration(t?.avgSeconds ?? 0)}
                            hint="por visita encerrada" loading={isLoading} accent="text-sky-400" />
                        <MetricCard icon={ScrollText} label="Rolagem média" value={`${Math.round(t?.avgScroll ?? 0)}%`}
                            hint="da página" loading={isLoading} accent="text-emerald-400" />
                        <MetricCard icon={LogOut} label="Intenção de saída" value={fmtNum(t?.exitIntents ?? 0)}
                            hint="mouse saiu da janela" loading={isLoading} accent="text-amber-400" />
                        <MetricCard icon={Activity} label="Eventos" value={fmtNum(t?.events ?? 0)}
                            hint="no período" loading={isLoading} accent="text-violet-400" />
                    </div>

                    <Panel title={periodoLabel} icon={Eye}>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.timeseries || []}>
                                    <defs>
                                        <linearGradient id="gPv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                                            <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gCk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                                        interval={porHora ? 1 : 0}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
                                    {viradaDoDia && (
                                        <ReferenceLine
                                            x={viradaDoDia}
                                            stroke="rgba(255,255,255,0.25)"
                                            strokeDasharray="4 4"
                                            label={{ value: "hoje", position: "insideTopLeft", fill: "rgba(255,255,255,0.45)", fontSize: 10 }}
                                        />
                                    )}
                                    <Tooltip
                                        labelFormatter={(l: string) => rotuloTooltip(l)}
                                        // Hora que ainda não chegou vem null: mostra "—" em vez de vazio.
                                        formatter={(v: number | null) => (v === null ? "—" : v)}
                                        contentStyle={{
                                            background: "rgba(10,10,14,0.95)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: 10,
                                            fontSize: 12,
                                            color: "#fff",
                                        }}
                                    />
                                    <Area type="monotone" dataKey="pageviews" name="Visitas" stroke="#34d399" fill="url(#gPv)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="clicks" name="Cliques" stroke="#38bdf8" fill="url(#gCk)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Panel>

                    {/* Rankings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <Panel title="Origens de tráfego" icon={Globe}>
                            <RankedList items={data?.sources || []} emptyLabel="Sem visitas registradas no período." />
                        </Panel>
                        <Panel title="Campanhas (UTM)" icon={Megaphone}>
                            <RankedList items={data?.campaigns || []} emptyLabel="Nenhuma campanha marcada com UTM ainda." />
                        </Panel>
                        <Panel title="Páginas mais vistas" icon={FileText}>
                            <RankedList items={data?.pages || []} unit="visitas" />
                        </Panel>
                        <Panel title="Botões e links mais clicados" icon={MousePointerClick}>
                            <RankedList items={data?.topClicks || []} unit="cliques" emptyLabel="Nenhum clique rastreado ainda." />
                        </Panel>
                        <Panel title="Rolagem da página" icon={ScrollText}>
                            <MilestoneBars
                                items={data?.scroll || []}
                                emptyLabel="Nenhum marco de rolagem ainda — o pixel envia rolagem_25, rolagem_50…"
                            />
                        </Panel>
                        <Panel title="Vídeo / VSL" icon={PlayCircle}>
                            <MilestoneBars
                                items={data?.video || []}
                                color="bg-violet-500"
                                emptyLabel="Nenhum vídeo rastreado ainda — o pixel liga sozinho em <video>."
                            />
                        </Panel>
                        <Panel title="Eventos personalizados" icon={Activity}>
                            <RankedList
                                items={data?.customEvents || []}
                                emptyLabel="Nada ainda. Use avantis.track('nome_do_evento') no site."
                            />
                        </Panel>
                        <Panel title="Aparelhos" icon={Smartphone}>
                            <RankedList items={data?.devices || []} />
                        </Panel>
                        {!siteKey && (
                            <Panel title="Por site" icon={Globe}>
                                <RankedList items={data?.sites || []} />
                            </Panel>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
