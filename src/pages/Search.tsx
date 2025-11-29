import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, Loader2, Filter, X, Lock } from "lucide-react";
import { VideoCard, VideoData } from "@/components/VideoCard";
import { searchYouTube } from "@/lib/youtube-api";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"videos" | "channels">("videos");
  const [results, setResults] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros avançados
  const [durationMin, setDurationMin] = useState("");
  const [durationMax, setDurationMax] = useState("");
  const [subscribersMin, setSubscribersMin] = useState("");
  const [subscribersMax, setSubscribersMax] = useState("");
  const [viewsMin, setViewsMin] = useState("");
  const [viewsMax, setViewsMax] = useState("");
  const [language, setLanguage] = useState("");
  const [quality, setQuality] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [publishedAfter, setPublishedAfter] = useState("");
  const [publishedBefore, setPublishedBefore] = useState("");
  const [maxResults, setMaxResults] = useState("50");

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Digite uma palavra-chave para buscar");
      return;
    }

    setIsLoading(true);
    try {
      const params: any = {
        q: searchQuery,
        type: searchType,
        maxResults: parseInt(maxResults),
        order: sortBy,
      };

      if (quality) params.videoDefinition = quality;
      if (publishedAfter) params.publishedAfter = new Date(publishedAfter).toISOString();
      if (publishedBefore) params.publishedBefore = new Date(publishedBefore).toISOString();

      const data = await searchYouTube(params);
      
      // Aplicar filtros locais
      let filtered = data;
      
      if (durationMin || durationMax) {
        filtered = filtered.filter((video: VideoData) => {
          const duration = parseDuration(video.duration);
          const min = durationMin ? parseInt(durationMin) : 0;
          const max = durationMax ? parseInt(durationMax) : Infinity;
          return duration >= min && duration <= max;
        });
      }

      if (subscribersMin || subscribersMax) {
        filtered = filtered.filter((video: VideoData) => {
          const subs = parseInt(video.subscriberCount || "0");
          const min = subscribersMin ? parseInt(subscribersMin) : 0;
          const max = subscribersMax ? parseInt(subscribersMax) : Infinity;
          return subs >= min && subs <= max;
        });
      }

      if (viewsMin || viewsMax) {
        filtered = filtered.filter((video: VideoData) => {
          const views = parseInt(video.viewCount);
          const min = viewsMin ? parseInt(viewsMin) : 0;
          const max = viewsMax ? parseInt(viewsMax) : Infinity;
          return views >= min && views <= max;
        });
      }

      setResults(filtered);
      toast.success(`${filtered.length} resultados encontrados!`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar no YouTube. Verifique sua API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const parseDuration = (duration: string): number => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || "0");
    const minutes = parseInt(match[2] || "0");
    const seconds = parseInt(match[3] || "0");
    return hours * 3600 + minutes * 60 + seconds;
  };

  const clearFilters = () => {
    setDurationMin("");
    setDurationMax("");
    setSubscribersMin("");
    setSubscribersMax("");
    setViewsMin("");
    setViewsMax("");
    setLanguage("");
    setQuality("");
    setSortBy("relevance");
    setPublishedAfter("");
    setPublishedBefore("");
    setMaxResults("50");
  };

  return (
    <div className="space-y-6 relative">
      {/* Overlay fixo para bloquear interação */}
      <div className="fixed inset-0 left-64 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card p-8 rounded-lg shadow-lg border border-border max-w-md mx-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold">Funcionalidade em Breve</h2>
          </div>
          <p className="text-center text-muted-foreground">
            A busca de canais estará disponível em breve!
          </p>
        </div>
      </div>

      {/* Conteúdo borrado abaixo */}
      <Card className="shadow-card opacity-50 pointer-events-none">
        <CardHeader>
          <CardTitle>Buscar no YouTube</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite palavras-chave..."
                  className="h-12"
                />
              </div>
              <Select value={searchType} onValueChange={(v: any) => setSearchType(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="videos">Vídeos</SelectItem>
                  <SelectItem value="channels">Canais</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={isLoading} className="gradient-primary h-12 px-6">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <SearchIcon className="w-4 h-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>

            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? "Ocultar" : "Mostrar"} Filtros Avançados
                  </Button>
                </CollapsibleTrigger>
                {showFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Limpar Filtros
                  </Button>
                )}
              </div>

              <CollapsibleContent className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Duração Mínima (segundos)</Label>
                    <Input
                      type="number"
                      value={durationMin}
                      onChange={(e) => setDurationMin(e.target.value)}
                      placeholder="Ex: 60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duração Máxima (segundos)</Label>
                    <Input
                      type="number"
                      value={durationMax}
                      onChange={(e) => setDurationMax(e.target.value)}
                      placeholder="Ex: 600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Qualidade</Label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger>
                        <SelectValue placeholder="Qualquer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Qualquer</SelectItem>
                        <SelectItem value="high">HD</SelectItem>
                        <SelectItem value="standard">SD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Inscritos Mínimo</Label>
                    <Input
                      type="number"
                      value={subscribersMin}
                      onChange={(e) => setSubscribersMin(e.target.value)}
                      placeholder="Ex: 1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Inscritos Máximo</Label>
                    <Input
                      type="number"
                      value={subscribersMax}
                      onChange={(e) => setSubscribersMax(e.target.value)}
                      placeholder="Ex: 100000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ordenar Por</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevância</SelectItem>
                        <SelectItem value="date">Data</SelectItem>
                        <SelectItem value="viewCount">Visualizações</SelectItem>
                        <SelectItem value="rating">Avaliação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Visualizações Mínimo</Label>
                    <Input
                      type="number"
                      value={viewsMin}
                      onChange={(e) => setViewsMin(e.target.value)}
                      placeholder="Ex: 1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Visualizações Máximo</Label>
                    <Input
                      type="number"
                      value={viewsMax}
                      onChange={(e) => setViewsMax(e.target.value)}
                      placeholder="Ex: 1000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Máximo de Resultados</Label>
                    <Select value={maxResults} onValueChange={setMaxResults}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Publicado Após</Label>
                    <Input
                      type="date"
                      value={publishedAfter}
                      onChange={(e) => setPublishedAfter(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Publicado Antes</Label>
                    <Input
                      type="date"
                      value={publishedBefore}
                      onChange={(e) => setPublishedBefore(e.target.value)}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="results">Resultados ({results.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {results.length === 0 && !isLoading && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <SearchIcon className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Use a busca acima para encontrar vídeos e canais do YouTube
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Search;
