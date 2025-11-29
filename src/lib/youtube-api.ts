const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

if (!YOUTUBE_API_KEY) {
  console.error('VITE_YOUTUBE_API_KEY não está configurada. Configure no arquivo .env');
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
  const {
    q, type = 'video', maxResults = 50, order = 'relevance',
    videoDuration, videoDefinition, publishedAfter, publishedBefore,
  } = params;

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.append('key', YOUTUBE_API_KEY);
  url.searchParams.append('q', q);
  url.searchParams.append('type', type);
  url.searchParams.append('part', 'snippet');
  url.searchParams.append('maxResults', maxResults.toString());
  url.searchParams.append('order', order);

  if (videoDuration) url.searchParams.append('videoDuration', videoDuration);
  if (videoDefinition) url.searchParams.append('videoDefinition', videoDefinition);
  if (publishedAfter) url.searchParams.append('publishedAfter', publishedAfter);
  if (publishedBefore) url.searchParams.append('publishedBefore', publishedBefore);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);

  const data = await response.json();

  const videoIds = data.items.filter((item: any) => item.id.videoId).map((item: any) => item.id.videoId);
  let videoStats: any = {};

  if (videoIds.length > 0) {
    const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    statsUrl.searchParams.append('key', YOUTUBE_API_KEY);
    statsUrl.searchParams.append('id', videoIds.join(','));
    statsUrl.searchParams.append('part', 'statistics,contentDetails');

    const statsResponse = await fetch(statsUrl.toString());
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      videoStats = statsData.items.reduce((acc: any, item: any) => {
        acc[item.id] = item;
        return acc;
      }, {});
    }
  }

  const channelIds = [...new Set(data.items.map((item: any) => item.snippet.channelId))];
  let channelStats: any = {};

  if (channelIds.length > 0) {
    const channelUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
    channelUrl.searchParams.append('key', YOUTUBE_API_KEY);
    channelUrl.searchParams.append('id', channelIds.join(','));
    channelUrl.searchParams.append('part', 'statistics,snippet');

    const channelResponse = await fetch(channelUrl.toString());
    if (channelResponse.ok) {
      const channelData = await channelResponse.json();
      channelStats = channelData.items.reduce((acc: any, item: any) => {
        acc[item.id] = item;
        return acc;
      }, {});
    }
  }

  return data.items.map((item: any) => {
    const stats = videoStats[item.id.videoId] || {};
    const channel = channelStats[item.snippet.channelId] || {};

    return {
      id: item.id.videoId || item.id.channelId,
      type: item.id.kind.includes('video') ? 'video' : 'channel',
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: stats.statistics?.viewCount || '0',
      likeCount: stats.statistics?.likeCount || '0',
      commentCount: stats.statistics?.commentCount || '0',
      subscriberCount: channel.statistics?.subscriberCount || '0',
      videoCount: channel.statistics?.videoCount || '0',
      duration: stats.contentDetails?.duration || '',
    };
  });
};

export const getChannelDetails = async (channelId: string) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error('API Key do YouTube não configurada. Configure VITE_YOUTUBE_API_KEY no arquivo .env');
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/channels');
  url.searchParams.append('key', YOUTUBE_API_KEY);
  url.searchParams.append('id', channelId);
  url.searchParams.append('part', 'snippet,statistics,contentDetails');

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `YouTube API error: ${response.status}`);
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

export const getChannelVideos = async (channelId: string, maxResults: number = 50) => {
  const channelUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
  channelUrl.searchParams.append('key', YOUTUBE_API_KEY);
  channelUrl.searchParams.append('id', channelId);
  channelUrl.searchParams.append('part', 'contentDetails');

  const channelResponse = await fetch(channelUrl.toString());
  if (!channelResponse.ok) throw new Error(`YouTube API error: ${channelResponse.status}`);

  const channelData = await channelResponse.json();
  const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

  const playlistUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  playlistUrl.searchParams.append('key', YOUTUBE_API_KEY);
  playlistUrl.searchParams.append('playlistId', uploadsPlaylistId);
  playlistUrl.searchParams.append('part', 'snippet,contentDetails');
  playlistUrl.searchParams.append('maxResults', maxResults.toString());

  const playlistResponse = await fetch(playlistUrl.toString());
  if (!playlistResponse.ok) throw new Error(`YouTube API error: ${playlistResponse.status}`);

  const playlistData = await playlistResponse.json();

  const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId);
  const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
  statsUrl.searchParams.append('key', YOUTUBE_API_KEY);
  statsUrl.searchParams.append('id', videoIds.join(','));
  statsUrl.searchParams.append('part', 'statistics,contentDetails');

  const statsResponse = await fetch(statsUrl.toString());
  const statsData = await statsResponse.json();

  const videoStats = statsData.items.reduce((acc: any, item: any) => {
    acc[item.id] = item;
    return acc;
  }, {});

  return playlistData.items.map((item: any) => {
    const stats = videoStats[item.contentDetails.videoId];
    return {
      id: item.contentDetails.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: parseInt(stats.statistics.viewCount || '0'),
      likeCount: parseInt(stats.statistics.likeCount || '0'),
      commentCount: parseInt(stats.statistics.commentCount || '0'),
      duration: stats.contentDetails.duration,
    };
  });
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
