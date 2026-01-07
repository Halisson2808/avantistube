import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'yt_channel_videos_cache';
const MAX_CHANNELS = 400;

export interface CachedVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isViral?: boolean;
  isDeleted?: boolean;
  position?: number;
  duration?: string;
  channelDeleted?: boolean;
}

export interface CachedChannelMeta {
  channelDeleted?: boolean;
  error?: string;
}

export interface CachedChannelData {
  channelId: string;
  videos: CachedVideo[];
  lastFetched: string;
  channelDeleted?: boolean;
  error?: string;
}

interface VideoCache {
  channels: Record<string, CachedChannelData>;
  lastUpdated: string;
}

const getInitialCache = (): VideoCache => {
  try {
    if (typeof window === 'undefined') {
      return { channels: {}, lastUpdated: '' };
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as VideoCache;
    }
  } catch (error) {
    console.error('Erro ao carregar cache de vídeos:', error);
  }
  return { channels: {}, lastUpdated: '' };
};

export function useVideoLocalStorage() {
  const [cache, setCache] = useState<VideoCache>(getInitialCache);
  const [isLoaded, setIsLoaded] = useState(false);
  const cacheRef = useRef(cache);

  // Manter ref atualizada
  useEffect(() => {
    cacheRef.current = cache;
  }, [cache]);

  // Marcar como carregado após montagem
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Salvar no localStorage quando cache mudar
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
      // Se exceder limite, limpar canais antigos
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        const channelIds = Object.keys(cache.channels);
        if (channelIds.length > 50) {
          const sorted = channelIds
            .map(id => ({ id, date: new Date(cache.channels[id].lastFetched).getTime() }))
            .sort((a, b) => b.date - a.date)
            .slice(0, 200);
          
          const trimmedCache: VideoCache = {
            channels: {},
            lastUpdated: new Date().toISOString(),
          };
          sorted.forEach(({ id }) => {
            trimmedCache.channels[id] = cache.channels[id];
          });
          
          setCache(trimmedCache);
        }
      }
    }
  }, [cache, isLoaded]);

  const saveChannelVideos = useCallback((channelId: string, videos: CachedVideo[], meta?: CachedChannelMeta) => {
    setCache(prev => {
      const newChannels = {
        ...prev.channels,
        [channelId]: {
          channelId,
          videos: videos.slice(0, 10),
          lastFetched: new Date().toISOString(),
          channelDeleted: meta?.channelDeleted,
          error: meta?.error,
        },
      };
      
      // Limitar número de canais
      const channelCount = Object.keys(newChannels).length;
      if (channelCount > MAX_CHANNELS) {
        const sorted = Object.entries(newChannels)
          .sort((a, b) => new Date(b[1].lastFetched).getTime() - new Date(a[1].lastFetched).getTime())
          .slice(0, MAX_CHANNELS);
        return {
          channels: Object.fromEntries(sorted),
          lastUpdated: new Date().toISOString(),
        };
      }
      
      return {
        channels: newChannels,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const getChannelVideos = useCallback((channelId: string): CachedChannelData | null => {
    return cacheRef.current.channels[channelId] || null;
  }, []);

  const isCacheValid = useCallback((channelId: string, maxHours: number = 2): boolean => {
    const channelData = cacheRef.current.channels[channelId];
    if (!channelData || !channelData.lastFetched) return false;
    
    const hoursSince = (Date.now() - new Date(channelData.lastFetched).getTime()) / 3600000;
    return hoursSince < maxHours;
  }, []);

  const getAllCachedChannels = useCallback((): CachedChannelData[] => {
    return Object.values(cacheRef.current.channels);
  }, []);

  const removeChannelFromCache = useCallback((channelId: string) => {
    setCache(prev => {
      const newChannels = { ...prev.channels };
      delete newChannels[channelId];
      return {
        channels: newChannels,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const clearCache = useCallback(() => {
    setCache({ channels: {}, lastUpdated: '' });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getCacheSize = useCallback((): { bytes: number; formatted: string } => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const bytes = stored ? new Blob([stored]).size : 0;
      const formatted = bytes < 1024 
        ? `${bytes} B` 
        : bytes < 1048576 
          ? `${(bytes / 1024).toFixed(1)} KB`
          : `${(bytes / 1048576).toFixed(2)} MB`;
      return { bytes, formatted };
    } catch {
      return { bytes: 0, formatted: '0 B' };
    }
  }, []);

  return {
    isLoaded,
    saveChannelVideos,
    getChannelVideos,
    isCacheValid,
    getAllCachedChannels,
    removeChannelFromCache,
    clearCache,
    getCacheSize,
  };
}
