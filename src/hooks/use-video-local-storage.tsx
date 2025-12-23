import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'yt_channel_videos_cache';
const MAX_CHANNELS = 400; // Limite de segurança

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
}

export interface CachedChannelData {
  channelId: string;
  videos: CachedVideo[];
  lastFetched: string; // ISO date string
}

interface VideoCache {
  channels: Record<string, CachedChannelData>;
  lastUpdated: string;
}

export function useVideoLocalStorage() {
  const [cache, setCache] = useState<VideoCache>({ channels: {}, lastUpdated: '' });
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar cache do localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as VideoCache;
        setCache(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar cache de vídeos:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salvar cache no localStorage quando mudar
  const saveToStorage = useCallback((newCache: VideoCache) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCache));
    } catch (error) {
      console.error('Erro ao salvar cache de vídeos:', error);
      // Se exceder limite, limpar canais mais antigos
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        const channelIds = Object.keys(newCache.channels);
        if (channelIds.length > 50) {
          // Manter apenas os 200 canais mais recentes
          const sorted = channelIds
            .map(id => ({ id, date: new Date(newCache.channels[id].lastFetched).getTime() }))
            .sort((a, b) => b.date - a.date)
            .slice(0, 200);
          
          const trimmedCache: VideoCache = {
            channels: {},
            lastUpdated: new Date().toISOString(),
          };
          
          sorted.forEach(({ id }) => {
            trimmedCache.channels[id] = newCache.channels[id];
          });
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedCache));
          setCache(trimmedCache);
        }
      }
    }
  }, []);

  // Salvar vídeos de um canal
  const saveChannelVideos = useCallback((channelId: string, videos: CachedVideo[]) => {
    setCache(prev => {
      const newCache: VideoCache = {
        ...prev,
        channels: {
          ...prev.channels,
          [channelId]: {
            channelId,
            videos: videos.slice(0, 10), // Limitar a 10 vídeos por canal
            lastFetched: new Date().toISOString(),
          },
        },
        lastUpdated: new Date().toISOString(),
      };
      
      // Verificar limite de canais
      const channelCount = Object.keys(newCache.channels).length;
      if (channelCount > MAX_CHANNELS) {
        // Remover canais mais antigos
        const sorted = Object.entries(newCache.channels)
          .sort((a, b) => new Date(b[1].lastFetched).getTime() - new Date(a[1].lastFetched).getTime())
          .slice(0, MAX_CHANNELS);
        
        newCache.channels = Object.fromEntries(sorted);
      }
      
      saveToStorage(newCache);
      return newCache;
    });
  }, [saveToStorage]);

  // Obter vídeos de um canal
  const getChannelVideos = useCallback((channelId: string): CachedChannelData | null => {
    return cache.channels[channelId] || null;
  }, [cache]);

  // Verificar se cache de um canal está válido (menos de X horas)
  const isCacheValid = useCallback((channelId: string, maxHours: number = 2): boolean => {
    const channelData = cache.channels[channelId];
    if (!channelData || !channelData.lastFetched) return false;
    
    const hoursSince = (Date.now() - new Date(channelData.lastFetched).getTime()) / 3600000;
    return hoursSince < maxHours;
  }, [cache]);

  // Obter todos os vídeos em cache
  const getAllCachedChannels = useCallback((): CachedChannelData[] => {
    return Object.values(cache.channels);
  }, [cache]);

  // Remover canal do cache
  const removeChannelFromCache = useCallback((channelId: string) => {
    setCache(prev => {
      const newChannels = { ...prev.channels };
      delete newChannels[channelId];
      
      const newCache: VideoCache = {
        channels: newChannels,
        lastUpdated: new Date().toISOString(),
      };
      
      saveToStorage(newCache);
      return newCache;
    });
  }, [saveToStorage]);

  // Limpar todo o cache
  const clearCache = useCallback(() => {
    const emptyCache: VideoCache = { channels: {}, lastUpdated: '' };
    setCache(emptyCache);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Obter tamanho aproximado do cache
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
