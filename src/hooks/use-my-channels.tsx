/**
 * use-my-channels.tsx
 * "Meus Canais": lista simples dos canais do próprio usuário. Sem nicho, sem
 * tags — só salva e pronto. Mesmo formato visual do Monitoramento (thumb,
 * stats, últimos vídeos), guardado numa tabela separada (my_channels /
 * my_channel_video_cache).
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { getLatestChannelVideos, LatestVideo } from '@/lib/youtube-api';

const API = '/api';

export interface MyChannel {
  id: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail?: string;
  currentSubscribers: number;
  currentViews: number;
  currentVideos: number;
  addedAt: string;
  lastUpdated: string;
}

interface ApiMyChannelRaw {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_thumbnail?: string;
  subscriber_count?: number;
  view_count?: number;
  video_count?: number;
  added_at: string;
  last_updated: string;
}

function mapChannel(raw: ApiMyChannelRaw): MyChannel {
  return {
    id: raw.id,
    channelId: raw.channel_id,
    channelTitle: raw.channel_name,
    channelThumbnail: raw.channel_thumbnail || undefined,
    currentSubscribers: raw.subscriber_count || 0,
    currentViews: raw.view_count || 0,
    currentVideos: raw.video_count || 0,
    addedAt: raw.added_at,
    lastUpdated: raw.last_updated,
  };
}

export interface MyChannelVideo extends LatestVideo {
  channelId: string;
}

export interface MyChannelVideosData {
  channel: MyChannel;
  videos: MyChannelVideo[];
  isLoading: boolean;
  lastFetched?: Date;
  error?: string;
  channelDeleted?: boolean;
}

interface CachedEntry {
  channelId: string;
  videos: MyChannelVideo[];
  lastFetched: string;
  channelDeleted?: boolean;
  error?: string;
}

export const useMyChannels = () => {
  const [channels, setChannels] = useState<MyChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videosData, setVideosData] = useState<Map<string, MyChannelVideosData>>(new Map());
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);
  const cacheRef = useRef<Record<string, CachedEntry>>({});

  const loadChannels = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/my-channels`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: ApiMyChannelRaw[] = await res.json();
      setChannels(data.map(mapChannel));
    } catch (error) {
      console.error('Erro ao carregar meus canais:', error);
      toast.error('Erro ao carregar canais');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCache = useCallback(async () => {
    try {
      const res = await fetch(`${API}/my-videos`);
      if (!res.ok) return;
      const data: Record<string, CachedEntry> = await res.json();
      cacheRef.current = data || {};
    } catch (error) {
      console.error('Erro ao carregar cache de vídeos:', error);
    }
  }, []);

  useEffect(() => {
    loadChannels();
    loadCache();
  }, [loadChannels, loadCache]);

  // Assim que os canais e o cache estiverem prontos, popula a tela com o que
  // já está salvo (sem esperar nenhuma chamada nova ao YouTube).
  useEffect(() => {
    if (isLoading || channels.length === 0) return;
    setVideosData(prev => {
      const next = new Map(prev);
      channels.forEach(channel => {
        if (next.has(channel.channelId)) {
          next.set(channel.channelId, { ...next.get(channel.channelId)!, channel });
          return;
        }
        const cached = cacheRef.current[channel.channelId];
        next.set(channel.channelId, {
          channel,
          videos: cached?.videos || [],
          isLoading: false,
          lastFetched: cached ? new Date(cached.lastFetched) : undefined,
          error: cached?.error,
          channelDeleted: cached?.channelDeleted,
        });
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels, isLoading]);

  const addOneChannel = async (url: string): Promise<{ status: 'added' | 'duplicate'; channelId?: string }> => {
    const res = await fetch(`${API}/my-channels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelInput: url }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 409 || data.error?.includes('already saved')) {
      return { status: 'duplicate' };
    }
    if (!res.ok) throw new Error(data.error || `Erro ao adicionar "${url}"`);
    return { status: 'added', channelId: data.channel?.channel_id };
  };

  const refreshChannel = useCallback(async (channelId: string) => {
    setVideosData(prev => {
      const next = new Map(prev);
      const existing = next.get(channelId);
      if (existing) next.set(channelId, { ...existing, isLoading: true });
      return next;
    });

    try {
      const [statsRes, videoResults] = await Promise.all([
        fetch(`${API}/youtube/my-channel?channelId=${encodeURIComponent(channelId)}`),
        getLatestChannelVideos([channelId], 7),
      ]);

      let updatedChannel: MyChannel | undefined;
      if (statsRes.ok) {
        const info = await statsRes.json();
        updatedChannel = {
          id: '', // preenchido abaixo a partir do estado existente
          channelId,
          channelTitle: info.title,
          channelThumbnail: info.thumbnail,
          currentSubscribers: info.subscriberCount || 0,
          currentViews: info.viewCount || 0,
          currentVideos: info.videoCount || 0,
          addedAt: '',
          lastUpdated: new Date().toISOString(),
        };
      }

      const result = videoResults[0];
      let videos: MyChannelVideo[] = (result?.videos || []).map(v => ({ ...v, channelId }));

      // Canal "caiu" agora (encerrado ou sem vídeos): mantém as últimas thumbs
      // que já tínhamos em cache em vez de apagar — é o retrato de como o
      // canal estava antes de cair.
      if (result?.channelDeleted && videos.length === 0) {
        const previous = cacheRef.current[channelId];
        videos = (previous?.videos || []).map(v => ({ ...v, channelId }));
      }

      cacheRef.current = {
        ...cacheRef.current,
        [channelId]: {
          channelId,
          videos,
          lastFetched: new Date().toISOString(),
          channelDeleted: result?.channelDeleted,
          error: result?.success === false ? result.error : undefined,
        },
      };
      fetch(`${API}/my-videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId,
          videos,
          channelDeleted: !!result?.channelDeleted,
          error: result?.success === false ? result.error : null,
        }),
      }).catch(() => {});

      setChannels(prev => prev.map(ch => {
        if (ch.channelId !== channelId || !updatedChannel) return ch;
        return { ...ch, ...updatedChannel, id: ch.id, addedAt: ch.addedAt };
      }));

      setVideosData(prev => {
        const next = new Map(prev);
        const existing = next.get(channelId);
        if (existing) {
          next.set(channelId, {
            ...existing,
            channel: updatedChannel ? { ...existing.channel, ...updatedChannel, id: existing.channel.id, addedAt: existing.channel.addedAt } : existing.channel,
            videos,
            isLoading: false,
            lastFetched: new Date(),
            channelDeleted: result?.channelDeleted,
            error: result?.success === false ? result.error : undefined,
          });
        }
        return next;
      });
    } catch (error) {
      console.error(`Erro ao atualizar canal ${channelId}:`, error);
      setVideosData(prev => {
        const next = new Map(prev);
        const existing = next.get(channelId);
        if (existing) next.set(channelId, { ...existing, isLoading: false, error: error instanceof Error ? error.message : 'Erro desconhecido' });
        return next;
      });
    }
  }, []);

  const removeChannel = useCallback(async (channelId: string) => {
    try {
      const channel = channels.find(ch => ch.channelId === channelId);
      const id = channel?.id || channelId;
      const res = await fetch(`${API}/my-channels/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      fetch(`${API}/my-videos/${encodeURIComponent(channelId)}`, { method: 'DELETE' }).catch(() => {});
      setChannels(prev => prev.filter(ch => ch.channelId !== channelId));
      setVideosData(prev => {
        const next = new Map(prev);
        next.delete(channelId);
        return next;
      });
      toast.success('Canal removido');
    } catch (error) {
      console.error('Erro ao remover canal:', error);
      toast.error('Erro ao remover canal');
    }
  }, [channels]);

  const updateAllChannels = useCallback(async () => {
    if (channels.length === 0) return;
    setIsUpdatingAll(true);
    const batchSize = 10;
    for (let i = 0; i < channels.length; i += batchSize) {
      const batch = channels.slice(i, i + batchSize);
      await Promise.all(batch.map(ch => refreshChannel(ch.channelId)));
    }
    setIsUpdatingAll(false);
    toast.success('Canais atualizados!');
  }, [channels, refreshChannel]);

  return {
    channels,
    isLoading,
    videosData,
    isUpdatingAll,
    loadChannels,
    addOneChannel,
    refreshChannel,
    removeChannel,
    updateAllChannels,
  };
};
