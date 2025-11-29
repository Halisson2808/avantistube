import { useState } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from './use-local-storage';
import { getChannelDetails } from '@/lib/youtube-api';

export interface ChannelMonitorData {
  id: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail?: string;
  currentSubscribers: number;
  currentViews: number;
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
}

interface ChannelHistory {
  channelId: string;
  subscribers: number;
  views: number;
  videoCount: number;
  recordedAt: string;
}

export const useMonitoredChannels = () => {
  const [channels, setChannels] = useLocalStorage<ChannelMonitorData[]>('monitored-channels', []);
  const [history, setHistory] = useLocalStorage<ChannelHistory[]>('channel-history', []);
  const [isLoading, setIsLoading] = useState(false);

  const addChannel = async (channel: ChannelMonitorData) => {
    const newChannel = {
      ...channel,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    setChannels([...channels, newChannel]);

    setHistory([...history, {
      channelId: channel.channelId,
      subscribers: channel.initialSubscribers,
      views: channel.initialViews,
      videoCount: 0,
      recordedAt: new Date().toISOString(),
    }]);

    toast.success('Canal adicionado ao monitoramento!');
  };

  const updateChannel = async (channelId: string, updates: Partial<ChannelMonitorData>) => {
    setChannels(channels.map(ch =>
      ch.channelId === channelId
        ? { ...ch, ...updates, lastUpdated: new Date().toISOString() }
        : ch
    ));
  };

  const removeChannel = async (channelId: string) => {
    setChannels(channels.filter(ch => ch.channelId !== channelId));
    toast.success('Canal removido do monitoramento!');
  };

  const updateNotes = async (channelId: string, notes: string) => {
    await updateChannel(channelId, { notes });
  };

  const updateNiche = async (channelId: string, niche: string) => {
    await updateChannel(channelId, { niche });
  };

  const updateChannelStats = async (channelId: string) => {
    const channel = channels.find(ch => ch.channelId === channelId);
    if (!channel) return;

    toast.info('Atualizando estatísticas...');

    const now = new Date();

    try {
      const freshData = await getChannelDetails(channelId);

      setHistory([...history, {
        channelId,
        subscribers: freshData.subscriberCount,
        views: freshData.viewCount,
        videoCount: freshData.videoCount,
        recordedAt: new Date().toISOString(),
      }]);

      const channelHistory = history.filter(h => h.channelId === channelId);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentHistory7d = channelHistory.filter(h => new Date(h.recordedAt) >= sevenDaysAgo);
      const recentHistory1d = channelHistory.filter(h => new Date(h.recordedAt) >= oneDayAgo);

      let subscribersLast7Days = 0;
      let viewsLast7Days = 0;
      let subscribersLastDay = 0;
      let viewsLastDay = 0;

      if (recentHistory7d.length > 0) {
        const oldest = recentHistory7d[0];
        subscribersLast7Days = freshData.subscriberCount - oldest.subscribers;
        viewsLast7Days = freshData.viewCount - oldest.views;
      }

      if (recentHistory1d.length > 0) {
        const oldest = recentHistory1d[0];
        subscribersLastDay = freshData.subscriberCount - oldest.subscribers;
        viewsLastDay = freshData.viewCount - oldest.views;
      }

      const isExploding = subscribersLast7Days > (channel.currentSubscribers * 0.1);

      await updateChannel(channelId, {
        currentSubscribers: freshData.subscriberCount,
        currentViews: freshData.viewCount,
        channelThumbnail: freshData.thumbnail,
        subscribersLast7Days,
        viewsLast7Days,
        subscribersLastDay,
        viewsLastDay,
        isExploding,
      });

      toast.success('Estatísticas atualizadas!');
    } catch (error) {
      toast.error('Erro ao atualizar estatísticas');
      console.error(error);
    }
  };

  return {
    channels,
    isLoading,
    addChannel,
    updateChannel,
    removeChannel,
    updateNotes,
    updateNiche,
    updateChannelStats,
  };
};
