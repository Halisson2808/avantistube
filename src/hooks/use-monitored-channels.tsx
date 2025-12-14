import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
}

export const useMonitoredChannels = () => {
  const [channels, setChannels] = useState<ChannelMonitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load channels from Supabase
  const loadChannels = async () => {
    setIsLoading(true);
    try {
      const { data: monitoredData, error: monitoredError } = await supabase
        .from('monitored_channels')
        .select('*')
        .order('added_at', { ascending: false });

      if (monitoredError) throw monitoredError;

      if (!monitoredData) {
        setChannels([]);
        return;
      }

      // Get history data for each channel to calculate metrics
      const channelsWithMetrics = await Promise.all(
        monitoredData.map(async (channel) => {
          const { data: historyData } = await supabase
            .from('channel_history')
            .select('*')
            .eq('channel_id', channel.channel_id)
            .order('recorded_at', { ascending: true });

          const now = new Date();
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          let subscribersLast7Days = 0;
          let viewsLast7Days = 0;
          let subscribersLastDay = 0;
          let viewsLastDay = 0;

          if (historyData && historyData.length > 0) {
            const history7d = historyData.filter(
              (h) => new Date(h.recorded_at) >= sevenDaysAgo
            );
            const history1d = historyData.filter(
              (h) => new Date(h.recorded_at) >= oneDayAgo
            );

            if (history7d.length > 0) {
              const oldest = history7d[0];
              subscribersLast7Days = (channel.subscriber_count || 0) - (oldest.subscriber_count || 0);
              viewsLast7Days = (channel.view_count || 0) - (oldest.view_count || 0);
            }

            if (history1d.length > 0) {
              const oldest = history1d[0];
              subscribersLastDay = (channel.subscriber_count || 0) - (oldest.subscriber_count || 0);
              viewsLastDay = (channel.view_count || 0) - (oldest.view_count || 0);
            }
          }

          const initialHistory = historyData?.[0];
          const isExploding = subscribersLast7Days > ((channel.subscriber_count || 0) * 0.1);

          return {
            id: channel.id,
            channelId: channel.channel_id,
            channelTitle: channel.channel_name,
            channelThumbnail: channel.channel_thumbnail || undefined,
            currentSubscribers: channel.subscriber_count || 0,
            currentViews: channel.view_count || 0,
            currentVideos: channel.video_count || 0,
            initialSubscribers: initialHistory?.subscriber_count || channel.subscriber_count || 0,
            initialViews: initialHistory?.view_count || channel.view_count || 0,
            addedAt: channel.added_at,
            lastUpdated: channel.last_updated,
            subscribersLast7Days,
            viewsLast7Days,
            subscribersLastDay,
            viewsLastDay,
            isExploding,
            niche: channel.niche || undefined,
            notes: channel.notes || undefined,
            contentType: (channel.content_type as 'longform' | 'shorts') || 'longform',
          };
        })
      );

      setChannels(channelsWithMetrics);
    } catch (error) {
      console.error('Error loading channels:', error);
      toast.error('Erro ao carregar canais');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChannels();

    // Recarrega quando a página fica visível
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadChannels();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const addChannel = async (channel: ChannelMonitorData) => {
    // This is now handled by the edge function
    await loadChannels();
  };

  const updateChannel = async (channelId: string, updates: Partial<ChannelMonitorData>) => {
    try {
      const { error } = await supabase
        .from('monitored_channels')
        .update({
          channel_name: updates.channelTitle,
          channel_thumbnail: updates.channelThumbnail,
          subscriber_count: updates.currentSubscribers,
          view_count: updates.currentViews,
          last_updated: new Date().toISOString(),
        })
        .eq('channel_id', channelId);

      if (error) throw error;
      await loadChannels();
    } catch (error) {
      console.error('Error updating channel:', error);
      toast.error('Erro ao atualizar canal');
    }
  };

  const removeChannel = async (channelId: string) => {
    try {
      const { error } = await supabase
        .from('monitored_channels')
        .delete()
        .eq('channel_id', channelId);

      if (error) throw error;
      
      await loadChannels();
      toast.success('Canal removido do monitoramento!');
    } catch (error) {
      console.error('Error removing channel:', error);
      toast.error('Erro ao remover canal');
    }
  };

  const updateNotes = async (channelId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('monitored_channels')
        .update({ notes })
        .eq('channel_id', channelId);

      if (error) throw error;
      
      await loadChannels();
      toast.success('Notas atualizadas!');
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Erro ao atualizar notas');
    }
  };

  const updateNiche = async (channelId: string, niche: string) => {
    try {
      // Normalize niche: first letter uppercase, rest lowercase
      let normalizedNiche = niche;
      if (niche && niche.trim()) {
        const trimmed = niche.trim();
        normalizedNiche = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      }

      const { error } = await supabase
        .from('monitored_channels')
        .update({ niche: normalizedNiche })
        .eq('channel_id', channelId);

      if (error) throw error;
      
      await loadChannels();
      toast.success('Nicho atualizado!');
    } catch (error) {
      console.error('Error updating niche:', error);
      toast.error('Erro ao atualizar nicho');
    }
  };

  const updateChannelStats = async (channelId: string) => {
    toast.info('Atualizando estatísticas...');

    try {
      // Garante que temos o usuário atual para salvar o histórico corretamente
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Não foi possível identificar o usuário autenticado');
      }

      const { data, error } = await supabase.functions.invoke('youtube', {
        body: { action: 'channelDetails', channelId },
      });

      if (error) throw error;

      // Verifica se já existe um registro de histórico para hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: existingHistory } = await supabase
        .from('channel_history')
        .select('id')
        .eq('channel_id', channelId)
        .eq('user_id', userData.user.id)
        .gte('recorded_at', today.toISOString())
        .limit(1);

      if (existingHistory && existingHistory.length > 0) {
        // Já existe registro hoje - atualiza o existente
        const { error: updateHistoryError } = await supabase
          .from('channel_history')
          .update({
            subscriber_count: data.subscriberCount,
            video_count: data.videoCount,
            view_count: data.viewCount,
          })
          .eq('id', existingHistory[0].id);

        if (updateHistoryError) throw updateHistoryError;
      } else {
        // Não existe registro hoje - cria novo
        const { error: historyError } = await supabase.from('channel_history').insert({
          user_id: userData.user.id,
          channel_id: channelId,
          subscriber_count: data.subscriberCount,
          video_count: data.videoCount,
          view_count: data.viewCount,
        });

        if (historyError) throw historyError;
      }

      // Atualiza tabela principal de canais monitorados
      const { error: updateError } = await supabase
        .from('monitored_channels')
        .update({
          subscriber_count: data.subscriberCount,
          video_count: data.videoCount,
          view_count: data.viewCount,
          last_updated: new Date().toISOString(),
        })
        .eq('channel_id', channelId);

      if (updateError) throw updateError;

      await loadChannels();
      toast.success('Estatísticas atualizadas!');
    } catch (error) {
      console.error('Error updating stats:', error);
      toast.error('Erro ao atualizar estatísticas');
    }
  };

  const updateContentType = async (channelId: string, contentType: 'longform' | 'shorts') => {
    try {
      const { error } = await supabase
        .from('monitored_channels')
        .update({ content_type: contentType })
        .eq('channel_id', channelId);

      if (error) throw error;
      
      await loadChannels();
      toast.success('Tipo de conteúdo atualizado!');
    } catch (error) {
      console.error('Error updating content type:', error);
      toast.error('Erro ao atualizar tipo de conteúdo');
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
    updateContentType,
  };
};