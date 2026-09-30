import type { LatestVideo } from "./youtube-api";

export function getFeedChannels<T extends { isOwnChannel?: boolean; contentType?: "shorts" | "longform" }>(
  channels: T[], includeOwnChannels: boolean, format?: "shorts" | "longform",
) {
  return channels.filter(channel => (includeOwnChannels || !channel.isOwnChannel)
    && (!format || (channel.contentType || "longform") === format));
}

export interface FeedVideo extends LatestVideo {
  channelId: string;
  channelName: string;
  channelThumbnail?: string;
}
export function formatPublicationTime(publishedAt: string, timeZone?: string) {
  const date = new Date(publishedAt);
  if (!Number.isFinite(date.getTime())) return "Horário indisponível";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit", minute: "2-digit", hourCycle: "h23", ...(timeZone ? { timeZone } : {}),
  }).format(date);
}
export function getFeedPeriods(videos: FeedVideo[], now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const week = new Date(today);
  week.setDate(week.getDate() - 6);
  const month = new Date(today);
  month.setDate(month.getDate() - 29);
  const periods: FeedVideo[][] = [[], [], []];
  const seen = new Set<string>();
  for (const video of videos) {
    const published = Date.parse(video.publishedAt);
    if (seen.has(video.videoId) || video.isDeleted || !Number.isFinite(published)
      || published > now.getTime() || published < month.getTime()) continue;
    seen.add(video.videoId);
    periods[published >= today.getTime() ? 0 : published >= week.getTime() ? 1 : 2].push(video);
  }
  return periods.map(period => period.sort((a, b) =>
    b.viewCount - a.viewCount || Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
    || a.videoId.localeCompare(b.videoId)));
}

interface FeedPage {
  videos: LatestVideo[];
  nextPageToken?: string;
}

let activeFeedRequests = 0;
const waitingFeedRequests: Array<() => void> = [];

function abortable<T>(request: () => Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const cancel = () => reject(signal.reason || new Error("Consulta cancelada."));
    if (signal.aborted) { cancel(); return; }
    signal.addEventListener("abort", cancel, { once: true });
    Promise.resolve().then(request).then(resolve, reject).finally(() => signal.removeEventListener("abort", cancel));
  });
}

async function withFeedRequestSlot<T>(request: () => Promise<T>, signal: AbortSignal): Promise<T> {
  signal.throwIfAborted();
  if (activeFeedRequests < 4) activeFeedRequests += 1;
  else await new Promise<void>((resolve, reject) => {
    const start = () => { signal.removeEventListener("abort", cancel); resolve(); };
    const cancel = () => {
      const index = waitingFeedRequests.indexOf(start);
      if (index >= 0) waitingFeedRequests.splice(index, 1);
      reject(signal.reason || new Error("Consulta cancelada."));
    };
    waitingFeedRequests.push(start);
    signal.addEventListener("abort", cancel, { once: true });
  });
  try {
    signal.throwIfAborted();
    return await abortable(request, signal);
  } finally {
    const next = waitingFeedRequests.shift();
    if (next) next();
    else activeFeedRequests -= 1;
  }
}

export async function fetchJsonWithDeadline<T>(url: string, timeoutMs = 20_000, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const cancel = () => controller.abort(signal?.reason);
  if (signal?.aborted) cancel();
  else signal?.addEventListener("abort", cancel, { once: true });
  const timer = setTimeout(() => controller.abort(new Error("A consulta demorou demais. Tente novamente.")), timeoutMs);
  try {
    return await abortable(async () => {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw Object.assign(new Error(data.error || `Não foi possível carregar os dados (erro ${response.status}).`), { code: data.code });
      }
      return response.json();
    }, controller.signal);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", cancel);
  }
}

export async function fetchChannelFeed(channelId: string, since: string, signal?: AbortSignal, timeoutMs = 45_000) {
  const controller = new AbortController();
  const cancel = () => controller.abort(signal?.reason);
  if (signal?.aborted) cancel();
  else signal?.addEventListener("abort", cancel, { once: true });
  const timer = setTimeout(() => controller.abort(new Error("A atualização deste canal excedeu o tempo limite.")), timeoutMs);
  const videos = new Map<string, LatestVideo>();
  const tokens = new Set<string>();
  let pageToken = "";
  try {
    do {
      const params = new URLSearchParams({ channelId, since });
      if (pageToken) params.set("pageToken", pageToken);
      const page = await withFeedRequestSlot(
        () => fetchJsonWithDeadline<FeedPage>(`/api/youtube/feed-videos?${params}`, 20_000, controller.signal),
        controller.signal,
      );
      for (const video of page.videos) videos.set(video.videoId, video);
      pageToken = page.nextPageToken || "";
      if (pageToken && tokens.has(pageToken)) throw new Error("A paginação do canal não foi concluída.");
      tokens.add(pageToken);
    } while (pageToken);
    return [...videos.values()];
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", cancel);
  }
}
