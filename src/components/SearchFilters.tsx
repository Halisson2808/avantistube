import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eraser, Search, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const updateFilter = (key: keyof SearchParams, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Buscar Vídeos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo de busca principal */}
        <div className="flex gap-2">
          <Input
            id="keywords"
            value={filters.keywords}
            onChange={(e) => updateFilter('keywords', e.target.value)}
            placeholder="Digite palavras-chave para buscar..."
            className="h-10"
            required
          />
          <Select
            value={String(filters.maxResults)}
            onValueChange={(v) => updateFilter('maxResults', Number(v))}
          >
            <SelectTrigger className="w-28 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={onSearch}
            disabled={isLoading || !filters.keywords.trim()}
            className="gradient-primary h-10 px-6"
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

        {/* Informações do Conteúdo */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Informações do Conteúdo
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="space-y-1">
              <Label htmlFor="durationMin" className="text-xs">Duração Min (min)</Label>
              <Input
                id="durationMin"
                type="number"
                value={filters.durationMin || ''}
                onChange={(e) => updateFilter('durationMin', Number(e.target.value))}
                placeholder="0"
                min="0"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="durationMax" className="text-xs">Duração Max (min)</Label>
              <Input
                id="durationMax"
                type="number"
                value={filters.durationMax || ''}
                onChange={(e) => updateFilter('durationMax', Number(e.target.value))}
                placeholder="∞"
                min="0"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="viewsMin" className="text-xs">Views Mínimas</Label>
              <Input
                id="viewsMin"
                type="number"
                value={filters.viewsMin || ''}
                onChange={(e) => updateFilter('viewsMin', Number(e.target.value))}
                placeholder="0"
                min="0"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="viewsMax" className="text-xs">Views Máximas</Label>
              <Input
                id="viewsMax"
                type="number"
                value={filters.viewsMax || ''}
                onChange={(e) => updateFilter('viewsMax', Number(e.target.value))}
                placeholder="∞"
                min="0"
                className="h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="space-y-1">
              <Label htmlFor="subscribersMin" className="text-xs">Inscritos Min</Label>
              <Input
                id="subscribersMin"
                type="number"
                value={filters.subscribersMin || ''}
                onChange={(e) => updateFilter('subscribersMin', Number(e.target.value))}
                placeholder="0"
                min="0"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="subscribersMax" className="text-xs">Inscritos Max</Label>
              <Input
                id="subscribersMax"
                type="number"
                value={filters.subscribersMax || ''}
                onChange={(e) => updateFilter('subscribersMax', Number(e.target.value))}
                placeholder="∞"
                min="0"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="publishedAfter" className="text-xs">Publicado Após</Label>
              <Input
                id="publishedAfter"
                type="date"
                value={filters.publishedAfter}
                onChange={(e) => updateFilter('publishedAfter', e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="publishedBefore" className="text-xs">Publicado Antes</Label>
              <Input
                id="publishedBefore"
                type="date"
                value={filters.publishedBefore}
                onChange={(e) => updateFilter('publishedBefore', e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Informações Avançadas - Colapsável */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 hover:bg-muted/50">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Informações Avançadas
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="channelCreatedAfter" className="text-xs">Canal Criado Após</Label>
                <Input
                  id="channelCreatedAfter"
                  type="date"
                  value={filters.channelCreatedAfter}
                  onChange={(e) => updateFilter('channelCreatedAfter', e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="channelCreatedBefore" className="text-xs">Canal Criado Antes</Label>
                <Input
                  id="channelCreatedBefore"
                  type="date"
                  value={filters.channelCreatedBefore}
                  onChange={(e) => updateFilter('channelCreatedBefore', e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label htmlFor="language" className="text-xs">Idioma</Label>
                <Select value={filters.language} onValueChange={(v) => updateFilter('language', v)}>
                  <SelectTrigger id="language" className="h-9">
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

              <div className="space-y-1">
                <Label htmlFor="country" className="text-xs">País</Label>
                <Select value={filters.country} onValueChange={(v) => updateFilter('country', v)}>
                  <SelectTrigger id="country" className="h-9">
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

              <div className="space-y-1">
                <Label htmlFor="quality" className="text-xs">Qualidade</Label>
                <Select value={filters.quality} onValueChange={(v) => updateFilter('quality', v)}>
                  <SelectTrigger id="quality" className="h-9">
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

              <div className="space-y-1">
                <Label htmlFor="sortBy" className="text-xs">Ordenar Por</Label>
                <Select value={filters.sortBy} onValueChange={(v) => updateFilter('sortBy', v)}>
                  <SelectTrigger id="sortBy" className="h-9">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Botão de limpar */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onClear} disabled={isLoading}>
            <Eraser className="w-3 h-3 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
