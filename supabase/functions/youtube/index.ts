import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const YOUTUBE_API_KEY = Deno.env.get("VITE_YOUTUBE_API_KEY") || "";

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

const searchYouTube = async (params: YouTubeSearchParams) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error(
      "API Key do YouTube não configurada. Configure VITE_YOUTUBE_API_KEY nas secrets do projeto.",
    );
  }

  const {
    q,
    type = "video",
    maxResults = 50,
    order = "relevance",
    videoDuration,
    videoDefinition,
    publishedAfter,
    publishedBefore,
  } = params;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.append("key", YOUTUBE_API_KEY);
  url.searchParams.append("q", q);
  url.searchParams.append("type", type);
  url.searchParams.append("part", "snippet");
  url.searchParams.append("maxResults", maxResults.toString());
  url.searchParams.append("order", order);

  if (videoDuration) url.searchParams.append("videoDuration", videoDuration);
  if (videoDefinition) url.searchParams.append("videoDefinition", videoDefinition);
  if (publishedAfter) url.searchParams.append("publishedAfter", publishedAfter);
  if (publishedBefore) url.searchParams.append("publishedBefore", publishedBefore);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);

  const data = await response.json();

  const videoIds = data.items
    .filter((item: any) => item.id.videoId)
    .map((item: any) => item.id.videoId);
  let videoStats: any = {};

  if (videoIds.length > 0) {
    const statsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    statsUrl.searchParams.append("key", YOUTUBE_API_KEY);
    statsUrl.searchParams.append("id", videoIds.join(","));
    statsUrl.searchParams.append("part", "statistics,contentDetails");

    const statsResponse = await fetch(statsUrl.toString());
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      videoStats = statsData.items.reduce((acc: any, item: any) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, any>);
    }
  }

  const channelIds = [
    ...new Set(data.items.map((item: any) => item.snippet.channelId)),
  ];
  let channelStats: any = {};

  if (channelIds.length > 0) {
    const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelUrl.searchParams.append("key", YOUTUBE_API_KEY);
    channelUrl.searchParams.append("id", channelIds.join(","));
    channelUrl.searchParams.append("part", "statistics,snippet");

    const channelResponse = await fetch(channelUrl.toString());
    if (channelResponse.ok) {
      const channelData = await channelResponse.json();
      channelStats = channelData.items.reduce((acc: any, item: any) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, any>);
    }
  }

  return data.items.map((item: any) => {
    const stats = videoStats[item.id.videoId] || {};
    const channel = channelStats[item.snippet.channelId] || {};

    return {
      id: item.id.videoId || item.id.channelId,
      type: item.id.kind.includes("video") ? "video" : "channel",
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.default?.url,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: stats.statistics?.viewCount || "0",
      likeCount: stats.statistics?.likeCount || "0",
      commentCount: stats.statistics?.commentCount || "0",
      subscriberCount: channel.statistics?.subscriberCount || "0",
      videoCount: channel.statistics?.videoCount || "0",
      duration: stats.contentDetails?.duration || "",
    };
  });
};

const getChannelDetails = async (channelId: string) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error(
      "API Key do YouTube não configurada. Configure VITE_YOUTUBE_API_KEY nas secrets do projeto.",
    );
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.append("key", YOUTUBE_API_KEY);
  url.searchParams.append("id", channelId);
  url.searchParams.append("part", "snippet,statistics,contentDetails");

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || `YouTube API error: ${response.status}`,
    );
  }

  const data = await response.json();
  const channel = data.items[0];

  return {
    id: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    thumbnail: channel.snippet.thumbnails?.high?.url,
    subscriberCount: parseInt(channel.statistics.subscriberCount),
    viewCount: parseInt(channel.statistics.viewCount),
    videoCount: parseInt(channel.statistics.videoCount),
    customUrl: channel.snippet.customUrl,
  };
};

// Converte Channel ID para Playlist ID de uploads (UC -> UU)
const getUploadPlaylistId = (channelId: string): string => {
  if (channelId.startsWith("UC")) {
    return "UU" + channelId.slice(2);
  }
  throw new Error("Channel ID inválido. Deve começar com UC");
};

