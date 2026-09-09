/**
 * AnalyticsFunnel.tsx — funil de conversão por site, com etapas configuráveis.
 */
import { useEffect, useState } from "react";
import { Filter, Plus, Save, Trash2, TrendingDown } from "lucide-react";

import { useAnalyticsFunnel, useAnalyticsOverview } from "@/hooks/use-analytics";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import {
    AnalyticsHeader, Panel, EmptyState, useAnalyticsFilters, fmtNum, fmtMoney,
} from "@/components/analytics/AnalyticsShell";

/** Mesmo funil padrão do backend: entrou → leu → clicou no checkout → comprou. */
const PADRAO = [
    { label: "Entrou", eventName: "pageview" },
    { label: "Rolou a página", eventName: "rolagem_50" },
    { label: "Foi pro checkout", eventName: "click" },
    { label: "Comprou", eventName: "purchase" },
];

/** Sugestões de etapa para montar o funil de uma página de vendas. */
const SUGESTOES = [
    "pageview", "rolagem_25", "rolagem_50", "rolagem_75", "rolagem_90",
    "tempo_30s", "tempo_60s", "tempo_180s",
    "video_play", "video_25", "video_50", "video_75", "video_completo",
    "saida_intencao", "cta_topo", "cta_meio", "cta_final", "lead", "purchase",
];

export default function AnalyticsFunnel() {
    const {
        siteKey, setSiteKey, days, setDays, from, to, setFrom, setTo,
        paths, setPaths, range, sites,
    } = useAnalyticsFilters();
    const { steps, isLoading, reload, saveSteps } = useAnalyticsFunnel(siteKey, range);
    // Só para saber quais rotas existem no período e alimentar o filtro.
    const { data: visaoGeral } = useAnalyticsOverview(siteKey, range);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(PADRAO);

    useEffect(() => {
        if (steps.length) {
            setDraft(steps.map((s) => ({ label: s.label, eventName: s.eventName })));
        }
    }, [steps]);

    const topo = steps[0]?.sessions || 0;
    const receita = steps.reduce((s, e) => s + e.value, 0);

    return (
        <div className="space-y-6 pb-10">
            <AnalyticsHeader
                title="Funil de Conversão"
                subtitle="Quanto do tráfego avança de uma etapa para a outra"
                sites={sites}
                siteKey={siteKey}
                onSiteChange={setSiteKey}
                days={days}
                onDaysChange={setDays}
                from={from}
                to={to}
                onFromChange={setFrom}
                onToChange={setTo}
                routeOptions={visaoGeral?.paths}
                selectedPaths={paths}
                onPathsChange={setPaths}
                onRefresh={reload}
                loading={isLoading}
                actions={
                    siteKey ? (
                        <button
                            onClick={() => setEditing((v) => !v)}
                            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white text-xs transition-colors"
                        >
                            {editing ? "Fechar edição" : "Editar etapas"}
                        </button>
                    ) : null
                }
            />

            {!siteKey && (
                <p className="text-white/35 text-[11px]">
                    Dica: escolha um site específico acima para configurar etapas próprias do funil.
                </p>
            )}

            {editing && siteKey && (
                <Panel title="Etapas do funil" icon={Filter}>
                    <datalist id="eventos-sugeridos">
                        {SUGESTOES.map((nome) => <option key={nome} value={nome} />)}
                    </datalist>
                    <div className="space-y-2">
                        {draft.map((step, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="text-white/25 text-[11px] w-4 text-center">{i + 1}</span>
                                <input
                                    value={step.label}
                                    onChange={(e) => setDraft(d => d.map((s, j) => j === i ? { ...s, label: e.target.value } : s))}
                                    placeholder="Nome da etapa"
                                    className="h-8 flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs px-3 outline-none focus:border-emerald-500/40"
                                />
                                <input
                                    value={step.eventName}
                                    onChange={(e) => setDraft(d => d.map((s, j) => j === i ? { ...s, eventName: e.target.value } : s))}
                                    placeholder="nome_do_evento"
                                    list="eventos-sugeridos"
                                    className="h-8 flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-emerald-200 text-xs px-3 outline-none focus:border-emerald-500/40 font-mono"
                                />
                                <button
                                    onClick={() => setDraft(d => d.filter((_, j) => j !== i))}
                                    className="p-2 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}

                        <div className="flex items-center gap-2 pt-1">
                            <button
                                onClick={() => setDraft(d => [...d, { label: `Etapa ${d.length + 1}`, eventName: "custom" }])}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white text-xs transition-colors"
                            >
                                <Plus className="h-3.5 w-3.5" /> Adicionar etapa
                            </button>
                            <button
                                onClick={async () => { await saveSteps(siteKey, draft); setEditing(false); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-200 hover:bg-emerald-500/25 text-xs transition-colors"
                            >
                                <Save className="h-3.5 w-3.5" /> Salvar funil
                            </button>
                        </div>
                        <p className="text-white/30 text-[10px] pt-1">
                            O “nome do evento” precisa ser igual ao que você envia no pixel:
                            <code className="text-emerald-300/80"> avantis.track("meu_evento")</code>.
                        </p>
                    </div>
                </Panel>
            )}

            {isLoading ? (
                <div className="space-y-2">
                    {[0, 1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />)}
                </div>
            ) : steps.every(s => s.events === 0) ? (
                <EmptyState
                    title="Sem eventos no período"
                    description="Assim que o pixel registrar visitas e cliques, o funil aparece aqui com as taxas de conversão entre as etapas."
                />
            ) : (
                <div className="space-y-4">
                    <Panel title="Do primeiro clique até a compra" icon={Filter}>
                        <FunnelChart steps={steps} />
                    </Panel>

                    <div className="space-y-2">
                    {steps.map((step, i) => {
                        const anterior = i > 0 ? steps[i - 1].sessions : step.sessions;
                        const taxaAnterior = anterior ? (step.sessions / anterior) * 100 : 0;
                        const taxaTopo = topo ? (step.sessions / topo) * 100 : 0;
                        const perdidos = i > 0 ? Math.max(anterior - step.sessions, 0) : 0;

                        return (
                            <div key={`${step.eventName}-${i}`} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="w-5 h-5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                            {i + 1}
                                        </span>
                                        <span className="text-white text-sm font-medium truncate">{step.label}</span>
                                        <code className="text-[10px] text-white/30 truncate">{step.eventName}</code>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-white font-bold text-base leading-none">{fmtNum(step.sessions)}</p>
                                        <p className="text-white/30 text-[10px] mt-0.5">{fmtNum(step.events)} eventos</p>
                                    </div>
                                </div>

                                <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                                        style={{ width: `${Math.min(taxaTopo, 100)}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-white/35">{taxaTopo.toFixed(1)}% do topo do funil</span>
                                    {i > 0 && (
                                        <span className={`flex items-center gap-1 ${taxaAnterior >= 50 ? "text-emerald-300/80" : "text-amber-300/80"}`}>
                                            <TrendingDown className="h-3 w-3" />
                                            {taxaAnterior.toFixed(1)}% da etapa anterior · {fmtNum(perdidos)} saíram
                                        </span>
                                    )}
                                    {step.value > 0 && (
                                        <span className="text-violet-300/80">{fmtMoney(step.value)}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    </div>

                    {receita > 0 && (
                        <div className="rounded-xl bg-violet-500/8 border border-violet-500/20 p-4 flex items-center justify-between">
                            <span className="text-white text-xs">Receita atribuída no período</span>
                            <span className="text-violet-200 font-bold text-lg">{fmtMoney(receita)}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
