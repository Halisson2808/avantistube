import { useState } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from './use-local-storage';
import { getChannelDetails } from '@/lib/youtube-api';

export interface MyChannelData {
  id: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail?: string;
  currentSubscribers: number;
  currentViews: number;
  initialSubscribers: number;
  initialViews: number;
  niche: string;
  language: string;
  notes?: string;
  addedAt: string;
  lastUpdated: string;
}

export const useMyChannels = () => {
  const [channels, setChannels] = useLocalStorage<MyChannelData[]>('my-channels', []);
  const [isLoading, setIsLoading] = useState(false);

  const addChannel = async (channel: MyChannelData) => {
    const newChannel = {
      ...channel,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setChannels([...channels, newChannel]);
    toast.success('Canal adicionado com sucesso!');
  };

  const updateChannel = async (channelId: string, updates: Partial<MyChannelData>) => {
    setChannels(channels.map(ch =>
      ch.id === channelId
        ? { ...ch, ...updates, lastUpdated: new Date().toISOString() }
        : ch
    ));
    toast.success('Canal atualizado!');
  };

  const removeChannel = async (channelId: string) => {
    setChannels(channels.filter(ch => ch.id !== channelId));
    toast.success('Canal removido!');
  };

  const updateChannelStats = async (channelId: string, forceUpdate: boolean = false) => {
    const channel = channels.find(ch => ch.id === channelId);
    if (!channel) return;

    const lastUpdate = new Date(channel.lastUpdated);
    const hoursSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    if (!forceUpdate && hoursSinceUpdate < 24) {
      toast.info(`Aguarde ${Math.ceil(24 - hoursSinceUpdate)}h para atualizar`);
      return;
    }

    toast.info('Buscando dados atualizados...');
    
    try {
      const freshData = await getChannelDetails(channel.channelId);

      await updateChannel(channelId, {
        currentSubscribers: freshData.subscriberCount,
        currentViews: freshData.viewCount,
        channelThumbnail: freshData.thumbnail,
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
    updateChannelStats,
    refreshChannels: () => {},
  };
};
