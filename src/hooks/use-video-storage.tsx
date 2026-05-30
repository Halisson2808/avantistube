/**
 * use-video-storage.tsx
 * Cache dos vídeos recentes guardado no Supabase (via /api), com cópia em
 * memória para leitura síncrona. Substitui o antigo cache em localStorage —
 * agora os vídeos/thumbs sincronizam entre PC e celular.
 *
 * Mantém a MESMA interface do hook antigo (use-video-local-storage) para o
 * restante do código continuar funcionando sem alterações.
 */
import { useState, useEffect, useCallback, useRef } from 'react';

const API = '/api';

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

type CacheMap = Record<string, CachedChannelData>;

export function useVideoStorage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const cacheRef = useRef<CacheMap>({});
  const [, force] = useState(0);
  const rerender = () => force(n => n + 1);

  // Carrega tudo do banco na inicialização
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API}/videos`);
        if (res.ok) {
          const data: CacheMap = await res.json();
          if (active) cacheRef.current = data || {};
        }
      } catch (err) {
        console.error('Erro ao carregar cache de vídeos:', err);
      } finally {
        if (active) {
          setIsLoaded(true);
          rerender();
        }
      }
    })();
    return () => { active = false; };
  }, []);

  const saveChannelVideos = useCallback((channelId: string, videos: CachedVideo[], meta?: CachedChannelMeta) => {
    const trimmed = videos.slice(0, 7);
    // Atualiza memória imediatamente (otimista)
    cacheRef.current = {
      ...cacheRef.current,
      [channelId]: {
        channelId,
        videos: trimmed,
        lastFetched: new Date().toISOString(),
        channelDeleted: meta?.channelDeleted,
        error: meta?.error,
      },
    };
    rerender();
    // Persiste no banco
    fetch(`${API}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channelId,
        videos: trimmed,
        channelDeleted: meta?.channelDeleted ?? false,
        error: meta?.error ?? null,
      }),
    }).catch(err => console.error('Erro ao salvar vídeos:', err));
  }, []);

  const getChannelVideos = useCallback((channelId: string): CachedChannelData | null => {
    return cacheRef.current[channelId] || null;
  }, []);

  const isCacheValid = useCallback((channelId: string, maxHours: number = 2): boolean => {
    const data = cacheRef.current[channelId];
    if (!data || !data.lastFetched) return false;
    const hoursSince = (Date.now() - new Date(data.lastFetched).getTime()) / 3600000;
    return hoursSince < maxHours;
  }, []);

  const getAllCachedChannels = useCallback((): CachedChannelData[] => {
    return Object.values(cacheRef.current);
  }, []);

  const removeChannelFromCache = useCallback((channelId: string) => {
    const next = { ...cacheRef.current };
    delete next[channelId];
    cacheRef.current = next;
    rerender();
    fetch(`${API}/videos/${encodeURIComponent(channelId)}`, { method: 'DELETE' })
      .catch(err => console.error('Erro ao remover vídeos:', err));
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current = {};
    rerender();
  }, []);

  const getCacheSize = useCallback((): { bytes: number; formatted: string } => {
    const bytes = new Blob([JSON.stringify(cacheRef.current)]).size;
    const formatted = bytes < 1024
      ? `${bytes} B`
      : bytes < 1048576
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / 1048576).toFixed(2)} MB`;
    return { bytes, formatted };
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
