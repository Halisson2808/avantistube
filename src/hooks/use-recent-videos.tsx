import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMonitoredChannels, ChannelMonitorData } from '@/hooks/use-monitored-channels';
import { getLatestChannelVideos, ChannelLatestVideosResult, LatestVideo, calculateTimeAgo } from '@/lib/youtube-api';

export interface RecentVideo extends LatestVideo {
  channelId: string;
  channelName: string;
  channelThumbnail?: string;
  timeAgo: string;
  isViral?: boolean;
  position?: number;
}

export interface ChannelVideosData {
  channel: ChannelMonitorData;
  videos: RecentVideo[];
  isLoading: boolean;
  lastFetched?: Date;
  error?: string;
}

export interface FilterOptions {
  search: string;
  category: string;
  contentType?: string;
}

export interface UpdateProgress {
  current: number;
  total: number;
  percentage: number;
  channelName: string;
}

const CACHE_HOURS = 1; // Cache válido por 1 hora

export const useRecentVideos = () => {
  const { channels } = useMonitoredChannels();
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());
  const [channelVideosData, setChannelVideosData] = useState<Map<string, ChannelVideosData>>(new Map());
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'Todos',
    contentType: 'Todos',
  });
  const [updateProgress, setUpdateProgress] = useState<UpdateProgress>({
    current: 0,
    total: 0,
    percentage: 0,
    channelName: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Sempre manter todos os canais selecionados
  useEffect(() => {
    if (channels.length > 0) {
      const allChannelIds = new Set(channels.map(ch => ch.channelId));
      // Atualiza apenas se houver diferença
      if (selectedChannelIds.size !== allChannelIds.size || 
          !Array.from(selectedChannelIds).every(id => allChannelIds.has(id))) {
        setSelectedChannelIds(allChannelIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels.length]);

  // Carregar vídeos do cache na inicialização
  useEffect(() => {
    if (channels.length > 0) {
      loadVideosFromCache();
    }
  }, [channels.length]);

  // Função para carregar vídeos do cache do banco
  const loadVideosFromCache = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: snapshots, error } = await supabase
        .from('video_snapshots')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (error) throw error;

      // Agrupar vídeos por canal
      const videosByChannel = new Map<string, RecentVideo[]>();
      const lastFetchedByChannel = new Map<string, Date>();

      snapshots?.forEach((snapshot) => {
        if (!videosByChannel.has(snapshot.channel_id)) {
          videosByChannel.set(snapshot.channel_id, []);
        }

        const channel = channels.find(ch => ch.channelId === snapshot.channel_id);
        if (!channel) return;

        videosByChannel.get(snapshot.channel_id)!.push({
          videoId: snapshot.video_id,
          title: snapshot.title,
          thumbnailUrl: snapshot.thumbnail_url || '',
          publishedAt: snapshot.published_at || '',
          viewCount: snapshot.view_count || 0,
          likeCount: snapshot.like_count || 0,
          commentCount: snapshot.comment_count || 0,
          channelId: snapshot.channel_id,
          channelName: channel.channelTitle,
          channelThumbnail: channel.channelThumbnail,
          timeAgo: calculateTimeAgo(snapshot.published_at || ''),
          isViral: snapshot.is_viral || false,
          position: snapshot.position,
        });

        // Atualizar lastFetched com o mais recente
        const fetchedAt = new Date(snapshot.fetched_at);
        const currentLastFetched = lastFetchedByChannel.get(snapshot.channel_id);
        if (!currentLastFetched || fetchedAt > currentLastFetched) {
          lastFetchedByChannel.set(snapshot.channel_id, fetchedAt);
        }
      });

      // Atualizar estado
      setChannelVideosData(prev => {
        const newMap = new Map(prev);
        videosByChannel.forEach((videos, channelId) => {
          const channel = channels.find(ch => ch.channelId === channelId);
          if (channel) {
            newMap.set(channelId, {
              channel,
              videos: videos.sort((a, b) => (a.position || 0) - (b.position || 0)),
              isLoading: false,
              lastFetched: lastFetchedByChannel.get(channelId),
            });
          }
        });
        return newMap;
      });
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
    }
  }, [channels]);

  // Função para salvar vídeos no banco
  const saveVideosToCache = useCallback(async (
    channelId: string,
    videos: LatestVideo[],
    channel: ChannelMonitorData
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date().toISOString();

      // 1. Marcar vídeos antigos como inativos
      await supabase
        .from('video_snapshots')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('channel_id', channelId)
        .eq('is_active', true);

      // 2. Calcular média de views para detecção de viral
      const averageViews = channel.currentViews / Math.max(channel.currentVideos, 1);

      // 3. Salvar novos vídeos
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        
        const daysSincePublished = Math.max(
          1,
          Math.floor((new Date().getTime() - new Date(video.publishedAt).getTime()) / 86400000)
        );
        const viewsPerDay = video.viewCount / daysSincePublished;
        const isViral = video.viewCount > 100000 || viewsPerDay > (averageViews * 3);

        // Verificar se vídeo já existe
        const { data: existing } = await supabase
          .from('video_snapshots')
          .select('id')
          .eq('user_id', user.id)
          .eq('channel_id', channelId)
          .eq('video_id', video.videoId)
          .single();

        if (existing) {
          // Atualizar vídeo existente
          await supabase
            .from('video_snapshots')
            .update({
              title: video.title,
              thumbnail_url: video.thumbnailUrl,
              view_count: video.viewCount,
              like_count: video.likeCount,
              comment_count: video.commentCount,
              published_at: video.publishedAt,
              position: i + 1,
              is_active: true,
              is_viral: isViral,
              fetched_at: now,
            })
            .eq('id', existing.id);
        } else {
          // Inserir novo vídeo
          await supabase
            .from('video_snapshots')
            .insert({
              user_id: user.id,
              channel_id: channelId,
              video_id: video.videoId,
              title: video.title,
              thumbnail_url: video.thumbnailUrl,
              view_count: video.viewCount,
              like_count: video.likeCount,
              comment_count: video.commentCount,
              published_at: video.publishedAt,
              position: i + 1,
              is_active: true,
              is_viral: isViral,
              fetched_at: now,
            });
        }
      }

      // 4. Limpar vídeos inativos com mais de 24h
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      await supabase
        .from('video_snapshots')
        .delete()
        .eq('user_id', user.id)
        .eq('channel_id', channelId)
        .eq('is_active', false)
        .lt('fetched_at', yesterday.toISOString());

      // 5. Atualizar last_updated do canal
      await supabase
        .from('monitored_channels')
        .update({ last_updated: now })
        .eq('channel_id', channelId);
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }, []);

  // Verificar se canal precisa ser atualizado (cache expirado)
  const needsUpdate = useCallback((channelId: string): boolean => {
    const data = channelVideosData.get(channelId);
    if (!data || !data.lastFetched) return true;

    const hoursSince = (new Date().getTime() - data.lastFetched.getTime()) / 3600000;
    return hoursSince >= CACHE_HOURS;
  }, [channelVideosData]);

  // Atualizar canal individual (com verificação de cache)
  const updateChannelVideos = useCallback(async (
    channelId: string,
    forceUpdate: boolean = false
  ) => {
    if (!forceUpdate && !needsUpdate(channelId)) {
      return; // Usa cache
    }

    const channel = channels.find(ch => ch.channelId === channelId);
    if (!channel) return;

    try {
      const results = await getLatestChannelVideos([channelId], 5);
      const result = results[0];

      if (result.success && result.videos) {
        // Salvar no cache
        await saveVideosToCache(channelId, result.videos, channel);

        // Calcular vídeos com dados completos
        const averageViews = channel.currentViews / Math.max(channel.currentVideos, 1);
        const videos: RecentVideo[] = result.videos.map((video, index) => {
          const timeAgo = calculateTimeAgo(video.publishedAt);
          const daysSincePublished = Math.max(
            1,
            Math.floor((new Date().getTime() - new Date(video.publishedAt).getTime()) / 86400000)
          );
          const viewsPerDay = video.viewCount / daysSincePublished;
          const isViral = video.viewCount > 100000 || viewsPerDay > (averageViews * 3);

          return {
            ...video,
            channelId,
            channelName: channel.channelTitle,
            channelThumbnail: channel.channelThumbnail,
            timeAgo,
            isViral,
            position: index + 1,
          };
        });

        // Atualizar estado
        setChannelVideosData(prev => {
          const newMap = new Map(prev);
          newMap.set(channelId, {
            channel,
            videos,
            isLoading: false,
            lastFetched: new Date(),
          });
          return newMap;
        });
      }
    } catch (error) {
      console.error(`Erro ao atualizar canal ${channelId}:`, error);
      throw error;
    }
  }, [channels, needsUpdate, saveVideosToCache]);

  // Atualizar todos os canais selecionados
  const updateAllChannels = useCallback(async (
    progressCallback?: (progress: UpdateProgress) => void
  ) => {
    const channelsToUpdate = Array.from(selectedChannelIds);
    
    if (channelsToUpdate.length === 0) {
      toast.info('Selecione pelo menos um canal');
      return;
    }

    setIsUpdating(true);
    setIsLoadingAll(true);
    
    const results = {
      total: channelsToUpdate.length,
      success: 0,
      failed: 0,
      cached: 0,
      errors: [] as Array<{ channelId: string; channelName: string; error: string }>,
    };

    // Processar em lotes de 10
    const batchSize = 10;
    for (let i = 0; i < channelsToUpdate.length; i += batchSize) {
      const batch = channelsToUpdate.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (channelId, batchIndex) => {
          const currentIndex = i + batchIndex + 1;
          const channel = channels.find(ch => ch.channelId === channelId);

          if (progressCallback) {
            progressCallback({
              current: currentIndex,
              total: channelsToUpdate.length,
              percentage: Math.round((currentIndex / channelsToUpdate.length) * 100),
              channelName: channel?.channelTitle || channelId,
            });
          }

          try {
            // Verificar se precisa atualizar
            if (!needsUpdate(channelId)) {
              results.cached++;
              return;
            }

            await updateChannelVideos(channelId, false);
            results.success++;

            // Delay entre requisições
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            results.failed++;
            results.errors.push({
              channelId,
              channelName: channel?.channelTitle || channelId,
              error: error instanceof Error ? error.message : 'Erro desconhecido',
            });
          }
        })
      );
    }

    setIsUpdating(false);
    setIsLoadingAll(false);

    toast.success(
      `✅ Atualização concluída!\nSucesso: ${results.success} | Cache: ${results.cached} | Falhas: ${results.failed}`
    );

    return results;
  }, [selectedChannelIds, channels, needsUpdate, updateChannelVideos]);

  // Função de filtro
  const filterChannels = useCallback((
    data: ChannelVideosData[]
  ): ChannelVideosData[] => {
    let filtered = [...data];

    // 1. Busca por texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(data =>
        data.channel.channelTitle.toLowerCase().includes(searchLower) ||
        data.channel.channelId.toLowerCase().includes(searchLower)
      );
    }

    // 2. Categoria (usando niche)
    if (filters.category && filters.category !== 'Todos') {
      filtered = filtered.filter(data =>
        data.channel.niche?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // 3. Formato de vídeo (contentType)
    if (filters.contentType && filters.contentType !== 'Todos') {
      filtered = filtered.filter(data =>
        data.channel.contentType === filters.contentType
      );
    }

    // Ordenação fixa por nome (A-Z)
    filtered.sort((a, b) => {
      return a.channel.channelTitle.localeCompare(b.channel.channelTitle);
    });

    return filtered;
  }, [filters]);

  // Obter vídeos filtrados
  const getVideosByChannel = useCallback((): ChannelVideosData[] => {
    const allData = Array.from(channelVideosData.values());
    return filterChannels(allData);
  }, [channelVideosData, filterChannels]);

  const toggleChannelSelection = useCallback((channelId: string) => {
    setSelectedChannelIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(channelId)) {
        newSet.delete(channelId);
      } else {
        newSet.add(channelId);
      }
      return newSet;
    });
  }, []);

  const selectAllChannels = useCallback(() => {
    setSelectedChannelIds(new Set(channels.map(ch => ch.channelId)));
  }, [channels]);

  const clearSelection = useCallback(() => {
    setSelectedChannelIds(new Set());
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'Todos',
      contentType: 'Todos',
    });
  }, []);

  return {
    channels,
    selectedChannelIds,
    channelVideosData,
    isLoadingAll,
    filters,
    setFilters,
    updateProgress,
    isUpdating,
    fetchVideos: updateAllChannels,
    updateChannelVideos,
    updateAllChannels,
    toggleChannelSelection,
    selectAllChannels,
    clearSelection,
    clearFilters,
    getVideosByChannel,
    loadVideosFromCache,
  };
};