// Busca os últimos vídeos de um canal usando a playlist de uploads
const getLatestChannelVideos = async (
  channelId: string,
  maxResults: number = 5,
) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error(
      "API Key do YouTube não configurada. Configure VITE_YOUTUBE_API_KEY nas secrets do projeto.",
    );
  }

  const playlistId = getUploadPlaylistId(channelId);

  // Buscar mais itens do que o necessário para compensar vídeos privados/excluídos
  const fetchCount = Math.min(maxResults * 2, 25);

  // 1. Buscar últimos vídeos da playlist
  const playlistUrl = new URL(
    "https://www.googleapis.com/youtube/v3/playlistItems",
  );
  playlistUrl.searchParams.append("key", YOUTUBE_API_KEY);
  playlistUrl.searchParams.append("playlistId", playlistId);
  playlistUrl.searchParams.append("part", "snippet,contentDetails,status");
  playlistUrl.searchParams.append("maxResults", fetchCount.toString());

  console.log(`[${channelId}] Fetching playlist ${playlistId} with ${fetchCount} items`);

  const playlistResponse = await fetch(playlistUrl.toString());
  if (!playlistResponse.ok) {
    const errorData = await playlistResponse.json().catch(() => ({}));
    console.error(`[${channelId}] Playlist error:`, errorData);
    
    // Se o canal não existe mais, retornar flag de canal excluído
    if (playlistResponse.status === 404) {
      return { channelDeleted: true, videos: [] };
    }
    
    throw new Error(
      errorData.error?.message ||
        `YouTube API error: ${playlistResponse.status}`,
    );
  }

  const playlistData = await playlistResponse.json();

  if (!playlistData.items || playlistData.items.length === 0) {
    console.log(`[${channelId}] No items in playlist`);
    return { channelDeleted: false, videos: [] };
  }

  console.log(`[${channelId}] Got ${playlistData.items.length} playlist items`);

  // 2. Extrair todos os videoIds primeiro (incluindo potencialmente privados)
  const allVideoIds = playlistData.items
    .map((item: any) => item.contentDetails?.videoId)
    .filter((id: string) => id);

  // 3. Buscar estatísticas de todos os vídeos
  const statsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  statsUrl.searchParams.append("key", YOUTUBE_API_KEY);
  statsUrl.searchParams.append("id", allVideoIds.join(","));
  statsUrl.searchParams.append("part", "statistics,status");

  const statsResponse = await fetch(statsUrl.toString());
  if (!statsResponse.ok) {
    console.error(`[${channelId}] Stats API error: ${statsResponse.status}`);
    throw new Error(`YouTube API error: ${statsResponse.status}`);
  }

  const statsData = await statsResponse.json();
  console.log(`[${channelId}] Got stats for ${statsData.items?.length || 0} videos`);

  // Criar mapa de estatísticas (apenas vídeos que a API retornou = existem)
  const videoStats = (statsData.items || []).reduce((acc: any, item: any) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, any>);

  // 4. Combinar dados - marcar vídeos excluídos
  const allVideos = playlistData.items
    .filter((item: any) => item.contentDetails?.videoId)
    .map((item: any) => {
      const videoId = item.contentDetails.videoId;
      const stats = videoStats[videoId];
      const title = item.snippet?.title || '';
      
      // Verificar se o vídeo foi excluído ou é privado
      const isDeleted = !stats || 
        title === "Private video" || 
        title === "Deleted video" ||
        (stats?.status?.privacyStatus && stats.status.privacyStatus !== 'public');

      return {
        videoId,
        title: isDeleted ? `[EXCLUÍDO] ${title !== "Private video" && title !== "Deleted video" ? title : "Vídeo removido"}` : title,
        thumbnailUrl:
          item.snippet.thumbnails?.maxres?.url ||
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url ||
          '', // Manter vazio se não houver thumbnail
        publishedAt: item.snippet.publishedAt,
        viewCount: stats?.statistics?.viewCount ? parseInt(stats.statistics.viewCount) : 0,
        likeCount: stats?.statistics?.likeCount ? parseInt(stats.statistics.likeCount) : 0,
        commentCount: stats?.statistics?.commentCount ? parseInt(stats.statistics.commentCount) : 0,
        isDeleted,
      };
    })
    .slice(0, maxResults); // Limitar ao número solicitado

  console.log(`[${channelId}] Returning ${allVideos.length} videos (including deleted: ${allVideos.filter((v: any) => v.isDeleted).length})`);

  return { channelDeleted: false, videos: allVideos };
};

