import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMonitoredChannels, ChannelMonitorData } from '@/hooks/use-monitored-channels';
import { useVideoLocalStorage, CachedVideo } from '@/hooks/use-video-local-storage';
import { getLatestChannelVideos, LatestVideo, calculateTimeAgo } from '@/lib/youtube-api';

export interface RecentVideo extends LatestVideo {
  channelId: string;
  channelName: string;
  channelThumbnail?: string;
  timeAgo: string;
  isViral?: boolean;
  position?: number;
  isDeleted?: boolean;
  channelDeleted?: boolean;
  duration?: string;
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
  sortBy?: string;
  datePeriod?: 'all' | '7days' | '30days';
}

export interface UpdateProgress {
  current: number;
  total: number;
  percentage: number;
  channelName: string;
}

const CACHE_HOURS = 2; // Cache válido por 2 horas

export const useRecentVideos = () => {
  const { 
    channels, 
    loadChannels,
    updateNotes, 
    updateNiche, 
    updateContentType, 
    removeChannel, 
    updateChannelStats,
    isLoading: isLoadingChannels 
  } = useMonitoredChannels();
  
  const {
    isLoaded: isLocalStorageLoaded,
    saveChannelVideos,
    getChannelVideos: getCachedVideos,
    isCacheValid,
    getAllCachedChannels,
  } = useVideoLocalStorage();
  
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());
  const [channelVideosData, setChannelVideosData] = useState<Map<string, ChannelVideosData>>(new Map());
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'Todos',
    contentType: 'Todos',
    sortBy: 'recent',
    datePeriod: 'all',
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
      if (selectedChannelIds.size !== allChannelIds.size || 
          !Array.from(selectedChannelIds).every(id => allChannelIds.has(id))) {
        setSelectedChannelIds(allChannelIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels.length]);

  // Carregar vídeos do localStorage na inicialização
  useEffect(() => {
    if (isLocalStorageLoaded && channels.length > 0) {
      loadVideosFromLocalStorage();
    }
  }, [isLocalStorageLoaded, channels.length]);

  // Função para carregar vídeos do localStorage
  const loadVideosFromLocalStorage = useCallback(() => {
    const cachedChannels = getAllCachedChannels();
    
    if (cachedChannels.length === 0) return;

    setChannelVideosData(prev => {
      const newMap = new Map(prev);
      
      cachedChannels.forEach(cached => {
        const channel = channels.find(ch => ch.channelId === cached.channelId);
        if (!channel) return;

        // Calcular média de views para detecção de viral
        const averageViews = channel.currentViews / Math.max(channel.currentVideos, 1);

        const videos: RecentVideo[] = cached.videos.map((video, index) => {
          const daysSincePublished = Math.max(
            1,
            Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / 86400000)
          );
          const viewsPerDay = video.viewCount / daysSincePublished;
          const isViral = !video.isDeleted && (video.viewCount > 100000 || viewsPerDay > (averageViews * 3));

          return {
            ...video,
            channelId: cached.channelId,
            channelName: channel.channelTitle,
            channelThumbnail: channel.channelThumbnail,
            timeAgo: calculateTimeAgo(video.publishedAt),
            isViral: video.isViral || isViral,
            position: video.position || index + 1,
          };
        });

        newMap.set(cached.channelId, {
          channel,
          videos,
          isLoading: false,
          lastFetched: new Date(cached.lastFetched),
        });
      });
      
      return newMap;
    });
  }, [channels, getAllCachedChannels]);

  // Verificar se canal precisa ser atualizado (cache expirado)
  const needsUpdate = useCallback((channelId: string): boolean => {
    return !isCacheValid(channelId, CACHE_HOURS);
  }, [isCacheValid]);

  // Atualizar canal individual
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
        // Calcular vídeos com dados completos
        const averageViews = channel.currentViews / Math.max(channel.currentVideos, 1);
        const videos: RecentVideo[] = result.videos.map((video, index) => {
          const timeAgo = calculateTimeAgo(video.publishedAt);
          const daysSincePublished = Math.max(
            1,
            Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / 86400000)
          );
          const viewsPerDay = video.viewCount / daysSincePublished;
          const isViral = !video.isDeleted && (video.viewCount > 100000 || viewsPerDay > (averageViews * 3));

          return {
            ...video,
            channelId,
            channelName: channel.channelTitle,
            channelThumbnail: channel.channelThumbnail,
            timeAgo,
            isViral,
            position: index + 1,
            isDeleted: video.isDeleted,
            channelDeleted: result.channelDeleted,
          };
        });

        // Salvar no localStorage (apenas thumbs/títulos)
        const cachedVideos: CachedVideo[] = videos.map(v => ({
          videoId: v.videoId,
          title: v.title,
          thumbnailUrl: v.thumbnailUrl,
          publishedAt: v.publishedAt,
          viewCount: v.viewCount,
          likeCount: v.likeCount,
          commentCount: v.commentCount,
          isViral: v.isViral,
          isDeleted: v.isDeleted,
          position: v.position,
        }));
        saveChannelVideos(channelId, cachedVideos);

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
  }, [channels, needsUpdate, saveChannelVideos]);

  // Função para atualizar o histórico do canal no Supabase (para gráfico de crescimento)
  const updateChannelHistory = useCallback(async (channelId: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar dados atualizados do canal via YouTube API
      const { data, error } = await supabase.functions.invoke('youtube', {
        body: { action: 'channelDetails', channelId },
      });

      if (error) throw error;

      // Verificar se já existe um registro de histórico para hoje
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
        // Atualizar registro existente
        await supabase
          .from('channel_history')
          .update({
            subscriber_count: data.subscriberCount,
            video_count: data.videoCount,
            view_count: data.viewCount,
          })
          .eq('id', existingHistory[0].id);
      } else {
        // Criar novo registro
        await supabase.from('channel_history').insert({
          user_id: userData.user.id,
          channel_id: channelId,
          subscriber_count: data.subscriberCount,
          video_count: data.videoCount,
          view_count: data.viewCount,
        });
      }

      // Atualizar tabela principal de canais monitorados
      await supabase
        .from('monitored_channels')
        .update({
          subscriber_count: data.subscriberCount,
          video_count: data.videoCount,
          view_count: data.viewCount,
          last_updated: new Date().toISOString(),
        })
        .eq('channel_id', channelId);

    } catch (error) {
      console.error(`Erro ao atualizar histórico do canal ${channelId}:`, error);
    }
  }, []);

  // Atualizar canais por nichos selecionados
  const updateChannelsByNiches = useCallback(async (
    selectedNiches: string[],
    progressCallback?: (progress: UpdateProgress) => void,
    forceUpdate: boolean = true,
  ) => {
    // Normalizar nichos selecionados para comparação case-insensitive
    const normalizedSelectedNiches = selectedNiches.map(n => n.toLowerCase().trim());
    
    // Filtrar canais pelos nichos selecionados (case-insensitive)
    const channelsToUpdate = channels
      .filter((ch) => {
        const channelNiche = (ch.niche || "Sem Nicho").toLowerCase().trim();
        return normalizedSelectedNiches.includes(channelNiche);
      })
      .map((ch) => ch.channelId);

    if (channelsToUpdate.length === 0) {
      toast.info("Nenhum canal encontrado nos nichos selecionados");
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
          const channel = channels.find((ch) => ch.channelId === channelId);

          const progress = {
            current: currentIndex,
            total: channelsToUpdate.length,
            percentage: Math.round((currentIndex / channelsToUpdate.length) * 100),
            channelName: channel?.channelTitle || channelId,
          };

          setUpdateProgress(progress);
          progressCallback?.(progress);

          try {
            // Se não for forçar, respeita cache
            if (!forceUpdate && !needsUpdate(channelId)) {
              results.cached++;
              return;
            }

            // Atualizar vídeos (localStorage) + histórico (Supabase)
            await Promise.all([
              updateChannelVideos(channelId, true),
              updateChannelHistory(channelId),
            ]);

            results.success++;

            // Delay entre requisições
            await new Promise((resolve) => setTimeout(resolve, 200));
          } catch (error) {
            results.failed++;
            results.errors.push({
              channelId,
              channelName: channel?.channelTitle || channelId,
              error: error instanceof Error ? error.message : "Erro desconhecido",
            });
          }
        }),
      );
    }

    setIsUpdating(false);
    setIsLoadingAll(false);

    toast.success(
      `✅ Atualização concluída!\nSucesso: ${results.success} | Cache: ${results.cached} | Falhas: ${results.failed}`,
    );

    return results;
  }, [channels, needsUpdate, updateChannelVideos, updateChannelHistory]);

  // Obter todos os nichos disponíveis (normalizados)
  const getAvailableNiches = useCallback((): string[] => {
    const nichesMap = new Map<string, string>();
    channels.forEach(ch => {
      const originalNiche = ch.niche || 'Sem Nicho';
      const normalizedKey = originalNiche.toLowerCase().trim();
      
      if (!nichesMap.has(normalizedKey)) {
        const normalized = normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);
        nichesMap.set(normalizedKey, normalized);
      }
    });
    return Array.from(nichesMap.values()).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [channels]);

  // Contar canais por nicho (case-insensitive)
  const getChannelCountByNiche = useCallback((niche: string): number => {
    const nicheNormalized = niche.toLowerCase().trim();
    return channels.filter(ch => {
      const channelNiche = (ch.niche || 'Sem Nicho').toLowerCase().trim();
      return channelNiche === nicheNormalized;
    }).length;
  }, [channels]);

  // Função de filtro
  const filterChannels = useCallback((
    data: ChannelVideosData[]
  ): ChannelVideosData[] => {
    let filtered = [...data];

    // 1. Busca por texto (nome, ID ou nicho)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(data =>
        data.channel.channelTitle.toLowerCase().includes(searchLower) ||
        data.channel.channelId.toLowerCase().includes(searchLower) ||
        (data.channel.niche && data.channel.niche.toLowerCase().includes(searchLower))
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

    // Ordenação
    filtered.sort((a, b) => {
      if (filters.sortBy === 'totalViews') {
        const datePeriod = filters.datePeriod || 'all';
        
        const filterByPeriod = (videos: RecentVideo[]) => {
          if (datePeriod === 'all') return videos;
          const now = new Date();
          const cutoffDays = datePeriod === '7days' ? 7 : 30;
          const cutoffDate = new Date(now.getTime() - cutoffDays * 24 * 60 * 60 * 1000);
          return videos.filter(video => new Date(video.publishedAt) >= cutoffDate);
        };
        
        const totalViewsA = filterByPeriod(a.videos).reduce((sum, v) => sum + (v.viewCount || 0), 0);
        const totalViewsB = filterByPeriod(b.videos).reduce((sum, v) => sum + (v.viewCount || 0), 0);
        return totalViewsB - totalViewsA;
      }
      if (filters.sortBy === 'recent') {
        return new Date(b.channel.addedAt).getTime() - new Date(a.channel.addedAt).getTime();
      }
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
      sortBy: 'recent',
      datePeriod: 'all',
    });
  }, []);

  // Função para filtrar vídeos por período
  const filterVideosByDatePeriod = useCallback((videos: RecentVideo[], datePeriod: 'all' | '7days' | '30days'): RecentVideo[] => {
    if (datePeriod === 'all') return videos;
    
    const now = new Date();
    const cutoffDays = datePeriod === '7days' ? 7 : 30;
    const cutoffDate = new Date(now.getTime() - cutoffDays * 24 * 60 * 60 * 1000);
    
    return videos.filter(video => {
      const publishedDate = new Date(video.publishedAt);
      return publishedDate >= cutoffDate;
    });
  }, []);

  // Calcular views totais filtradas por período
  const getTotalViewsForPeriod = useCallback((videos: RecentVideo[], datePeriod: 'all' | '7days' | '30days'): number => {
    const filteredVideos = filterVideosByDatePeriod(videos, datePeriod);
    return filteredVideos.reduce((sum, v) => sum + (v.viewCount || 0), 0);
  }, [filterVideosByDatePeriod]);

  // Atualizar um único canal (vídeos + histórico)
  const updateSingleChannel = useCallback(async (channelId: string) => {
    try {
      await Promise.all([
        updateChannelVideos(channelId, true),
        updateChannelHistory(channelId),
      ]);
      // Recarrega a lista de canais para mostrar os dados atualizados
      await loadChannels();
      toast.success('Dados do canal atualizados!');
    } catch (error) {
      console.error(`Erro ao atualizar canal ${channelId}:`, error);
      toast.error('Erro ao atualizar dados do canal');
    }
  }, [updateChannelVideos, updateChannelHistory, loadChannels]);

  return {
    channels,
    selectedChannelIds,
    channelVideosData,
    isLoadingAll,
    isLoadingChannels,
    filters,
    setFilters,
    updateProgress,
    isUpdating,
    updateChannelVideos,
    updateChannelsByNiches,
    updateSingleChannel,
    getAvailableNiches,
    getChannelCountByNiche,
    toggleChannelSelection,
    selectAllChannels,
    clearSelection,
    clearFilters,
    getVideosByChannel,
    loadVideosFromCache: loadVideosFromLocalStorage,
    filterVideosByDatePeriod,
    getTotalViewsForPeriod,
    // Funções reexportadas do useMonitoredChannels
    updateNotes,
    updateNiche,
    updateContentType,
    removeChannel,
    updateChannelStats,
  };
};
