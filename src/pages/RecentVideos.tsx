import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Loader2, Filter, X, Clock, TrendingUp, ChevronDown, Plus, Tag, Download, StickyNote, Pencil, Trash2, BarChart3, Users, Eye, Video } from "lucide-react";
import { useRecentVideos } from "@/hooks/use-recent-videos";
import { RecentVideoCard } from "@/components/RecentVideoCard";
import { toast } from "sonner";
import { useNiches } from "@/hooks/use-niches";
import { formatNumber } from "@/lib/youtube-api";
import { supabase } from "@/integrations/supabase/client";
import { ChannelGrowthChart } from "@/components/ChannelGrowthChart";

const RecentVideos = () => {
  const {
    channels,
    isLoadingAll,
    filters,
    setFilters,
    updateProgress,
    isUpdating,
    updateChannelVideos,
    updateChannelsByNiches,
    getAvailableNiches,
    getChannelCountByNiche,
    clearFilters,
    getVideosByChannel,
    loadVideosFromCache,
    filterVideosByDatePeriod,
    getTotalViewsForPeriod,
    updateNotes,
    updateNiche,
    updateContentType,
    removeChannel,
    updateChannelStats,
  } = useRecentVideos();

  const { niches, renameNiche } = useNiches();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Dialog de adicionar canal
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [channelUrl, setChannelUrl] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [contentType, setContentType] = useState<"longform" | "shorts">("longform");
  const [isAddingChannel, setIsAddingChannel] = useState(false);

  // Dialog de gerenciar nichos
  const [isManageNichesOpen, setIsManageNichesOpen] = useState(false);
  const [editingNiche, setEditingNiche] = useState<{ old: string; new: string } | null>(null);

  // Channel action states
  const [showNotesDialog, setShowNotesDialog] = useState<{ channelId: string; notes: string } | null>(null);
  const [showEditDialog, setShowEditDialog] = useState<{ channelId: string; niche: string; contentType: 'longform' | 'shorts' } | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState<string | null>(null);
  const [showChartDialog, setShowChartDialog] = useState<{ channelId: string; channelTitle: string } | null>(null);
  const [editedCustomNiche, setEditedCustomNiche] = useState("");

  // Carregar do cache na inicialização
  useEffect(() => {
    if (isInitialLoad && channels.length > 0) {
      setIsInitialLoad(false);
      loadVideosFromCache();
    }
  }, [isInitialLoad, channels.length, loadVideosFromCache]);

  // Obter categorias únicas (niches) - sincronizado com useNiches que vem do banco
  const categories = useMemo(() => {
    return ['Todos', ...niches];
  }, [niches]);

  const availableNiches = getAvailableNiches();

  // Exportar CSV dos vídeos recentes
  const exportToCSV = () => {
    const allVideos = videosByChannel.flatMap(cd => 
      cd.videos.map(v => ({
        ...v,
        channelNiche: cd.channel.niche,
        channelContentType: cd.channel.contentType,
      }))
    );

    const csv = [
      ["Canal", "Nicho", "Tipo", "Título do Vídeo", "Views", "Likes", "Comentários", "Publicado Em", "URL do Vídeo"].join(","),
      ...allVideos.map(v => [
        `"${v.channelName.replace(/"/g, '""')}"`,
        `"${(v.channelNiche || "").replace(/"/g, '""')}"`,
        v.channelContentType === "shorts" ? "Shorts" : "Longos",
        `"${v.title.replace(/"/g, '""')}"`,
        v.viewCount || 0,
        v.likeCount || 0,
        v.commentCount || 0,
        v.publishedAt ? new Date(v.publishedAt).toLocaleDateString("pt-BR") : "",
        `"https://youtube.com/watch?v=${v.videoId}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `videos-recentes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("CSV exportado com sucesso!");
  };

  // Renomear nicho
  const handleRenameNiche = async (oldNiche: string, newNiche: string) => {
    if (!newNiche.trim()) {
      toast.error("Digite um nome válido");
      return;
    }
    if (oldNiche === newNiche) {
      toast.error("O nome não foi alterado");
      return;
    }

    try {
      const success = await renameNiche(oldNiche, newNiche);
      if (success) {
        toast.success(`Nicho "${oldNiche}" renomeado para "${newNiche}"`);
        setEditingNiche(null);
        window.location.reload();
      } else {
        toast.error("Erro ao renomear nicho");
      }
    } catch (error) {
      console.error('Erro ao renomear nicho:', error);
      toast.error("Erro ao renomear nicho");
    }
  };

  const handleNicheToggle = (niche: string) => {
    setSelectedNiches(prev => 
      prev.includes(niche) 
        ? prev.filter(n => n !== niche)
        : [...prev, niche]
    );
  };

  const handleSelectAllNiches = () => {
    if (selectedNiches.length === availableNiches.length) {
      setSelectedNiches([]);
    } else {
      setSelectedNiches([...availableNiches]);
    }
  };

  const handleUpdateSelected = async () => {
    if (selectedNiches.length === 0) {
      toast.info('Selecione pelo menos um nicho');
      return;
    }
    setIsPopoverOpen(false);
    await updateChannelsByNiches(selectedNiches);
  };

  const totalSelectedChannels = selectedNiches.reduce(
    (sum, niche) => sum + getChannelCountByNiche(niche), 
    0
  );

  const handleAddChannel = async () => {
    if (!channelUrl.trim()) {
      toast.error("Digite a URL do canal");
      return;
    }

    setIsAddingChannel(true);
    try {
      const finalNiche = selectedNiche === "__new__" ? customNiche : selectedNiche;
      
      const { data, error } = await supabase.functions.invoke('add-channel', {
        body: {
          channelInput: channelUrl,
          niche: finalNiche,
          notes: newNotes,
          contentType: contentType,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        if (data.error.includes("already being monitored")) {
          toast.info("Este canal já está sendo monitorado");
          setIsAddDialogOpen(false);
          resetAddForm();
          return;
        }
        throw new Error(data.error);
      }

      toast.success("Canal adicionado com sucesso!");
      setIsAddDialogOpen(false);
      resetAddForm();
      window.location.reload();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao adicionar canal";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsAddingChannel(false);
    }
  };

  const resetAddForm = () => {
    setChannelUrl("");
    setSelectedNiche("");
    setCustomNiche("");
    setNewNotes("");
    setContentType("longform");
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

        <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {/* Botão Gerenciar Nichos */}
          <Dialog open={isManageNichesOpen} onOpenChange={setIsManageNichesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-auto text-xs sm:text-sm">
                <Tag className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Gerenciar Nichos</span>
                <span className="sm:hidden">Nichos</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Gerenciar Nichos</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {niches.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum nicho cadastrado ainda.
                  </p>
                ) : (
                  niches.map((niche) => (
                    <div key={niche} className="flex items-center gap-2">
                      {editingNiche?.old === niche ? (
                        <>
                          <Input
                            value={editingNiche.new}
                            onChange={(e) => setEditingNiche({ old: niche, new: e.target.value })}
                            className="flex-1"
                            placeholder="Novo nome do nicho"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleRenameNiche(editingNiche.old, editingNiche.new)}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNiche(null)}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1 px-3 py-2 rounded-md bg-muted text-sm">
                            {niche}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNiche({ old: niche, new: niche })}
                          >
                            Renomear
                          </Button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Botão Exportar CSV */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            className="flex-1 sm:flex-auto text-xs sm:text-sm"
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>

          {/* Botão Adicionar Canal */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-auto text-xs sm:text-sm">
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Adicionar Canal</span>
                <span className="sm:hidden">Adicionar</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Canal ao Monitoramento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>URL ou ID do Canal</Label>
                  <Input
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    placeholder="UCxxxx, youtube.com/channel/UCxxxx ou youtube.com/@username"
                  />
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: ID do canal, URL completa ou username (@)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Conteúdo *</Label>
                  <Select value={contentType} onValueChange={(value: "longform" | "shorts") => setContentType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="longform">Vídeos Longos</SelectItem>
                      <SelectItem value="shorts">Shorts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nicho (opcional)</Label>
                  <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione ou crie um nicho" />
                    </SelectTrigger>
                    <SelectContent>
                      {niches.map((niche) => (
                        <SelectItem key={niche} value={niche}>
                          {niche}
                        </SelectItem>
                      ))}
                      <SelectItem value="__new__">➕ Novo Nicho</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedNiche === "__new__" && (
                    <Input
                      value={customNiche}
                      onChange={(e) => setCustomNiche(e.target.value)}
                      placeholder="Digite o nome do novo nicho"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Notas (opcional)</Label>
                  <Textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Adicione notas sobre este canal..."
                  />
                </div>
                <Button
                  onClick={handleAddChannel}
                  disabled={isAddingChannel}
                  className="w-full gradient-primary"
                >
                  {isAddingChannel ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    "Adicionar Canal"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Botão Atualizar */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="default"
                size="sm"
                disabled={isUpdating || channels.length === 0}
                className="flex-1 sm:flex-auto gradient-primary"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Selecionar Nichos</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllNiches}
                    className="h-7 text-xs"
                  >
                    {selectedNiches.length === availableNiches.length ? 'Desmarcar' : 'Selecionar'} Todos
                  </Button>
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {availableNiches.map((niche) => (
                    <label
                      key={niche}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedNiches.includes(niche)}
                        onCheckedChange={() => handleNicheToggle(niche)}
                      />
                      <span className="flex-1 text-sm">{niche}</span>
                      <span className="text-xs text-muted-foreground">
                        {getChannelCountByNiche(niche)}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-2 border-t border-border">
                  <Button
                    onClick={handleUpdateSelected}
                    disabled={selectedNiches.length === 0}
                    className="w-full gradient-primary"
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar {totalSelectedChannels} canal(is)
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Busca */}
            <div className="space-y-2">
              <Label className="text-xs">Buscar Canal ou Nicho</Label>
              <Input
                placeholder="🔍 Buscar por nome, ID ou nicho..."
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

            {/* Período (Data) */}
            <div className="space-y-2">
              <Label className="text-xs">Período</Label>
              <Select
                value={filters.datePeriod || 'all'}
                onValueChange={(value: 'all' | '7days' | '30days') => setFilters({ ...filters, datePeriod: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo o tempo</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
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
                  <SelectItem value="recent">Recém Adicionado</SelectItem>
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
                : 'Nenhum vídeo encontrado. Clique em "Atualizar" para buscar os vídeos recentes.'}
            </p>
            {filters.search || filters.category !== 'Todos' || (filters.contentType && filters.contentType !== 'Todos') ? (
              <Button onClick={clearFilters} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Limpar Filtros
              </Button>
            ) : (
              <Button onClick={() => setIsPopoverOpen(true)} className="gradient-primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
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

            // Calcular dias desde adição
            const getDaysSinceAdded = () => {
              if (!channelData.channel.addedAt) return null;
              const diffMs = new Date().getTime() - new Date(channelData.channel.addedAt).getTime();
              const diffDays = Math.floor(diffMs / 86400000);
              
              if (diffDays === 0) return 'Adicionado hoje';
              if (diffDays === 1) return 'Adicionado há 1 dia';
              return `Adicionado há ${diffDays} dias`;
            };

            // Somar views dos vídeos filtrados pelo período
            const totalViews = getTotalViewsForPeriod(channelData.videos, filters.datePeriod || 'all');
            const filteredVideos = filterVideosByDatePeriod(channelData.videos, filters.datePeriod || 'all');
            
            // Label do período para exibição
            const periodLabel = filters.datePeriod === '7days' ? 'últimos 7 dias' : 
                               filters.datePeriod === '30days' ? 'últimos 30 dias' : 'totais';

            // Atualizar canal (vídeos + stats)
            const handleUpdateChannel = async () => {
              await updateChannelVideos(channelData.channel.channelId, true);
              await updateChannelStats(channelData.channel.channelId);
            };

            return (
              <div key={channelData.channel.channelId} className="space-y-4">
                {/* Header do Canal */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {channelData.channel.channelThumbnail && (
                    <a
                      href={`https://youtube.com/channel/${channelData.channel.channelId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                    >
                      <img
                        src={channelData.channel.channelThumbnail}
                        alt={channelData.channel.channelTitle}
                        className="w-10 h-10 rounded-full hover:ring-2 hover:ring-primary transition-all cursor-pointer"
                      />
                    </a>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`https://youtube.com/channel/${channelData.channel.channelId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        <h2 className="text-xl font-bold">
                          {channelData.channel.channelTitle}
                        </h2>
                      </a>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleUpdateChannel}
                          disabled={isUpdating}
                          className="h-7 px-2"
                          title="Atualizar vídeos e stats"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNotesDialog({ 
                            channelId: channelData.channel.channelId, 
                            notes: channelData.channel.notes || '' 
                          })}
                          className="h-7 px-2"
                          title="Notas"
                        >
                          <StickyNote className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowEditDialog({
                            channelId: channelData.channel.channelId,
                            niche: channelData.channel.niche || '',
                            contentType: channelData.channel.contentType || 'longform'
                          })}
                          className="h-7 px-2"
                          title="Editar nicho e formato"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowChartDialog({
                            channelId: channelData.channel.channelId,
                            channelTitle: channelData.channel.channelTitle
                          })}
                          className="h-7 px-2"
                          title="Ver gráfico"
                        >
                          <BarChart3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteAlert(channelData.channel.channelId)}
                          className="h-7 px-2 text-destructive hover:text-destructive"
                          title="Remover"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                      {channelData.channel.niche && (
                        <span className="px-2 py-0.5 bg-muted rounded">{channelData.channel.niche}</span>
                      )}
                      {channelData.channel.contentType && (
                        <span className={`px-2 py-0.5 rounded ${
                          channelData.channel.contentType === 'shorts'
                            ? 'bg-purple-500/10 text-purple-400'
                            : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {channelData.channel.contentType === 'shorts' ? 'Shorts' : 'Longos'}
                        </span>
                      )}
                      <span>{new Intl.NumberFormat('pt-BR').format(channelData.channel.currentSubscribers)} inscritos</span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {new Intl.NumberFormat('pt-BR').format(channelData.channel.currentVideos)} vídeos
                      </span>
                      {filteredVideos.length > 0 && (
                        <span className="flex items-center gap-1 text-primary">
                          <TrendingUp className="w-3 h-3" />
                          {formatNumber(totalViews)} views {periodLabel}
                        </span>
                      )}
                      {getUpdateTimeText() && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getUpdateTimeText()}
                        </span>
                      )}
                      {getDaysSinceAdded() && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-accent/20 rounded text-accent-foreground">
                          <Plus className="w-3 h-3" />
                          {getDaysSinceAdded()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4 Quadros de Estatísticas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Inscritos Totais */}
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>Inscritos</span>
                    </div>
                    <p className="text-lg font-bold">{formatNumber(channelData.channel.currentSubscribers)}</p>
                  </div>
                  {/* Views Totais */}
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>Views</span>
                    </div>
                    <p className="text-lg font-bold">{formatNumber(channelData.channel.currentViews)}</p>
                  </div>
                  {/* Inscritos 7 Dias */}
                  <div className={`p-3 rounded-lg border ${
                    (channelData.channel.subscribersLast7Days || 0) >= 0
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>7 Dias</span>
                    </div>
                    <p className={`text-lg font-bold ${
                      (channelData.channel.subscribersLast7Days || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {(channelData.channel.subscribersLast7Days || 0) >= 0 ? '+' : ''}
                      {formatNumber(channelData.channel.subscribersLast7Days || 0)}
                    </p>
                  </div>
                  {/* Views 7 Dias */}
                  <div className={`p-3 rounded-lg border ${
                    (channelData.channel.viewsLast7Days || 0) >= 0
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>7 Dias</span>
                    </div>
                    <p className={`text-lg font-bold ${
                      (channelData.channel.viewsLast7Days || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {(channelData.channel.viewsLast7Days || 0) >= 0 ? '+' : ''}
                      {formatNumber(channelData.channel.viewsLast7Days || 0)}
                    </p>
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

      {/* Dialog de Notas */}
      <Dialog open={!!showNotesDialog} onOpenChange={(open) => !open && setShowNotesDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notas do Canal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={showNotesDialog?.notes || ''}
              onChange={(e) => setShowNotesDialog(prev => prev ? { ...prev, notes: e.target.value } : null)}
              placeholder="Adicione notas sobre este canal..."
              rows={5}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNotesDialog(null)}>
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  if (showNotesDialog) {
                    await updateNotes(showNotesDialog.channelId, showNotesDialog.notes);
                    setShowNotesDialog(null);
                  }
                }}
                className="gradient-primary"
              >
                Salvar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição */}
      <Dialog open={!!showEditDialog} onOpenChange={(open) => !open && setShowEditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Canal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nicho</Label>
              <Select
                value={showEditDialog?.niche || ''}
                onValueChange={(value) => setShowEditDialog(prev => prev ? { ...prev, niche: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um nicho" />
                </SelectTrigger>
                <SelectContent>
                  {niches.map((niche) => (
                    <SelectItem key={niche} value={niche}>
                      {niche}
                    </SelectItem>
                  ))}
                  <SelectItem value="__new__">➕ Novo Nicho</SelectItem>
                </SelectContent>
              </Select>
              {showEditDialog?.niche === "__new__" && (
                <Input
                  value={editedCustomNiche}
                  onChange={(e) => setEditedCustomNiche(e.target.value)}
                  placeholder="Digite o nome do novo nicho"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Tipo de Conteúdo</Label>
              <Select
                value={showEditDialog?.contentType || 'longform'}
                onValueChange={(value: 'longform' | 'shorts') => 
                  setShowEditDialog(prev => prev ? { ...prev, contentType: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="longform">Vídeos Longos</SelectItem>
                  <SelectItem value="shorts">Shorts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(null)}>
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  if (showEditDialog) {
                    const finalNiche = showEditDialog.niche === "__new__" ? editedCustomNiche : showEditDialog.niche;
                    if (finalNiche && finalNiche.trim()) {
                      await updateNiche(showEditDialog.channelId, finalNiche);
                    }
                    await updateContentType(showEditDialog.channelId, showEditDialog.contentType);
                    setShowEditDialog(null);
                    setEditedCustomNiche("");
                  }
                }}
                className="gradient-primary"
              >
                Salvar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert de Exclusão */}
      <AlertDialog open={!!showDeleteAlert} onOpenChange={(open) => !open && setShowDeleteAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Canal</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este canal do monitoramento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (showDeleteAlert) {
                  await removeChannel(showDeleteAlert);
                  setShowDeleteAlert(null);
                  window.location.reload();
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Gráfico de Crescimento */}
      {showChartDialog && (
        <ChannelGrowthChart
          channelId={showChartDialog.channelId}
          channelTitle={showChartDialog.channelTitle}
          isOpen={!!showChartDialog}
          onClose={() => setShowChartDialog(null)}
        />
      )}
    </div>
  );
};

export default RecentVideos;
