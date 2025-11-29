import { supabase } from "@/integrations/supabase/client";

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

const invokeYouTubeFunction = async (
  action: string,
  payload: Record<string, any>,
): Promise<any> => {
  const { data, error } = await supabase.functions.invoke("youtube", {
    body: { action, ...payload },
  });

  if (error) {
    console.error("Erro na função Edge do YouTube:", error);
    throw new Error(
      error.message || "Erro ao comunicar com o serviço do YouTube.",
    );
  }

  return data;
};

export const searchYouTube = async (params: YouTubeSearchParams) => {
  return invokeYouTubeFunction("search", params);
};

export const getChannelDetails = async (channelId: string) => {
  return invokeYouTubeFunction("channelDetails", { channelId });
};

export const getChannelVideos = async (
  channelId: string,
  maxResults: number = 50,
) => {
  return invokeYouTubeFunction("channelVideos", { channelId, maxResults });
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
