/**
 * use-monitored-channels.tsx
 * Busca canais monitorados via /api com cache instantâneo SWR (Stale-While-Revalidate).
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const API = '/api';
const CHANNELS_CACHE_KEY = 'avantistube_cached_channels_v2';

export interface ChannelMonitorData {
  id: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail?: string;
  currentSubscribers: number;
  currentViews: number;
  currentVideos: number;
  initialSubscribers: number;
  initialViews: number;
  addedAt: string;
  lastUpdated: string;
  subscribersLast7Days?: number;
  viewsLast7Days?: number;
  subscribersLastDay?: number;
  viewsLastDay?: number;
  isExploding?: boolean;
  niche?: string;
  notes?: string;
  contentType?: 'longform' | 'shorts';
  /** Canal próprio (aba "Meus Canais"), sem nicho/tags — mesma tabela do Monitoramento. */
  isOwnChannel?: boolean;
}

interface ApiChannelRaw {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_thumbnail?: string;
  subscriber_count?: number;
  view_count?: number;
  video_count?: number;
  initial_subscribers?: number;
  initial_views?: number;
  added_at: string;
  last_updated: string;
  niche?: string;
  notes?: string;
  content_type?: 'longform' | 'shorts';
  subscribers_last_7_days?: number;
  views_last_7_days?: number;
  is_exploding?: boolean;
  is_own_channel?: boolean;
}

// Mapeia o formato do servidor para o formato do componente
function mapChannel(raw: ApiChannelRaw): ChannelMonitorData {
  return {
    id: raw.id,
    channelId: raw.channel_id,
    channelTitle: raw.channel_name,
    channelThumbnail: raw.channel_thumbnail || undefined,
    currentSubscribers: raw.subscriber_count || 0,
    currentViews: raw.view_count || 0,
    currentVideos: raw.video_count || 0,
    initialSubscribers: raw.initial_subscribers || raw.subscriber_count || 0,
    initialViews: raw.initial_views || raw.view_count || 0,
    addedAt: raw.added_at,
    lastUpdated: raw.last_updated,
    niche: raw.niche || undefined,
    notes: raw.notes || undefined,
    contentType: (raw.content_type as 'longform' | 'shorts') || 'longform',
    subscribersLast7Days: raw.subscribers_last_7_days ?? 0,
    viewsLast7Days: raw.views_last_7_days ?? 0,
    isExploding: raw.is_exploding ?? false,
    isOwnChannel: raw.is_own_channel ?? false,
  };
}

// Ordena por addedAt decrescente (mais novos adicionados primeiro)
function sortNewestFirst(list: ChannelMonitorData[]): ChannelMonitorData[] {
  return [...list].sort(
    (a, b) => new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime()
  );
}

// Carrega cache síncrono do localStorage para render instantâneo (0ms)
function getInitialCachedChannels(): ChannelMonitorData[] {
  try {
    const cached = localStorage.getItem(CHANNELS_CACHE_KEY);
    if (cached) {
      const parsed: ChannelMonitorData[] = JSON.parse(cached);
      return sortNewestFirst(parsed);
    }
  } catch {}
  return [];
}

export const useMonitoredChannels = () => {
  const [channels, setChannels] = useState<ChannelMonitorData[]>(getInitialCachedChannels);
  const [isLoading, setIsLoading] = useState<boolean>(() => channels.length === 0);
  const [serverOnline, setServerOnline] = useState(true);

  const loadChannels = useCallback(async () => {
    try {
      const res = await fetch(`${API}/channels`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: ApiChannelRaw[] = await res.json();
      const mapped = sortNewestFirst(data.map(mapChannel));
      
      setChannels(mapped);
      setServerOnline(true);
      try {
        localStorage.setItem(CHANNELS_CACHE_KEY, JSON.stringify(mapped));
      } catch {}
    } catch (error) {
      console.error('Erro ao carregar canais:', error);
      setServerOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const addChannel = async (_channel?: ChannelMonitorData) => {
    await loadChannels();
  };

  const updateChannel = async (channelId: string, updates: Partial<ChannelMonitorData>) => {
    // Atualização otimista imediata na UI
    setChannels((prev) =>
      prev.map((ch) => (ch.channelId === channelId ? { ...ch, ...updates } : ch))
    );

    try {
      const raw: Record<string, string | number | undefined> = {};
      if (updates.channelTitle !== undefined) raw.channel_name = updates.channelTitle;
      if (updates.channelThumbnail !== undefined) raw.channel_thumbnail = updates.channelThumbnail;
      if (updates.currentSubscribers !== undefined) raw.subscriber_count = updates.currentSubscribers;
      if (updates.currentViews !== undefined) raw.view_count = updates.currentViews;
      if (updates.currentVideos !== undefined) raw.video_count = updates.currentVideos;
      if (updates.niche !== undefined) raw.niche = updates.niche;
      if (updates.contentType !== undefined) raw.content_type = updates.contentType;
      if (updates.notes !== undefined) raw.notes = updates.notes;

      const res = await fetch(`${API}/channels/${channelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(raw),
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      await loadChannels();
    } catch (error) {
      console.error('Erro ao atualizar canal:', error);
      toast.error('Erro ao atualizar canal');
    }
  };

  const removeChannel = async (channelId: string) => {
    // Remoção otimista imediata na UI
    setChannels((prev) => prev.filter((ch) => ch.channelId !== channelId));

    try {
      const res = await fetch(`${API}/channels/${channelId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      await loadChannels();
      toast.success('Canal removido');
    } catch (error) {
      console.error('Erro ao remover canal:', error);
      toast.error('Erro ao remover canal');
    }
  };

  const updateNiche = async (channelId: string, niche: string) => {
    const normalized = niche.trim()
      ? niche.trim().charAt(0).toUpperCase() + niche.trim().slice(1).toLowerCase()
      : niche;
    await updateChannel(channelId, { niche: normalized });
    toast.success('Nicho atualizado!');
  };

  const updateContentType = async (channelId: string, contentType: 'longform' | 'shorts') => {
    await updateChannel(channelId, { contentType });
    toast.success('Tipo de conteúdo atualizado!');
  };

  const updateNotes = async (channelId: string, notes: string) => {
    await updateChannel(channelId, { notes });
  };

  const updateChannelStats = async (channelId: string) => {
    toast.info('Atualizando estatísticas...');
    try {
      const res = await fetch(`${API}/youtube/channel?channelId=${channelId}`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      await loadChannels();
      toast.success('Estatísticas atualizadas!');
    } catch (error) {
      console.error('Erro ao atualizar stats:', error);
      toast.error('Erro ao atualizar estatísticas');
    }
  };

  return {
    channels,
    isLoading,
    serverOnline,
    loadChannels,
    addChannel,
    updateChannel,
    removeChannel,
    updateNiche,
    updateNotes,
    updateChannelStats,
    updateContentType,
  };
};