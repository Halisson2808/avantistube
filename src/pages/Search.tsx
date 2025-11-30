import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon } from "lucide-react";
import { VideoCard, VideoData } from "@/components/VideoCard";
import { SearchFilters, SearchParams } from "@/components/SearchFilters";
import { searchYouTube } from "@/lib/youtube-api";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSearchHistory } from "@/hooks/use-search-history";

const defaultFilters: SearchParams = {
  searchType: 'videos',
  keywords: "",
  durationMin: 0,
  durationMax: 0,
  subscribersMin: 0,
  subscribersMax: 0,
  channelCreatedAfter: "",
  channelCreatedBefore: "",
  viewsMin: 0,
  viewsMax: 0,
  language: "any",
  country: "any",
  quality: "any",
  sortBy: "relevance",
  publishedAfter: "",
  publishedBefore: "",
  maxResults: 50
};

const Search = () => {
  const [filters, setFilters] = useLocalStorage<SearchParams>('youtube-search-video-filters', defaultFilters);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToHistory, clearHistory } = useSearchHistory();

  const parseDuration = (duration: string): number => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || "0");
    const minutes = parseInt(match[2] || "0");
    const seconds = parseInt(match[3] || "0");
    return hours * 60 + minutes + seconds / 60; // Retorna em minutos
  };

  const handleSearch = async () => {
    if (!filters.keywords.trim()) {
      toast.error("Digite palavras-chave para buscar");
      return;
    }

    setIsLoading(true);
    setVideos([]);

    try {
      // Salva filtros no localStorage
      setFilters(filters);

      // Prepara parâmetros para a API YouTube
      const params: any = {
        q: filters.keywords,
        type: 'video',
        maxResults: filters.maxResults,
        order: filters.sortBy,
      };

      // Adiciona filtros opcionais
      if (filters.quality !== 'any') {
        params.videoDefinition = filters.quality === 'hd' ? 'high' : filters.quality;
      }
      
      if (filters.publishedAfter) {
        params.publishedAfter = new Date(filters.publishedAfter).toISOString();
      }
      
      if (filters.publishedBefore) {
        params.publishedBefore = new Date(filters.publishedBefore).toISOString();
      }

      if (filters.language !== 'any') {
        params.relevanceLanguage = filters.language;
      }

      if (filters.country !== 'any') {
        params.regionCode = filters.country;
      }

      // Busca na API
      const results = await searchYouTube(params);

      // Aplica filtros locais que a API não suporta diretamente
      let filtered = results;

      // Filtra por duração
      if (filters.durationMin > 0 || filters.durationMax > 0) {
        filtered = filtered.filter((video: VideoData) => {
          const duration = parseDuration(video.duration);
          const min = filters.durationMin || 0;
          const max = filters.durationMax || Infinity;
          return duration >= min && duration <= max;
        });
      }

      // Filtra por inscritos do canal
      if (filters.subscribersMin > 0 || filters.subscribersMax > 0) {
        filtered = filtered.filter((video: VideoData) => {
          const subs = parseInt(video.subscriberCount || video.channelSubscribers || "0");
          const min = filters.subscribersMin || 0;
          const max = filters.subscribersMax || Infinity;
          return subs >= min && subs <= max;
        });
      }

      // Filtra por visualizações
      if (filters.viewsMin > 0 || filters.viewsMax > 0) {
        filtered = filtered.filter((video: VideoData) => {
          const views = parseInt(video.viewCount);
          const min = filters.viewsMin || 0;
          const max = filters.viewsMax || Infinity;
          return views >= min && views <= max;
        });
      }

      // Filtra por data de criação do canal
      if (filters.channelCreatedAfter || filters.channelCreatedBefore) {
        filtered = filtered.filter((video: VideoData) => {
          if (!video.channelCreatedAt) return true;
          const channelDate = new Date(video.channelCreatedAt);
          const after = filters.channelCreatedAfter ? new Date(filters.channelCreatedAfter) : new Date(0);
          const before = filters.channelCreatedBefore ? new Date(filters.channelCreatedBefore) : new Date();
          return channelDate >= after && channelDate <= before;
        });
      }

      setVideos(filtered);
      
      // Adiciona ao histórico
      if (filtered.length > 0) {
        addToHistory(filtered);
      }

      toast.success(`${filtered.length} vídeos encontrados!`);
    } catch (error) {
      console.error("Erro ao buscar:", error);
      toast.error("Erro ao buscar vídeos. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setVideos([]);
    clearHistory();
    toast.success("Filtros e histórico limpos!");
  };

  return (
    <div className="space-y-6">
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        onClear={handleClear}
        isLoading={isLoading}
      />

      {/* Resultados */}
      {videos.length === 0 && !isLoading && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Use os filtros acima para encontrar vídeos do YouTube
            </p>
          </CardContent>
        </Card>
      )}

      {videos.length > 0 && (
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                Resultados ({videos.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Search;
