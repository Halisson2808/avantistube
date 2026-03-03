/**
 * youtube-api.ts
 * Wrapper que chama o servidor local (porta 3001) em vez de Supabase Edge Functions.
 * O servidor local usa a VITE_YOUTUBE_API_KEY diretamente.
 */

const API = 'http://localhost:3001/api';

async function localFetch(path: string): Promise<any> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ${res.status}: ${text}`);
  }
  return res.json();
}

interface YouTubeSearchParams {
  q: string;
  type?: string;
  maxResults?: number;
  order?: string;
  videoDuration?: string;
  videoDefinition?: string;
  publishedAfter?: string;
  publishedBefore?: string;
}

export const searchYouTube = async (params: YouTubeSearchParams) => {
  const q = encodeURIComponent(params.q);
  const max = params.maxResults || 10;
  return localFetch(`/youtube/search?q=${q}&max=${max}`);
};

export const getChannelDetails = async (channelId: string) => {
  return localFetch(`/youtube/channel?channelId=${encodeURIComponent(channelId)}`);
};

export const getChannelVideos = async (channelId: string, maxResults = 50) => {
  return localFetch(`/youtube/videos?channelId=${encodeURIComponent(channelId)}&max=${maxResults}`);
};

export const formatNumber = (num: number | string): string => {
  const n = typeof num === 'string' ? parseInt(num) : num;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

export const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;
  const hours = match[1] ? `${match[1]}:` : '';
  const minutes = match[2] ? match[2].padStart(hours ? 2 : 1, '0') : '0';
  const seconds = match[3] ? match[3].padStart(2, '0') : '00';
  return `${hours}${minutes}:${seconds}`;
};

export interface LatestVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration?: string;
  isDeleted?: boolean;
}

export interface ChannelLatestVideosResult {
  channelId: string;
  videos: LatestVideo[];
  success: boolean;
  fetchedAt?: string;
  error?: string;
  channelDeleted?: boolean;
}

export const getLatestChannelVideos = async (
  channelIds: string[],
  maxResults = 5,
): Promise<ChannelLatestVideosResult[]> => {
  const results = await Promise.allSettled(
    channelIds.map(async (channelId) => {
      try {
        const data = await localFetch(
          `/youtube/videos?channelId=${encodeURIComponent(channelId)}&max=${maxResults}`
        );
        return {
          channelId,
          videos: data.videos || [],
          success: true,
          fetchedAt: new Date().toISOString(),
        } as ChannelLatestVideosResult;
      } catch (err: any) {
        const msg = (err?.message || '').toLowerCase();
        const channelDeleted = msg.includes('404') || msg.includes('not found');
        return {
          channelId,
          videos: [],
          success: false,
          error: err?.message,
          channelDeleted,
        } as ChannelLatestVideosResult;
      }
    })
  );

  return results.map((r) =>
    r.status === 'fulfilled'
      ? r.value
      : { channelId: '', videos: [], success: false, error: 'Falha na requisição' }
  );
};

export const calculateTimeAgo = (publishedAt: string): string => {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);
  const diffMonths = Math.floor(diffMs / 2592000000);

  if (diffMinutes < 60) return `${diffMinutes} minutos atrás`;
  if (diffHours < 24) return `${diffHours} horas atrás`;
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffWeeks < 4) return `${diffWeeks} semanas atrás`;
  return `${diffMonths} meses atrás`;
};