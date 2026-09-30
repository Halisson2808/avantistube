import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchJsonWithDeadline } from '@/lib/youtube-feed';

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
  channelExists?: boolean;
  error?: string;
}
export interface CachedChannelData extends CachedChannelMeta {
  channelId: string;
  videos: CachedVideo[];
  lastFetched: string;
}
type CacheMap = Record<string, CachedChannelData>;
const CACHE_CHANGED = 'avantis-monitoring-videos-changed';

// Feed, Monitoramento e Meus Canais leem a mesma tabela. Ler não consulta o YouTube.
export function useVideoStorage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [revision, setRevision] = useState(0);
  const cacheRef = useRef<CacheMap>({});
  const requestRef = useRef(0);

  const reloadVideos = useCallback(async () => {
    const request = ++requestRef.current;
    try {
      const data = await fetchJsonWithDeadline<CacheMap>('/api/videos');
      if (request !== requestRef.current) return;
      cacheRef.current = data || {};
      setRevision(n => n + 1);
      setLoadError(false);
    } catch {
      if (request === requestRef.current) setLoadError(true);
    } finally {
      if (request === requestRef.current) setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const requests = requestRef;
    void reloadVideos();
    const reload = () => { void reloadVideos(); };
    window.addEventListener(CACHE_CHANGED, reload);
    window.addEventListener('focus', reload);
    return () => {
      requests.current++;
      window.removeEventListener(CACHE_CHANGED, reload);
      window.removeEventListener('focus', reload);
    };
  }, [reloadVideos]);

  const saveChannelVideos = useCallback(async (channelId: string, videos: CachedVideo[], meta?: CachedChannelMeta) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch('/api/videos', {
        method: 'POST', signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, videos, channelDeleted: meta?.channelDeleted ?? false,
          channelExists: meta?.channelExists ?? true, error: meta?.error ?? null }),
      });
      if (!response.ok) throw new Error('Não foi possível salvar os vídeos no banco de dados.');
      cacheRef.current = { ...cacheRef.current, [channelId]: {
        channelId, videos, lastFetched: new Date().toISOString(), ...meta,
      } };
      setRevision(n => n + 1);
      window.dispatchEvent(new Event(CACHE_CHANGED));
    } finally {
      clearTimeout(timer);
    }
  }, []);

  const getChannelVideos = useCallback((channelId: string) => cacheRef.current[channelId] || null, []);
  const isCacheValid = useCallback((channelId: string, maxHours = 2) => {
    const data = cacheRef.current[channelId];
    return !!data?.lastFetched && Date.now() - Date.parse(data.lastFetched) < maxHours * 3_600_000;
  }, []);
  const getAllCachedChannels = useCallback(() => { void revision; return Object.values(cacheRef.current); }, [revision]);
  const removeChannelFromCache = useCallback((channelId: string) => {
    const next = { ...cacheRef.current };
    delete next[channelId];
    cacheRef.current = next;
    setRevision(n => n + 1);
    void fetch(`/api/videos/${encodeURIComponent(channelId)}`, { method: 'DELETE' });
  }, []);
  const clearCache = useCallback(() => { cacheRef.current = {}; setRevision(n => n + 1); }, []);
  const getCacheSize = useCallback(() => {
    const bytes = new Blob([JSON.stringify(cacheRef.current)]).size;
    return { bytes, formatted: bytes < 1024 ? `${bytes} B` : bytes < 1048576
      ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB` };
  }, []);
  return { isLoaded, loadError, reloadVideos, saveChannelVideos, getChannelVideos, isCacheValid,
    getAllCachedChannels, removeChannelFromCache, clearCache, getCacheSize };
}
