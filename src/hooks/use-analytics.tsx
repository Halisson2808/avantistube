/**
 * use-analytics.tsx — dados do módulo de Sites & Tráfego.
 * Fala com /api/analytics/* (Supabase por trás) e mantém o estado local simples.
 */
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const API = "/api";

export interface TrackingSite {
  id: string;
  site_key: string;
  name: string;
  domain?: string | null;
  kind: "organic" | "paid" | "both";
  notes?: string | null;
  /** true = entrou sozinho na primeira visita, pelo data-site-name do pixel. */
  auto_created?: boolean;
  created_at: string;
}

export interface TrackingEvent {
  id: string;
  site_key: string;
  event_type: "pageview" | "click" | "lead" | "purchase" | "custom";
  event_name: string;
  page_url?: string | null;
  path?: string | null;
  referrer_host?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  click_id?: string | null;
  ad_network?: string | null;
  visitor_id?: string | null;
  session_id?: string | null;
  value?: number | null;
  currency?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  created_at: string;
}

export interface TopItem {
  name: string;
  events: number;
  sessions: number;
  value: number;
}

/** Recorte de tempo usado nas telas: presets em dias ou datas escolhidas. */
export interface DateRange {
  days: number;
  from?: string | null;
  to?: string | null;
}

export interface Milestone {
  percent: number;
  events: number;
  sessions: number;
}

export interface AnalyticsOverview {
  days: number;
  range: { from: string; to: string; custom: boolean };
  totals: {
    events: number;
    pageviews: number;
    clicks: number;
    leads: number;
    purchases: number;
    visitors: number;
    sessions: number;
    revenue: number;
    paidEvents: number;
    organicEvents: number;
    clickRate: number;
    conversionRate: number;
    avgSeconds: number;
    avgScroll: number;
    exitIntents: number;
  };
  timeseries: Array<{
    date: string;
    pageviews: number;
    clicks: number;
    leads: number;
    purchases: number;
    revenue: number;
  }>;
  sources: TopItem[];
  campaigns: TopItem[];
  pages: TopItem[];
  devices: TopItem[];
  topClicks: TopItem[];
  sites: TopItem[];
  scroll: Milestone[];
  video: Milestone[];
  customEvents: TopItem[];
  allEvents: TopItem[];
}

export interface FunnelStep {
  label: string;
  eventName: string;
  events: number;
  sessions: number;
  value: number;
}

/** Traduz o filtro de período para a query string da API. */
function rangeParams(range: DateRange): URLSearchParams {
  const qs = new URLSearchParams();
  if (range.from && range.to) {
    qs.set("from", range.from);
    qs.set("to", range.to);
  } else {
    qs.set("days", String(range.days));
  }
  return qs;
}

async function getJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("API fora do ar — rode `npm run dev` (ou `npm run server`).");
  }

  if (!res.ok) {
    const info = await res.json().catch(() => ({} as { error?: string }));
    // 500 sem JSON de erro costuma ser o proxy do Vite sem o server.mjs atrás.
    if (!info.error && res.status >= 500) {
      throw new Error(
        `A API respondeu ${res.status}. Se estiver rodando local, confira se o servidor da porta 3001 está no ar (npm run dev).`,
      );
    }
    throw new Error(info.error || `Erro ${res.status}`);
  }
  return res.json();
}

/* ── Sites cadastrados ───────────────────────────────────────────────────── */
export function useTrackingSites() {
  const [sites, setSites] = useState<TrackingSite[]>([]);
  const [isLoading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setSites(await getJson<TrackingSite[]>(`${API}/analytics/sites`));
    } catch (err) {
      toast.error(`Não foi possível carregar os sites: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addSite = useCallback(async (input: {
    name: string;
    domain?: string;
    kind?: TrackingSite["kind"];
    siteKey?: string;
    notes?: string;
  }) => {
    const res = await fetch(`${API}/analytics/sites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error || "Erro ao cadastrar o site.");
      return null;
    }
    toast.success(`Site "${input.name}" cadastrado.`);
    await load();
    return data as TrackingSite;
  }, [load]);

  const renameSite = useCallback(async (id: string, name: string) => {
    const res = await fetch(`${API}/analytics/sites/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      toast.error("Erro ao renomear o site.");
      return;
    }
    await load();
  }, [load]);

  const removeSite = useCallback(async (id: string) => {
    const res = await fetch(`${API}/analytics/sites/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Erro ao remover o site.");
      return;
    }
    toast.success("Site removido (e os eventos dele também).");
    await load();
  }, [load]);

  return { sites, isLoading, reload: load, addSite, renameSite, removeSite };
}

/* ── Visão geral ─────────────────────────────────────────────────────────── */
export function useAnalyticsOverview(siteKey: string | null, range: DateRange) {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = rangeParams(range);
      if (siteKey) qs.set("site", siteKey);
      setData(await getJson<AnalyticsOverview>(`${API}/analytics/overview?${qs}`));
    } catch (err) {
      toast.error(`Erro ao carregar métricas: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [siteKey, range.days, range.from, range.to]);

  useEffect(() => { load(); }, [load]);

  return { data, isLoading, reload: load };
}

/* ── Funil ───────────────────────────────────────────────────────────────── */
export function useAnalyticsFunnel(siteKey: string | null, range: DateRange) {
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [isLoading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = rangeParams(range);
      if (siteKey) qs.set("site", siteKey);
      const res = await getJson<{ steps: FunnelStep[] }>(`${API}/analytics/funnel?${qs}`);
      setSteps(res.steps || []);
    } catch (err) {
      toast.error(`Erro ao carregar o funil: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [siteKey, range.days, range.from, range.to]);

  useEffect(() => { load(); }, [load]);

  const saveSteps = useCallback(async (
    key: string,
    custom: Array<{ label: string; eventName: string }>,
  ) => {
    const res = await fetch(`${API}/analytics/funnel-steps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteKey: key, steps: custom }),
    });
    if (!res.ok) {
      toast.error("Erro ao salvar as etapas do funil.");
      return;
    }
    toast.success("Funil atualizado.");
    await load();
  }, [load]);

  return { steps, isLoading, reload: load, saveSteps };
}

/* ── Eventos ao vivo ─────────────────────────────────────────────────────── */
export function useTrackingEvents(siteKey: string | null, range: DateRange, limit = 100) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = rangeParams(range);
      qs.set("limit", String(limit));
      if (siteKey) qs.set("site", siteKey);
      setEvents(await getJson<TrackingEvent[]>(`${API}/analytics/events?${qs}`));
    } catch (err) {
      toast.error(`Erro ao carregar eventos: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [siteKey, limit, range.days, range.from, range.to]);

  useEffect(() => { load(); }, [load]);

  return { events, isLoading, reload: load };
}
