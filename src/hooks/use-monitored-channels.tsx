/**
 * use-monitored-channels.tsx
 * Busca canais monitorados do servidor local (http://localhost:3001)
 * que salva os dados em data/channels.json — sem Docker, sem Supabase.
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const API = 'http://localhost:3001/api';

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
  // Métricas calculadas (opcionais - derivadas dos vídeos)
  subscribersLast7Days?: number;
  viewsLast7Days?: number;
  subscribersLastDay?: number;
  viewsLastDay?: number;
  isExploding?: boolean;
  niche?: string;
  contentType?: 'longform' | 'shorts';
}

// Mapeia o formato do servidor para o formato do componente
function mapChannel(raw: any): ChannelMonitorData {
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
    contentType: (raw.content_type as 'longform' | 'shorts') || 'longform',
  };
}

export const useMonitoredChannels = () => {
  const [channels, setChannels] = useState<ChannelMonitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(true);

  const loadChannels = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/channels`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: any[] = await res.json();
      setChannels(data.map(mapChannel));
      setServerOnline(true);
    } catch (error) {
      console.error('Erro ao carregar canais:', error);
      setServerOnline(false);
      toast.error('Servidor local offline. Execute npm run dev para iniciá-lo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const addChannel = async (channel: ChannelMonitorData) => {
    await loadChannels();
  };

  const updateChannel = async (channelId: string, updates: Partial<ChannelMonitorData>) => {
    try {
      const raw: any = {};
      if (updates.channelTitle !== undefined) raw.channel_name = updates.channelTitle;
      if (updates.channelThumbnail !== undefined) raw.channel_thumbnail = updates.channelThumbnail;
      if (updates.currentSubscribers !== undefined) raw.subscriber_count = updates.currentSubscribers;
      if (updates.currentViews !== undefined) raw.view_count = updates.currentViews;
      if (updates.currentVideos !== undefined) raw.video_count = updates.currentVideos;
      if (updates.niche !== undefined) raw.niche = updates.niche;
      if (updates.contentType !== undefined) raw.content_type = updates.contentType;

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
    await updateChannel(channelId, { niche: normalized } as any);
    toast.success('Nicho atualizado!');
  };

  const updateContentType = async (channelId: string, contentType: 'longform' | 'shorts') => {
    await updateChannel(channelId, { contentType } as any);
    toast.success('Tipo de conteúdo atualizado!');
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
    updateChannelStats,
    updateContentType,
  };
};