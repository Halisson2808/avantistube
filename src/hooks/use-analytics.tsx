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
  /** Rotas selecionadas dentro do site. Vazio/ausente = site inteiro. */
  paths?: string[];
  /** Esconde sessões de teste/validação (só visão geral e funil respeitam). */
  hideTests?: boolean;
}

export interface Milestone {
  percent: number;
  events: number;
  sessions: number;
}

export interface AnalyticsOverview {
  days: number;
  range: { from: string; to: string; custom: boolean; granularity: "hour" | "day" };
  /** Rotas vistas no período (para alimentar o filtro), independentes do recorte. */
  paths: Array<{ path: string; events: number }>;
  selectedPaths: string[] | null;
  /** Quantas sessões de teste foram escondidas por causa do filtro. */
  hiddenTestSessions?: number;
  totals: {
    events: number;
    pageviews: number;
    clicks: number;
    leads: number;
    purchases: number;
    visitors: number;
    sessions: number;
    revenue: number;
    clickRate: number;
    conversionRate: number;
    avgSeconds: number;
    avgScroll: number;
    exitIntents: number;
  };
  timeseries: Array<{
    date: string;
    /** Rótulo pronto para o eixo: "14h" por hora, "09/09" por dia. */
    label: string;
    /** Dia local do ponto (AAAA-MM-DD). */
    day?: string;
    // null = hora que ainda não chegou (a linha para no "agora").
    pageviews: number | null;
    clicks: number | null;
    leads: number | null;
    purchases: number | null;
    revenue: number | null;
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

/** Uma visita (sessão) com tudo o que a pessoa fez dentro. */
export interface TrackingSession {
  id: string;
  visitorId: string | null;
  siteKey: string;
  startedAt: string;
  lastAt: string;
  entryPath: string;
  paths: string[];
  source: string | null;
  campaign: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  eventCount: number;
  types: Partial<Record<TrackingEvent["event_type"], number>>;
  value: number;
  converted: boolean;
  isTest: boolean;
  events: TrackingEvent[];
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
  if (range.paths && range.paths.length) qs.set("path", range.paths.join(","));
  if (range.hideTests) qs.set("hideTests", "1");
  // Fuso de quem está olhando: sem isso "hoje" e as horas do dia sairiam em UTC.
  qs.set("tz", String(new Date().getTimezoneOffset()));
  return qs;
}

async function getJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    // `no-store`: métrica nunca vem do cache do navegador. Sem isso, uma
    // resposta antiga (de antes de um deploy) continua sendo servida e some
    // campo novo do painel — foi o que aconteceu com o filtro de rotas.
    res = await fetch(url, { cache: "no-store" });
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
  }, [siteKey, range.days, range.from, range.to, range.paths?.join(","), range.hideTests]);

  useEffect(() => { load(); }, [load]);

  return { data, isLoading, reload: load };
}

/* ── Funil ───────────────────────────────────────────────────────────────── */
export function useAnalyticsFunnel(siteKey: string | null, range: DateRange) {
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [hiddenTestSessions, setHidden] = useState(0);
  const [isLoading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = rangeParams(range);
      if (siteKey) qs.set("site", siteKey);
      const res = await getJson<{ steps: FunnelStep[]; hiddenTestSessions?: number }>(
        `${API}/analytics/funnel?${qs}`,
      );
      setSteps(res.steps || []);
      setHidden(res.hiddenTestSessions || 0);
    } catch (err) {
      toast.error(`Erro ao carregar o funil: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [siteKey, range.days, range.from, range.to, range.paths?.join(","), range.hideTests]);

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

  return { steps, hiddenTestSessions, isLoading, reload: load, saveSteps };
}

/* ── Visitas (Eventos ao Vivo agrupados por sessão) ─────────────────────── */
export function useTrackingSessions(siteKey: string | null, range: DateRange, limit = 100) {
  const [sessions, setSessions] = useState<TrackingSession[]>([]);
  const [isLoading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = rangeParams(range);
      qs.delete("hideTests"); // aqui tudo aparece, teste inclusive
      qs.set("limit", String(limit));
      if (siteKey) qs.set("site", siteKey);
      setSessions(await getJson<TrackingSession[]>(`${API}/analytics/sessions?${qs}`));
    } catch (err) {
      toast.error(`Erro ao carregar visitas: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [siteKey, limit, range.days, range.from, range.to, range.paths?.join(",")]);

  useEffect(() => { load(); }, [load]);

  return { sessions, isLoading, reload: load };
}
