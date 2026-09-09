/**
 * AnalyticsShell.tsx — peças reutilizadas pelas telas de Sites & Tráfego:
 * cabeçalho com filtro de site/período, cartões de métrica e blocos de seção.
 */
import { RefreshCw } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTrackingSites, type DateRange, type TrackingSite } from "@/hooks/use-analytics";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { RouteFilter, type RouteOption } from "@/components/analytics/RouteFilter";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const PERIODS = [
  { label: "24h", days: 1 },
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
];

/**
 * Filtro de site + período compartilhado entre as telas (fica salvo no navegador).
 * O período é um preset em dias OU um intervalo de datas escolhido a dedo —
 * quando as duas datas estão preenchidas, elas mandam.
 */
export function useAnalyticsFilters() {
  const [siteKey, setSiteKey] = useLocalStorage<string>("avantis_analytics_site", "");
  const [days, setDays] = useLocalStorage<number>("avantis_analytics_days", 7);
  const [from, setFrom] = useLocalStorage<string>("avantis_analytics_from", "");
  const [to, setTo] = useLocalStorage<string>("avantis_analytics_to", "");
  const [paths, setPaths] = useLocalStorage<string[]>("avantis_analytics_paths", []);
  const { sites, isLoading } = useTrackingSites();

  const range: DateRange = from && to ? { days, from, to, paths } : { days, paths };

  // Trocar de site zera o recorte: as rotas de um site não existem no outro.
  const trocarSite = (v: string) => {
    setPaths([]);
    setSiteKey(v);
  };

  const setDaysPreset = (d: number) => {
    setFrom("");
    setTo("");
    setDays(d);
  };

  return {
    siteKey: siteKey || null,
    setSiteKey: trocarSite,
    paths,
    setPaths,
    days,
    setDays: setDaysPreset,
    from,
    to,
    setFrom,
    setTo,
    range,
    sites,
    sitesLoading: isLoading,
  };
}

/**
 * Rotas para o filtro. Usa `paths` (lista completa do período) e cai para
 * `pages` quando ele não vier — assim o filtro nunca fica vazio por causa de
 * uma resposta antiga da API.
 */
export function rotasDoOverview(data?: {
  paths?: Array<{ path: string; events: number }>;
  pages?: Array<{ name: string; events: number }>;
} | null): RouteOption[] {
  if (data?.paths?.length) return data.paths;
  return (data?.pages || []).map((p) => ({ path: p.name, events: p.events }));
}

