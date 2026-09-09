/**
 * AnalyticsShell.tsx — peças reutilizadas pelas telas de Sites & Tráfego:
 * cabeçalho com filtro de site/período, cartões de métrica e blocos de seção.
 */
import { RefreshCw } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTrackingSites, type TrackingSite } from "@/hooks/use-analytics";

export const PERIODS = [
  { label: "24h", days: 1 },
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
];

/** Filtro de site + período compartilhado entre as telas (fica salvo no navegador). */
export function useAnalyticsFilters() {
  const [siteKey, setSiteKey] = useLocalStorage<string>("avantis_analytics_site", "");
  const [days, setDays] = useLocalStorage<number>("avantis_analytics_days", 7);
  const { sites, isLoading } = useTrackingSites();
  return {
    siteKey: siteKey || null,
    setSiteKey,
    days,
    setDays,
    sites,
    sitesLoading: isLoading,
  };
}

export function AnalyticsHeader({
  title,
  subtitle,
  sites,
  siteKey,
  onSiteChange,
  days,
  onDaysChange,
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
  onRefresh?: () => void;
  loading?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
          {subtitle && <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>}
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
        <select
          value={siteKey || ""}
          onChange={(e) => onSiteChange(e.target.value)}
          className="h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs px-2.5 outline-none focus:border-emerald-500/40"
        >
          <option value="">Todos os sites</option>
          {sites.map((s) => (
            <option key={s.id} value={s.site_key}>{s.name}</option>
          ))}
        </select>

        {onDaysChange && (
          <div className="flex items-center rounded-lg bg-white/[0.04] border border-white/[0.08] p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                onClick={() => onDaysChange(p.days)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${days === p.days
                  ? "bg-emerald-500/20 text-emerald-200 font-medium"
                  : "text-white/50 hover:text-white"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
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

export const fmtNum = (n: number) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
    : n >= 1_000 ? (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
      : String(n ?? 0);

export const fmtMoney = (n: number) =>
  (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const fmtPct = (n: number) => `${((n || 0) * 100).toFixed(1)}%`;
