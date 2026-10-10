import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO, differenceInCalendarDays, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { formatNumber } from "@/lib/youtube-api";

type HistoryPoint = { recorded_at: string; subscriber_count: number; view_count: number };
type HistoryMap = Record<string, HistoryPoint[]>;

/* Histórico de todos os canais numa chamada só, compartilhado entre os cards. */
let cache: HistoryMap | null = null;
let inflight: Promise<HistoryMap> | null = null;
const listeners = new Set<(h: HistoryMap) => void>();

function loadHistory(force = false): Promise<HistoryMap> {
  if (cache && !force) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetch("/api/history")
    .then(r => (r.ok ? r.json() : {}))
    .catch(() => ({}))
    .then((data: HistoryMap) => {
      cache = data || {};
      inflight = null;
      listeners.forEach(l => l(cache!));
      return cache!;
    });
  return inflight;
}

/** Recarrega o histórico se algum gráfico já o carregou (ex.: depois de atualizar canais). */
export const refreshViewsHistory = () => (cache ? loadHistory(true) : Promise.resolve(null));

export function useChannelHistory(channelId: string, enabled: boolean) {
  const [map, setMap] = useState<HistoryMap | null>(cache);
  useEffect(() => {
    if (!enabled) return;
    listeners.add(setMap);
    loadHistory().then(setMap);
    return () => { listeners.delete(setMap); };
  }, [enabled]);
  return map ? map[channelId] || [] : null;
}

export type DailyGain = { date: string; label: string; views: number; subs: number; spike: boolean };

/** Ganho diário de views dos últimos `days` dias (até hoje); dia sem dado = 0. */
export function computeDailyGains(points: HistoryPoint[], days = 7): DailyGain[] {
  const byDay = new Map<string, HistoryPoint>();
  for (const p of points) {
    const key = format(new Date(p.recorded_at), "yyyy-MM-dd");
    const cur = byDay.get(key);
    if (!cur || new Date(p.recorded_at) > new Date(cur.recorded_at)) byDay.set(key, p);
  }
  const keys = [...byDay.keys()].sort();
  const perDay = new Map<string, { views: number; subs: number }>();
  for (let i = 1; i < keys.length; i++) {
    const prev = byDay.get(keys[i - 1])!;
    const cur = byDay.get(keys[i])!;
    // se faltou dia(s), espalha o ganho pelo intervalo pra não criar pico falso
    const gap = Math.max(1, differenceInCalendarDays(parseISO(keys[i]), parseISO(keys[i - 1])));
    const views = Math.max(0, Math.round((cur.view_count - prev.view_count) / gap));
    const subs = Math.round((cur.subscriber_count - prev.subscriber_count) / gap);
    for (let d = 0; d < gap; d++) perDay.set(format(subDays(parseISO(keys[i]), d), "yyyy-MM-dd"), { views, subs });
  }
  const today = new Date();
  const recent: DailyGain[] = Array.from({ length: days }, (_, k) => {
    const day = subDays(today, days - 1 - k);
    const key = format(day, "yyyy-MM-dd");
    const g = perDay.get(key);
    return { date: key, label: format(day, "dd/MM"), views: g?.views ?? 0, subs: g?.subs ?? 0, spike: false };
  });
  // pico = dia com 2,5x+ a mediana
  const sorted = recent.map(g => g.views).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  for (const g of recent) g.spike = median > 0 && g.views >= median * 2.5;
  return recent;
}

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d: DailyGain = payload[0].payload;
  return (
    <div className="rounded-md border border-white/10 bg-[#141416]/95 px-2 py-1.5 text-[10px] shadow-lg">
      <p className="text-white/50">{d.label}</p>
      <p className="font-semibold text-white">+{formatNumber(d.views)} views</p>
      <p className="text-white/40">{d.subs >= 0 ? "+" : ""}{formatNumber(d.subs)} inscritos</p>
    </div>
  );
};

type Props = { channelId: string; className?: string; compact?: boolean };

/** Gráfico de views por dia que ocupa o lugar das thumbs no card do canal. */
export const ViewsTrendChart = ({ channelId, className = "", compact = false }: Props) => {
  const points = useChannelHistory(channelId, true);

  if (points === null) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06] ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-white/30" />
      </div>
    );
  }

  const gains = computeDailyGains(points, 7);

  const last = gains[gains.length - 1];
  const prevDays = gains.slice(0, -1);
  const avg = prevDays.reduce((s, g) => s + g.views, 0) / prevDays.length;
  const ratio = avg > 0 ? last.views / avg : 0;
  const trend =
    ratio >= 2.5 ? { text: `pico ${ratio.toFixed(1)}x`, cls: "text-red-400 bg-red-500/10" } :
    ratio >= 1.3 ? { text: "subindo", cls: "text-green-400 bg-green-500/10" } :
    ratio > 0 && ratio <= 0.7 ? { text: "caindo", cls: "text-orange-400 bg-orange-500/10" } :
    { text: "estável", cls: "text-white/50 bg-white/[0.05]" };

  return (
    <div className={`flex flex-col rounded-lg bg-white/[0.03] border border-white/[0.06] p-2 ${className}`}>
      <div className="flex items-center justify-between gap-2 text-[10px] leading-none">
        <span className="text-white/40">
          <span className="font-semibold text-white">+{formatNumber(last.views)}</span> views/dia
          <span className="text-white/25"> · média {formatNumber(Math.round(avg))}</span>
        </span>
        <span className={`px-1.5 py-0.5 rounded ${trend.cls}`}>{trend.text}</span>
      </div>
      <div className="flex-1 min-h-0 mt-1.5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={gains} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis hide domain={[0, (max: number) => Math.max(max, 1)]} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
            <Line
              type="linear"
              dataKey="views"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth={1.75}
              isAnimationActive={false}
              dot={(p: any) => p.payload.spike
                ? <circle key={p.index} cx={p.cx} cy={p.cy} r={3} fill="rgb(239,68,68)" stroke="none" />
                : <g key={p.index} />}
              activeDot={{ r: 3.5, fill: "#fff", stroke: "none" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
