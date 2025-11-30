import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
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

// Migração de dados antigos
const migrateLegacyData = (oldData: any[]): MyChannelData[] => {
  if (!oldData || !Array.isArray(oldData)) return [];
  
  return oldData.map(item => ({
    id: item.id || crypto.randomUUID(),
    channelId: item.channel_id || item.channelId,
    channelTitle: item.channel_title || item.channelTitle,
    channelThumbnail: item.channel_thumbnail || item.channelThumbnail,
    currentSubscribers: item.current_subscribers || item.currentSubscribers || 0,
    currentViews: item.current_views || item.currentViews || 0,
    initialSubscribers: item.initial_subscribers || item.initialSubscribers || 0,
    initialViews: item.initial_views || item.initialViews || 0,
    niche: item.niche || 'Outro',
    language: item.language || 'pt-BR',
    notes: item.notes || '',
    addedAt: item.added_at || item.addedAt || new Date().toISOString(),
    lastUpdated: item.last_updated || item.lastUpdated || new Date().toISOString(),
  }));
};

export const useMyChannels = () => {
  const [channels, setChannels] = useLocalStorage<MyChannelData[]>('my-channels', []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);

  // Migração automática na primeira carga
  useEffect(() => {
    if (hasMigrated) return;
    
    try {
      const legacyData = localStorage.getItem('youtube_tracker_data');
      if (legacyData && channels.length === 0) {
        const parsed = JSON.parse(legacyData);
        const migrated = migrateLegacyData(parsed);
        if (migrated.length > 0) {
          setChannels(migrated);
          toast({
            title: "Dados migrados",
            description: `${migrated.length} canais foram migrados com sucesso.`,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao migrar dados:', error);
    }
    
    setHasMigrated(true);
  }, []);

  const addChannel = async (channel: MyChannelData) => {
    // Verifica duplicatas
    const isDuplicate = channels.some(ch => ch.channelId === channel.channelId);
    if (isDuplicate) {
      toast({
        variant: "destructive",
        title: "Canal duplicado",
        description: "Este canal já está na sua lista.",
      });
      return;
    }

    const newChannel = {
      ...channel,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    
    setChannels([...channels, newChannel]);
    toast({
      title: "Canal adicionado!",
      description: `${channel.channelTitle} foi adicionado com sucesso.`,
    });
  };

  const updateChannel = async (channelId: string, updates: Partial<MyChannelData>) => {
    setChannels(channels.map(ch =>
      ch.id === channelId
        ? { ...ch, ...updates, lastUpdated: new Date().toISOString() }
        : ch
    ));
    toast({
      title: "Canal atualizado!",
      description: "As alterações foram salvas.",
    });
  };

  const removeChannel = async (channelId: string) => {
    const channel = channels.find(ch => ch.id === channelId);
    setChannels(channels.filter(ch => ch.id !== channelId));
    toast({
      title: "Canal removido",
      description: `${channel?.channelTitle} foi removido da lista.`,
    });
  };

  const updateChannelStats = async (channelId: string, forceUpdate: boolean = false) => {
    const channel = channels.find(ch => ch.id === channelId);
    if (!channel) return;

    const lastUpdate = new Date(channel.lastUpdated);
    const hoursSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    if (!forceUpdate && hoursSinceUpdate < 24) {
      const hoursRemaining = Math.ceil(24 - hoursSinceUpdate);
      toast({
        title: "Atualização bloqueada",
        description: `Aguarde ${hoursRemaining}h para atualizar novamente.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const freshData = await getChannelDetails(channel.channelId);

      await updateChannel(channelId, {
        currentSubscribers: freshData.subscriberCount,
        currentViews: freshData.viewCount,
        channelThumbnail: freshData.thumbnail,
      });

      toast({
        title: "Estatísticas atualizadas!",
        description: `${channel.channelTitle} foi atualizado com sucesso.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível buscar os dados atualizados.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUniqueNiches = (): string[] => {
    const niches = channels
      .map(ch => ch.niche)
      .filter(n => n && n.trim().length > 0)
      .map(n => n.toLowerCase());
    
    const uniqueNiches = Array.from(new Set(niches));
    return uniqueNiches.sort((a, b) => a.localeCompare(b));
  };

  const refreshChannels = () => {
    // Placeholder para funcionalidade futura
    toast({
      title: "Atualizando...",
      description: "Verificando canais...",
    });
  };

  return {
    channels,
    isLoading,
    addChannel,
    updateChannel,
    removeChannel,
    updateChannelStats,
    getUniqueNiches,
    refreshChannels,
  };
};