const getChannelVideos = async (channelId: string, maxResults: number = 50) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error(
      "API Key do YouTube não configurada. Configure VITE_YOUTUBE_API_KEY nas secrets do projeto.",
    );
  }

  const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
  channelUrl.searchParams.append("key", YOUTUBE_API_KEY);
  channelUrl.searchParams.append("id", channelId);
  channelUrl.searchParams.append("part", "contentDetails");

  const channelResponse = await fetch(channelUrl.toString());
  if (!channelResponse.ok) {
    throw new Error(`YouTube API error: ${channelResponse.status}`);
  }

  const channelData = await channelResponse.json();
  const uploadsPlaylistId =
    channelData.items[0].contentDetails.relatedPlaylists.uploads;

  const playlistUrl = new URL(
    "https://www.googleapis.com/youtube/v3/playlistItems",
  );
  playlistUrl.searchParams.append("key", YOUTUBE_API_KEY);
  playlistUrl.searchParams.append("playlistId", uploadsPlaylistId);
  playlistUrl.searchParams.append("part", "snippet,contentDetails");
  playlistUrl.searchParams.append("maxResults", maxResults.toString());

  const playlistResponse = await fetch(playlistUrl.toString());
  if (!playlistResponse.ok) {
    throw new Error(`YouTube API error: ${playlistResponse.status}`);
  }

  const playlistData = await playlistResponse.json();

  const videoIds = playlistData.items.map(
    (item: any) => item.contentDetails.videoId,
  );
  const statsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  statsUrl.searchParams.append("key", YOUTUBE_API_KEY);
  statsUrl.searchParams.append("id", videoIds.join(","));
  statsUrl.searchParams.append("part", "statistics,contentDetails");

  const statsResponse = await fetch(statsUrl.toString());
  if (!statsResponse.ok) {
    throw new Error(`YouTube API error: ${statsResponse.status}`);
  }

  const statsData = await statsResponse.json();

  const videoStats = statsData.items.reduce((acc: any, item: any) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, any>);

  return playlistData.items.map((item: any) => {
    const stats = videoStats[item.contentDetails.videoId];
    return {
      id: item.contentDetails.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: parseInt(stats.statistics.viewCount || "0"),
      likeCount: parseInt(stats.statistics.likeCount || "0"),
      commentCount: parseInt(stats.statistics.commentCount || "0"),
      duration: stats.contentDetails.duration,
    };
  });
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { action, ...payload } = await req.json();

    switch (action) {
      case "search": {
        const results = await searchYouTube(payload as YouTubeSearchParams);
        return new Response(JSON.stringify(results), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "channelDetails": {
        const { channelId } = payload as { channelId: string };
        const details = await getChannelDetails(channelId);
        return new Response(JSON.stringify(details), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "channelVideos": {
        const { channelId, maxResults } = payload as {
          channelId: string;
          maxResults?: number;
        };
        const videos = await getChannelVideos(channelId, maxResults);
        return new Response(JSON.stringify(videos), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "latestVideos": {
        const { channelIds, maxResults } = payload as {
          channelIds: string[];
          maxResults?: number;
        };
        
        if (!Array.isArray(channelIds) || channelIds.length === 0) {
          return new Response(
            JSON.stringify({ error: "channelIds deve ser um array não vazio" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Processa múltiplos canais
        const results = [];
        for (const channelId of channelIds) {
          try {
            const result = await getLatestChannelVideos(
              channelId,
              maxResults || 5,
            );
            results.push({
              channelId,
              videos: result.videos,
              channelDeleted: result.channelDeleted,
              success: true,
              fetchedAt: new Date().toISOString(),
            });
            // Pequeno delay para evitar rate limit
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (error: any) {
            results.push({
              channelId,
              error: error.message || "Erro desconhecido",
              success: false,
            });
          }
        }

        return new Response(JSON.stringify(results), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      default:
        return new Response(JSON.stringify({ error: "Ação inválida" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (e) {
    console.error("youtube function error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Erro interno ao chamar YouTube",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
