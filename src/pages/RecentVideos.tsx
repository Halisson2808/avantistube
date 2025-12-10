import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Loader2, Filter, X, Clock, TrendingUp } from "lucide-react";
import { useRecentVideos } from "@/hooks/use-recent-videos";
import { RecentVideoCard } from "@/components/RecentVideoCard";
import { toast } from "sonner";
import { useMonitoredChannels } from "@/hooks/use-monitored-channels";
import { formatNumber } from "@/lib/youtube-api";

const RecentVideos = () => {
  const {
    channels,
    isLoadingAll,
    filters,
    setFilters,
    updateProgress,
    isUpdating,
    updateAllChannels,
    updateChannelVideos,
    clearFilters,
    getVideosByChannel,
    loadVideosFromCache,
  } = useRecentVideos();

  const { channels: monitoredChannels } = useMonitoredChannels();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Carregar do cache na inicialização
  useEffect(() => {
    if (isInitialLoad && channels.length > 0) {
      setIsInitialLoad(false);
      loadVideosFromCache();
    }
  }, [isInitialLoad, channels.length, loadVideosFromCache]);

  // Obter categorias únicas (niches)
  const categories = useMemo(() => {
    const niches = new Set<string>();
    monitoredChannels.forEach(ch => {
      if (ch.niche) niches.add(ch.niche);
    });
    return ['Todos', ...Array.from(niches).sort()];
  }, [monitoredChannels]);

  const handleUpdateAll = async () => {
    await updateAllChannels();
  };

  const videosByChannel = getVideosByChannel();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Vídeos Recentes</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Últimos 5 vídeos de todos os canais monitorados
            {videosByChannel.length > 0 && (
              <span className="ml-2">
                • Mostrando {videosByChannel.length} de {channels.length} canal(is)
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="default"
            size="sm"
            onClick={handleUpdateAll}
            disabled={isUpdating || channels.length === 0}
            className="flex-1 sm:flex-auto gradient-primary"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Atualizando...</span>
                <span className="sm:hidden">Atualizando</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Atualizar Tudo ({channels.length})</span>
                <span className="sm:hidden">Atualizar Tudo</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Barra de Progresso */}
      {isUpdating && updateProgress.total > 0 && (
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  Atualizando: {updateProgress.channelName}
                </span>
                <span className="text-muted-foreground">
                  {updateProgress.current} / {updateProgress.total} ({updateProgress.percentage}%)
                </span>
              </div>
              <Progress value={updateProgress.percentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Canais Monitorados */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Canais Monitorados ({channels.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {channels.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum canal monitorado. Adicione canais na página "Canais Monitorados" primeiro.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                >
                  {channel.channelThumbnail && (
                    <img
                      src={channel.channelThumbnail}
                      alt={channel.channelTitle}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {channel.channelTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {channel.niche && (
                        <span className="text-xs px-2 py-0.5 bg-muted rounded">
                          {channel.niche}
                        </span>
                      )}
                      {channel.contentType && (
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                          {channel.contentType === 'longform' ? 'LongForm' : 'Shorts'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sistema de Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="space-y-2">
              <Label className="text-xs">Buscar Canal</Label>
              <Input
                placeholder="🔍 Buscar canal por nome ou ID..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="h-9"
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label className="text-xs">Categoria</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Formato de Vídeo */}
            <div className="space-y-2">
              <Label className="text-xs">Formato de Vídeo</Label>
              <Select
                value={filters.contentType || 'Todos'}
                onValueChange={(value) => setFilters({ ...filters, contentType: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="longform">LongForm</SelectItem>
                  <SelectItem value="shorts">Shorts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ordenar por */}
            <div className="space-y-2">
              <Label className="text-xs">Ordenar por</Label>
              <Select
                value={filters.sortBy || 'name'}
                onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome (A-Z)</SelectItem>
                  <SelectItem value="totalViews">Total de Views</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vídeos */}
      {videosByChannel.length === 0 && !isLoadingAll && !isUpdating ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Filter className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhum Canal Encontrado
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {filters.search || filters.category !== 'Todos' || (filters.contentType && filters.contentType !== 'Todos')
                ? 'Nenhum canal corresponde aos filtros selecionados. Tente ajustar os filtros.'
                : 'Nenhum vídeo encontrado. Clique em "Atualizar Tudo" para buscar os vídeos recentes.'}
            </p>
            {filters.search || filters.category !== 'Todos' || (filters.contentType && filters.contentType !== 'Todos') ? (
              <Button onClick={clearFilters} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Limpar Filtros
              </Button>
            ) : (
              <Button onClick={handleUpdateAll} className="gradient-primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar Tudo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {videosByChannel.map((channelData) => {
            // Calcular tempo desde última atualização
            const getUpdateTimeText = () => {
              if (!channelData.lastFetched) return null;
              const diffMs = new Date().getTime() - channelData.lastFetched.getTime();
              const diffMinutes = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMs / 3600000);
              const diffDays = Math.floor(diffMs / 86400000);
              
              if (diffDays > 0) return `Atualizado há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
              if (diffHours > 0) return `Atualizado há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
              return `Atualizado há ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
            };

            // Somar views de todos os vídeos
            const totalViews = channelData.videos.reduce((sum, v) => sum + (v.viewCount || 0), 0);

            return (
              <div key={channelData.channel.channelId} className="space-y-4">
                {/* Header do Canal */}
                <div className="flex items-center gap-3">
                  {channelData.channel.channelThumbnail && (
                    <img
                      src={channelData.channel.channelThumbnail}
                      alt={channelData.channel.channelTitle}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold">
                        {channelData.channel.channelTitle}
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateChannelVideos(channelData.channel.channelId, true)}
                        disabled={isUpdating}
                        className="h-7 px-2"
                        title="Forçar atualização"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                      {channelData.channel.niche && (
                        <span className="px-2 py-0.5 bg-muted rounded">{channelData.channel.niche}</span>
                      )}
                      <span>{new Intl.NumberFormat('pt-BR').format(channelData.channel.currentSubscribers)} inscritos</span>
                      {channelData.videos.length > 0 && (
                        <span className="flex items-center gap-1 text-primary">
                          <TrendingUp className="w-3 h-3" />
                          {formatNumber(totalViews)} views totais
                        </span>
                      )}
                      {getUpdateTimeText() && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getUpdateTimeText()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {channelData.isLoading ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">
                        Carregando vídeos...
                      </span>
                    </CardContent>
                  </Card>
                ) : channelData.error ? (
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-sm text-destructive">
                        ❌ Erro: {channelData.error}
                      </p>
                    </CardContent>
                  </Card>
                ) : channelData.videos.length === 0 ? (
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-sm text-muted-foreground">
                        Este canal não possui vídeos recentes.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  /* Grid de Vídeos */
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {channelData.videos.map((video) => (
                      <RecentVideoCard key={video.videoId} video={video} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentVideos;