export function AnalyticsHeader({
  title,
  subtitle,
  sites,
  siteKey,
  onSiteChange,
  days,
  onDaysChange,
  from,
  to,
  onFromChange,
  onToChange,
  routeOptions,
  selectedPaths,
  onPathsChange,
  onRefresh,
  loading,
  actions,
}: {
  title: string;
  subtitle?: string;
  sites: TrackingSite[];
  siteKey: string | null;
  onSiteChange: (v: string) => void;
  days?: number;
  onDaysChange?: (d: number) => void;
  from?: string;
  to?: string;
  onFromChange?: (v: string) => void;
  onToChange?: (v: string) => void;
  routeOptions?: RouteOption[];
  selectedPaths?: string[];
  onPathsChange?: (paths: string[]) => void;
  onRefresh?: () => void;
  loading?: boolean;
  actions?: React.ReactNode;
}) {
  const periodoCustomizado = Boolean(from && to);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
          {selectedPaths && selectedPaths.length > 0 ? (
            <p className="text-emerald-300/80 text-xs mt-0.5">
              Mostrando apenas {selectedPaths.join(", ")}
            </p>
          ) : (
            subtitle && <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={siteKey || "__todos__"}
          onValueChange={(v) => onSiteChange(v === "__todos__" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[160px] gap-2 rounded-lg bg-white/[0.04] border-white/[0.08] text-white text-xs focus:ring-0 focus:border-emerald-500/40">
            <SelectValue placeholder="Todos os sites" />
          </SelectTrigger>
          <SelectContent className="bg-[#101014] border-white/10 text-white">
            <SelectItem value="__todos__" className="text-xs focus:bg-white/10 focus:text-white">
              Todos os sites
            </SelectItem>
            {sites.map((s) => (
              <SelectItem
                key={s.id}
                value={s.site_key}
                className="text-xs focus:bg-white/10 focus:text-white"
              >
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onDaysChange && (
          <div className="flex items-center rounded-lg bg-white/[0.04] border border-white/[0.08] p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                onClick={() => onDaysChange(p.days)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${!periodoCustomizado && days === p.days
                  ? "bg-emerald-500/20 text-emerald-200 font-medium"
                  : "text-white/50 hover:text-white"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Recorte por rota dentro do site */}
        {onPathsChange && (
          <RouteFilter
            options={routeOptions || []}
            selected={selectedPaths || []}
            onChange={onPathsChange}
          />
        )}

        {/* Datas personalizadas — quando preenchidas, ganham dos presets */}
        {onFromChange && onToChange && (
          <DateRangePicker
            from={from}
            to={to}
            onChange={(inicio, fim) => { onFromChange(inicio); onToChange(fim); }}
          />
        )}
      </div>
    </div>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  loading,
  accent = "text-emerald-400",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  hint?: string;
  loading?: boolean;
  accent?: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-white/40">
        <Icon className={`h-3.5 w-3.5 ${accent}`} />
        <span className="text-[11px]">{label}</span>
      </div>
      {loading
        ? <div className="h-6 w-16 rounded bg-white/10 animate-pulse" />
        : <p className="text-white font-bold text-xl leading-none">{value}</p>}
      {hint && <span className="text-white/30 text-[10px]">{hint}</span>}
    </div>
  );
}

export function Panel({
  title,
  icon: Icon,
  right,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-white/50" />}
          <h2 className="text-white font-semibold text-sm">{title}</h2>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

/** Lista "top N" com barra proporcional — usada em origens, campanhas, páginas. */
export function RankedList({
  items,
  emptyLabel = "Nenhum dado ainda.",
  unit = "eventos",
}: {
  items: Array<{ name: string; events: number; sessions: number; value: number }>;
  emptyLabel?: string;
  unit?: string;
}) {
  const max = items.reduce((m, i) => Math.max(m, i.events), 0) || 1;

  if (!items.length) {
    return <p className="text-white/30 text-xs py-4 text-center">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.name} className="relative rounded-lg overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-emerald-500/12"
            style={{ width: `${(item.events / max) * 100}%` }}
          />
          <div className="relative flex items-center justify-between px-2.5 py-1.5">
            <span className="text-white text-xs truncate pr-3">{item.name}</span>
            <span className="text-white/45 text-[11px] flex-shrink-0">
              {item.events.toLocaleString("pt-BR")} {unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, description, children }: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center space-y-2">
      <h3 className="text-white text-sm font-semibold">{title}</h3>
      <p className="text-white/40 text-xs max-w-md mx-auto">{description}</p>
      {children}
    </div>
  );
}

/**
 * Barras de marcos (rolagem da página, progresso da VSL). Cada barra é medida
 * contra o primeiro marco, então dá para ler onde a audiência trava.
 */
export function MilestoneBars({
  items,
  emptyLabel = "Nenhum marco registrado no período.",
  color = "bg-emerald-500",
}: {
  items: Array<{ percent: number; events: number; sessions: number }>;
  emptyLabel?: string;
  color?: string;
}) {
  if (!items.length) {
    return <p className="text-white/30 text-xs py-4 text-center">{emptyLabel}</p>;
  }

  const base = items[0]?.sessions || 1;

  return (
    <div className="space-y-2">
      {items.map((m) => {
        const pct = Math.min((m.sessions / base) * 100, 100);
        return (
          <div key={m.percent} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/70">{m.percent}%</span>
              <span className="text-white/40">
                {m.sessions.toLocaleString("pt-BR")} sessões · {pct.toFixed(0)}% de quem começou
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Segundos → "1m 20s" */
export const fmtDuration = (segundos: number) => {
  const s = Math.round(segundos || 0);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const resto = s % 60;
  return resto ? `${m}m ${resto}s` : `${m}m`;
};

export const fmtNum = (n: number) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
    : n >= 1_000 ? (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
      : String(n ?? 0);

export const fmtMoney = (n: number) =>
  (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const fmtPct = (n: number) => `${((n || 0) * 100).toFixed(1)}%`;
