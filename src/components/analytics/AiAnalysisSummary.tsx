import { useMemo } from "react";
import { Bot, Copy } from "lucide-react";
import { toast } from "sonner";

import type {
  AnalyticsOverview,
  FunnelStep,
  TopItem,
  TrackingSite,
} from "@/hooks/use-analytics";
import { Panel, fmtDuration, fmtMoney } from "@/components/analytics/AnalyticsShell";

interface AiAnalysisSummaryProps {
  data: AnalyticsOverview | null;
  funnel: FunnelStep[];
  sites: TrackingSite[];
  siteKey: string | null;
  selectedPaths: string[];
  hideTests: boolean;
  loading: boolean;
}

const EVENT_LABELS: Record<string, string> = {
  pageview: "Entrou / abriu uma página",
  saida_pagina: "Saiu da página",
  saida_intencao: "Demonstrou intenção de saída",
  barra_mobile_exibida: "Viu a barra móvel",
  pop_saida_exibido: "Viu o pop-up de saída",
  pop_saida_fechado: "Fechou o pop-up de saída",
  secao_oferta_vista: "Chegou à seção da oferta",
  secao_comparacao_vista: "Chegou à seção de comparação",
  secao_seguranca_vista: "Chegou à seção de segurança",
  secao_faq_vista: "Chegou ao FAQ",
  redirecionamento_checkout: "Foi redirecionado ao checkout",
  form_enviado: "Enviou o formulário",
  lead: "Virou lead",
  purchase: "Comprou",
};

function humanizeEvent(name: string) {
  if (EVENT_LABELS[name]) return EVENT_LABELS[name];
  if (name.startsWith("cta_")) {
    return `Clicou no botão: ${name.slice(4).replace(/_/g, " ")}`;
  }
  if (name.startsWith("secao_") && name.endsWith("_vista")) {
    return `Viu a seção: ${name.slice(6, -6).replace(/_/g, " ")}`;
  }
  if (name.startsWith("tempo_")) {
    return `Permaneceu ${name.slice(6).replace("s", " segundos")}`;
  }
  return name.replace(/_/g, " ");
}

function fmtInt(value: number) {
  return value.toLocaleString("pt-BR");
}

function fmtShare(value: number, total: number) {
  if (!total) return "0%";
  return `${((value / total) * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })}%`;
}

function eventLine(item: TopItem, totalSessions: number) {
  const label = humanizeEvent(item.name);
  return `- ${label} [${item.name}]: ${fmtInt(item.sessions)} sessões (${fmtShare(item.sessions, totalSessions)}), ${fmtInt(item.events)} eventos`;
}

function periodLabel(data: AnalyticsOverview) {
  const { range } = data;
  if (range.custom) return `${range.from} até ${range.to}`;
  if (range.granularity === "hour") return `últimas 24 horas (${range.from} até ${range.to})`;
  return `últimos ${data.days} dias (${range.from} até ${range.to})`;
}

function buildSummary({
  data,
  funnel,
  siteName,
  siteKey,
  selectedPaths,
  hideTests,
}: {
  data: AnalyticsOverview;
  funnel: FunnelStep[];
  siteName: string;
  siteKey: string | null;
  selectedPaths: string[];
  hideTests: boolean;
}) {
  const t = data.totals;
  const lines: string[] = [
    "RESUMO DO PIXEL PARA ANÁLISE",
    "",
    `Site: ${siteName}${siteKey ? ` (${siteKey})` : ""}`,
    `Período: ${periodLabel(data)}`,
    `Rotas: ${selectedPaths.length ? selectedPaths.join(", ") : "site inteiro"}`,
    `Sessões de teste: ${hideTests ? `ocultadas${data.hiddenTestSessions ? ` (${data.hiddenTestSessions})` : ""}` : "incluídas"}`,
    "",
    "VISÃO GERAL",
    `- Pessoas únicas (identificador anônimo): ${fmtInt(t.visitors)}`,
    `- Sessões/visitas: ${fmtInt(t.sessions)}`,
    `- Páginas abertas: ${fmtInt(t.pageviews)}`,
    `- Total de eventos: ${fmtInt(t.events)}`,
    `- Cliques: ${fmtInt(t.clicks)} (${fmtShare(t.clicks, t.pageviews)} das páginas abertas)`,
    `- Leads: ${fmtInt(t.leads)}`,
    `- Compras: ${fmtInt(t.purchases)} (${fmtShare(t.purchases, t.sessions)} das sessões)`,
    `- Receita registrada: ${fmtMoney(t.revenue)}`,
    `- Tempo médio: ${fmtDuration(t.avgSeconds)}`,
    `- Rolagem média: ${Math.round(t.avgScroll)}%`,
    `- Intenções de saída: ${fmtInt(t.exitIntents)}`,
  ];

  lines.push("", "ROLAGEM DA PÁGINA");
  if (data.scroll.length) {
    for (const item of data.scroll) {
      lines.push(`- Chegaram a ${item.percent}%: ${fmtInt(item.sessions)} sessões (${fmtShare(item.sessions, t.sessions)}), ${fmtInt(item.events)} eventos`);
    }
  } else {
    lines.push("- Nenhum marco de rolagem registrado.");
  }

  const journey = data.allEvents.filter(
    (item) => !/^(pageview|saida_pagina|rolagem_|tempo_|video_)/.test(item.name),
  );
  lines.push("", "AÇÕES E ETAPAS DA JORNADA");
  if (journey.length) journey.forEach((item) => lines.push(eventLine(item, t.sessions)));
  else lines.push("- Nenhuma ação personalizada registrada.");

  lines.push("", "TODOS OS EVENTOS REGISTRADOS");
  if (data.allEvents.length) data.allEvents.forEach((item) => lines.push(eventLine(item, t.sessions)));
  else lines.push("- Nenhum evento registrado.");

  lines.push("", "FUNIL CONFIGURADO");
  const funnelBase = funnel[0]?.sessions || t.sessions;
  if (funnel.length) {
    funnel.forEach((step) => {
      lines.push(`- ${step.label} [${step.eventName}]: ${fmtInt(step.sessions)} sessões (${fmtShare(step.sessions, funnelBase)})`);
    });
  } else {
    lines.push("- Nenhuma etapa configurada.");
  }

  const appendRanking = (title: string, items: TopItem[], unit: string) => {
    lines.push("", title);
    if (!items.length) {
      lines.push("- Sem dados.");
      return;
    }
    items.forEach((item) => {
      lines.push(`- ${item.name}: ${fmtInt(item.events)} ${unit}, ${fmtInt(item.sessions)} sessões`);
    });
  };

  appendRanking("PÁGINAS", data.pages, "visualizações/eventos");
  appendRanking("ORIGENS", data.sources, "eventos");
  appendRanking("APARELHOS", data.devices, "eventos");

  lines.push(
    "",
    "PEDIDO PARA A IA",
    "Analise esses dados como um funil. Identifique os maiores gargalos, compare a passagem entre as etapas e sugira ações práticas priorizadas para aumentar o avanço até a oferta, os cliques e as conversões. Não invente dados que não estejam neste resumo.",
  );

  return lines.join("\n");
}

function SummaryStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-white/35">{label}</p>
      <p className="mt-0.5 text-base font-semibold text-white">{value}</p>
      {hint && <p className="text-[10px] text-white/35">{hint}</p>}
    </div>
  );
}

export function AiAnalysisSummary(props: AiAnalysisSummaryProps) {
  const siteName = props.siteKey
    ? props.sites.find((site) => site.site_key === props.siteKey)?.name || props.siteKey
    : "Todos os sites";
  const summary = useMemo(
    () => props.data
      ? buildSummary({
          data: props.data,
          funnel: props.funnel,
          siteName,
          siteKey: props.siteKey,
          selectedPaths: props.selectedPaths,
          hideTests: props.hideTests,
        })
      : "",
    [props.data, props.funnel, props.siteKey, props.selectedPaths, props.hideTests, siteName],
  );

  const t = props.data?.totals;
  const journey = props.data?.allEvents.filter(
    (item) => !/^(pageview|saida_pagina|rolagem_|tempo_|video_)/.test(item.name),
  ) || [];

  const copy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Resumo completo copiado. Agora é só colar na IA.");
    } catch {
      toast.error("Não foi possível copiar o resumo.");
    }
  };

  return (
    <Panel
      title="Resumo para IA"
      icon={Bot}
      right={
        <button
          type="button"
          onClick={copy}
          disabled={!props.data || props.loading}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/15 px-3 py-1.5 text-xs text-emerald-200 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Copy className="h-3.5 w-3.5" />
          Copiar tudo
        </button>
      }
    >
      <p className="text-xs text-white/40">
        Resumo agregado de <span className="text-white/70">{siteName}</span>, pronto para colar em qualquer IA e pedir uma análise do funil.
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <SummaryStat label="Pessoas" value={fmtInt(t?.visitors || 0)} hint="IDs anônimos" />
        <SummaryStat label="Sessões" value={fmtInt(t?.sessions || 0)} />
        <SummaryStat label="Páginas abertas" value={fmtInt(t?.pageviews || 0)} />
        <SummaryStat label="Cliques" value={fmtInt(t?.clicks || 0)} />
        <SummaryStat label="Leads" value={fmtInt(t?.leads || 0)} />
        <SummaryStat label="Compras" value={fmtInt(t?.purchases || 0)} />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">Rolagem</p>
          <div className="space-y-1.5">
            {props.data?.scroll.length ? props.data.scroll.map((item) => (
              <div key={item.percent} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-white/60">Chegaram a {item.percent}%</span>
                <span className="whitespace-nowrap text-white">
                  {fmtInt(item.sessions)} <span className="text-white/35">({fmtShare(item.sessions, t?.sessions || 0)})</span>
                </span>
              </div>
            )) : <p className="text-xs text-white/30">Nenhuma rolagem registrada.</p>}
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">Ações e etapas</p>
          <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {journey.length ? journey.map((item) => (
              <div key={item.name} className="flex items-start justify-between gap-3 text-xs">
                <span className="text-white/60" title={item.name}>{humanizeEvent(item.name)}</span>
                <span className="whitespace-nowrap text-white">
                  {fmtInt(item.sessions)} <span className="text-white/35">({fmtShare(item.sessions, t?.sessions || 0)})</span>
                </span>
              </div>
            )) : <p className="text-xs text-white/30">Nenhuma ação personalizada registrada.</p>}
          </div>
        </div>
      </div>

      <p className="text-[10px] text-white/30">
        O texto copiado também inclui todos os eventos técnicos, funil, páginas, origens, aparelhos, período e filtros ativos.
      </p>
    </Panel>
  );
}
