import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eraser, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface SearchParams {
  searchType: 'videos' | 'channels';
  keywords: string;
  durationMin: number;
  durationMax: number;
  subscribersMin: number;
  subscribersMax: number;
  channelCreatedAfter: string;
  channelCreatedBefore: string;
  viewsMin: number;
  viewsMax: number;
  language: string;
  country: string;
  quality: string;
  sortBy: string;
  publishedAfter: string;
  publishedBefore: string;
  maxResults: number;
}

interface SearchFiltersProps {
  filters: SearchParams;
  onFiltersChange: (filters: SearchParams) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export const SearchFilters = ({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  isLoading
}: SearchFiltersProps) => {
  const updateFilter = (key: keyof SearchParams, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Buscar Vídeos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Campo de busca principal */}
        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-base font-semibold">
            Palavras-chave *
          </Label>
          <div className="flex gap-2">
            <Input
              id="keywords"
              value={filters.keywords}
              onChange={(e) => updateFilter('keywords', e.target.value)}
              placeholder="Digite palavras-chave para buscar..."
              className="h-12"
              required
            />
            <Button
              onClick={onSearch}
              disabled={isLoading || !filters.keywords.trim()}
              className="gradient-primary h-12 px-6"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Informações do Conteúdo */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Informações do Conteúdo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationMin">Duração Mínima (minutos)</Label>
              <Input
                id="durationMin"
                type="number"
                value={filters.durationMin || ''}
                onChange={(e) => updateFilter('durationMin', Number(e.target.value))}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationMax">Duração Máxima (minutos)</Label>
              <Input
                id="durationMax"
                type="number"
                value={filters.durationMax || ''}
                onChange={(e) => updateFilter('durationMax', Number(e.target.value))}
                placeholder="Sem limite"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="viewsMin">Visualizações Mínimas</Label>
              <Input
                id="viewsMin"
                type="number"
                value={filters.viewsMin || ''}
                onChange={(e) => updateFilter('viewsMin', Number(e.target.value))}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="viewsMax">Visualizações Máximas</Label>
              <Input
                id="viewsMax"
                type="number"
                value={filters.viewsMax || ''}
                onChange={(e) => updateFilter('viewsMax', Number(e.target.value))}
                placeholder="Sem limite"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publishedAfter">Data Publicação (Início)</Label>
              <Input
                id="publishedAfter"
                type="date"
                value={filters.publishedAfter}
                onChange={(e) => updateFilter('publishedAfter', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedBefore">Data Publicação (Fim)</Label>
              <Input
                id="publishedBefore"
                type="date"
                value={filters.publishedBefore}
                onChange={(e) => updateFilter('publishedBefore', e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Informações Avançadas */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Informações Avançadas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subscribersMin">Inscritos Mínimos do Canal</Label>
              <Input
                id="subscribersMin"
                type="number"
                value={filters.subscribersMin || ''}
                onChange={(e) => updateFilter('subscribersMin', Number(e.target.value))}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscribersMax">Inscritos Máximos do Canal</Label>
              <Input
                id="subscribersMax"
                type="number"
                value={filters.subscribersMax || ''}
                onChange={(e) => updateFilter('subscribersMax', Number(e.target.value))}
                placeholder="Sem limite"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="channelCreatedAfter">Data Criação Canal (Início)</Label>
              <Input
                id="channelCreatedAfter"
                type="date"
                value={filters.channelCreatedAfter}
                onChange={(e) => updateFilter('channelCreatedAfter', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channelCreatedBefore">Data Criação Canal (Fim)</Label>
              <Input
                id="channelCreatedBefore"
                type="date"
                value={filters.channelCreatedBefore}
                onChange={(e) => updateFilter('channelCreatedBefore', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={filters.language} onValueChange={(v) => updateFilter('language', v)}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Qualquer</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">Inglês</SelectItem>
                  <SelectItem value="es">Espanhol</SelectItem>
                  <SelectItem value="fr">Francês</SelectItem>
                  <SelectItem value="de">Alemão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Select value={filters.country} onValueChange={(v) => updateFilter('country', v)}>
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Qualquer</SelectItem>
                  <SelectItem value="BR">Brasil</SelectItem>
                  <SelectItem value="US">EUA</SelectItem>
                  <SelectItem value="GB">Reino Unido</SelectItem>
                  <SelectItem value="PT">Portugal</SelectItem>
                  <SelectItem value="ES">Espanha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quality">Qualidade</Label>
              <Select value={filters.quality} onValueChange={(v) => updateFilter('quality', v)}>
                <SelectTrigger id="quality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Qualquer</SelectItem>
                  <SelectItem value="hd">HD</SelectItem>
                  <SelectItem value="fullhd">Full HD</SelectItem>
                  <SelectItem value="4k">4K</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortBy">Ordenar Por</Label>
              <Select value={filters.sortBy} onValueChange={(v) => updateFilter('sortBy', v)}>
                <SelectTrigger id="sortBy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="date">Mais recente</SelectItem>
                  <SelectItem value="viewCount">Visualizações</SelectItem>
                  <SelectItem value="rating">Avaliação</SelectItem>
                  <SelectItem value="title">Título A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxResults">Número de Resultados</Label>
            <Select
              value={String(filters.maxResults)}
              onValueChange={(v) => updateFilter('maxResults', Number(v))}
            >
              <SelectTrigger id="maxResults" className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 vídeos</SelectItem>
                <SelectItem value="25">25 vídeos</SelectItem>
                <SelectItem value="50">50 vídeos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Botões de ação */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClear} disabled={isLoading}>
            <Eraser className="w-4 h-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
