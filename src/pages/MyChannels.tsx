import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Youtube, Edit, Trash2, RefreshCw, TrendingUp, ExternalLink, Globe, Tag, Loader2 } from "lucide-react";
import { useMyChannels, MyChannelData } from "@/hooks/use-my-channels";
import { getChannelDetails, formatNumber } from "@/lib/youtube-api";
import { toast } from "@/hooks/use-toast";
import { ChannelGrowthChart } from "@/components/ChannelGrowthChart";

type SortBy = "addedAtDesc" | "addedAtAsc" | "subscribersDesc" | "viewsDesc";

const MyChannels = () => {
  const { channels, addChannel, updateChannel, removeChannel, updateChannelStats, getUniqueNiches } = useMyChannels();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<MyChannelData | null>(null);
  const [isGrowthChartOpen, setIsGrowthChartOpen] = useState(false);
  const [selectedChannelForChart, setSelectedChannelForChart] = useState<{ id: string; title: string } | null>(null);
  
  const [channelUrl, setChannelUrl] = useState("");
  const [niche, setNiche] = useState("");
  const [language, setLanguage] = useState("pt-BR");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);
  
  // FILTRO E ORDENAÇÃO
  const [nicheFilter, setNicheFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("addedAtDesc");

  const extractChannelId = (url: string): { id: string; type: 'id' | 'username' | 'handle' } | null => {
    const input = url.trim();
    
    // 1. ID Direto
    if (/^UC[\w-]{22}$/.test(input)) {
      return { id: input, type: 'id' };
    }
    
    // 2. URL de Canal
    const channelMatch = input.match(/youtube\.com\/channel\/(UC[\w-]{22})/);
    if (channelMatch) {
      return { id: channelMatch[1], type: 'id' };
    }
    
    // 3. Handle (@username)
    const handleMatch = input.match(/@([\w-]+)/);
    if (handleMatch) {
      return { id: handleMatch[1], type: 'handle' };
    }
    
    // 4. URL Personalizada (/c/ ou /user/)
    const customMatch = input.match(/youtube\.com\/(?:c|user)\/([\w-]+)/);
    if (customMatch) {
      return { id: customMatch[1], type: 'username' };
    }
    
    return null;
  };

  const handleAddChannel = async () => {
    if (!channelUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Digite a URL ou ID do canal.",
      });
      return;
    }

    if (!niche.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Selecione um nicho para o canal.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const extracted = extractChannelId(channelUrl);
      if (!extracted) {
        toast({
          variant: "destructive",
          title: "URL inválida",
          description: "Não foi possível identificar o ID do canal.",
        });
        return;
      }

      const channelId = extracted.id;
      
      // Verifica duplicatas antes de buscar dados
      const isDuplicate = channels.some(ch => ch.channelId === channelId);
      if (isDuplicate) {
        toast({
          variant: "destructive",
          title: "Canal duplicado",
          description: "Este canal já está na sua lista.",
        });
        setIsLoading(false);
        return;
      }

      try {
        const details = await getChannelDetails(channelId);
        
        const newChannel: MyChannelData = {
          id: crypto.randomUUID(),
          channelId: details.id,
          channelTitle: details.title,
          channelThumbnail: details.thumbnail,
          currentSubscribers: details.subscriberCount,
          currentViews: details.viewCount,
          initialSubscribers: details.subscriberCount,
          initialViews: details.viewCount,
          niche,
          language,
          notes,
          addedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };

        await addChannel(newChannel);
        setIsAddDialogOpen(false);
        resetForm();
      } catch (error) {
        // Fallback: criar canal com dados zerados
        console.warn("Erro ao buscar dados, criando canal com dados zerados:", error);
        
        const fallbackChannel: MyChannelData = {
          id: crypto.randomUUID(),
          channelId: channelId,
          channelTitle: `Canal ${channelId}`,
          channelThumbnail: undefined,
          currentSubscribers: 0,
          currentViews: 0,
          initialSubscribers: 0,
          initialViews: 0,
          niche,
          language,
          notes,
          addedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        
        await addChannel(fallbackChannel);
        setIsAddDialogOpen(false);
        resetForm();
        
        toast({
          title: "Canal adicionado",
          description: "Canal adicionado com dados zerados. Atualize para buscar informações.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChannel = (channel: MyChannelData) => {
    setEditingChannel(channel);
    setLanguage(channel.language);
    setNiche(channel.niche);
    setNotes(channel.notes || "");
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingChannel) return;
    
    await updateChannel(editingChannel.id, {
      language,
      niche,
      notes,
    });
    
    setIsEditDialogOpen(false);
    setEditingChannel(null);
    resetForm();
  };

  const handleUpdateAll = async () => {
    setIsUpdatingAll(true);
    
    for (const channel of channels) {
      try {
        await updateChannelStats(channel.id, true);
      } catch (error) {
        console.error(`Erro ao atualizar ${channel.channelTitle}:`, error);
      }
    }
    
    setIsUpdatingAll(false);
    toast({
      title: "Atualização completa",
      description: "Todos os canais foram atualizados.",
    });
  };

  const handleViewGrowth = (channelId: string, channelTitle: string) => {
    setSelectedChannelForChart({ id: channelId, title: channelTitle });
    setIsGrowthChartOpen(true);
  };

  const handleViewChannel = (channelId: string) => {
    window.open(`https://youtube.com/channel/${channelId}`, '_blank');
  };

  const resetForm = () => {
    setChannelUrl("");
    setNiche("");
    setLanguage("pt-BR");
    setNotes("");
  };

  // 1. Filtrar canais por nicho
  const filteredByNiche = nicheFilter === "all" 
    ? channels 
    : channels.filter(ch => ch.niche.toLowerCase() === nicheFilter);

  // 2. Ordenar canais
  const sortedChannels = [...filteredByNiche].sort((a, b) => {
    switch (sortBy) {
      case "addedAtDesc":
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case "addedAtAsc":
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      case "subscribersDesc":
        return b.currentSubscribers - a.currentSubscribers;
      case "viewsDesc":
        return b.currentViews - a.currentViews;
      default:
        return 0; // Mantém a ordem original para o caso default
    }
  });

  // Estatísticas totais (usando a lista filtrada/ordenada)
  const channelsToCalculate = sortedChannels;
  const totalSubscribers = channelsToCalculate.reduce((acc, ch) => acc + ch.currentSubscribers, 0);
  const totalViews = channelsToCalculate.reduce((acc, ch) => acc + ch.currentViews, 0);
  const totalGrowth = channelsToCalculate.reduce((acc, ch) => acc + (ch.currentSubscribers - ch.initialSubscribers), 0);
  const totalViewsGrowth = channelsToCalculate.reduce((acc, ch) => acc + (ch.currentViews - ch.initialViews), 0);

  const uniqueNiches = getUniqueNiches();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Canais</h1>
          <p className="text-muted-foreground">
            Gerencie e monitore seus canais do YouTube
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleUpdateAll}
            disabled={isUpdatingAll || channels.length === 0}
          >
            {isUpdatingAll ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Atualizar Todos
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Canal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Meu Canal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>URL ou ID do Canal *</Label>
                  <Input
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    placeholder="UCxxxx, @username, ou URL completa"
                  />
                  <p className="text-xs text-muted-foreground">
                    Aceita: ID, @handle, /channel/, /c/, /user/
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Nicho *</Label>
                  <Input
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Ex: Tecnologia, Gaming, Educação"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Idioma Principal</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (BR)</SelectItem>
                      <SelectItem value="en-US">Inglês (US)</SelectItem>
                      <SelectItem value="es-ES">Espanhol</SelectItem>
                      <SelectItem value="fr-FR">Francês</SelectItem>
                      <SelectItem value="de-DE">Alemão</SelectItem>
                      <SelectItem value="it-IT">Italiano</SelectItem>
                      <SelectItem value="ja-JP">Japonês (JP)</SelectItem>
                      <SelectItem value="ko-KR">Coreano</SelectItem>
                      <SelectItem value="zh-CN">Chinês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notas (Opcional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Observações sobre este canal..."
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleAddChannel}
                  disabled={isLoading}
                  className="w-full gradient-primary"
                >
                  {isLoading ? (
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
        </div>
      </div>

      {/* Filtro e Ordenação */}
      {channels.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <Label className="text-sm font-medium">Filtrar por nicho:</Label>
          <Select value={nicheFilter} onValueChange={setNicheFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos ({channels.length})</SelectItem>
              {uniqueNiches.map(n => {
                const count = channels.filter(ch => ch.niche.toLowerCase() === n).length;
                return (
                  <SelectItem key={n} value={n}>
                    {n.charAt(0).toUpperCase() + n.slice(1)} ({count})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          <Label className="text-sm font-medium ml-4">Ordenar por:</Label>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="addedAtDesc">Mais Recentes</SelectItem>
              <SelectItem value="addedAtAsc">Mais Antigos</SelectItem>
              <SelectItem value="subscribersDesc">Mais Inscritos</SelectItem>
              <SelectItem value="viewsDesc">Mais Visualizações</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground">
            {sortedChannels.length} de {channels.length} canais
          </span>
        </div>
      )}

      {/* Cards de Estatísticas */}
      {sortedChannels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Inscritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalSubscribers)}</div>
              <p className="text-xs text-green-500 mt-1">
                +{formatNumber(totalGrowth)} desde início
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalViews)}</div>
              <p className="text-xs text-green-500 mt-1">
                +{formatNumber(totalViewsGrowth)} desde início
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Canais Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sortedChannels.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Canais gerenciados
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Crescimento Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sortedChannels.length > 0 
                  ? formatNumber(Math.floor(totalGrowth / sortedChannels.length))
                  : "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Por canal
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Canais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedChannels.map((channel) => (
          <Card key={channel.id} className="shadow-card hover:shadow-primary transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {channel.channelThumbnail && (
                    <img
                      src={channel.channelThumbnail}
                      alt={channel.channelTitle}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{channel.channelTitle}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Globe className="w-3 h-3" />
                        {channel.language.split('-')[0].toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs gap-1">
                        <Tag className="w-3 h-3" />
                        {channel.niche}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Inscritos</p>
                  <p className="text-lg font-bold">{formatNumber(channel.currentSubscribers)}</p>
                  <p className="text-xs text-green-500">
                    +{formatNumber(channel.currentSubscribers - channel.initialSubscribers)}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Visualizações</p>
                  <p className="text-lg font-bold">{formatNumber(channel.currentViews)}</p>
                  <p className="text-xs text-green-500">
                    +{formatNumber(channel.currentViews - channel.initialViews)}
                  </p>
                </div>
              </div>

              {channel.notes && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground line-clamp-2">{channel.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-5 gap-1 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateChannelStats(channel.id)}
                  title="Atualizar estatísticas"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditChannel(channel)}
                  title="Editar canal"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewGrowth(channel.channelId, channel.channelTitle)}
                  title="Ver crescimento"
                >
                  <TrendingUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewChannel(channel.channelId)}
                  title="Ver no YouTube"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeChannel(channel.id)}
                  title="Remover canal"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado Vazio */}
      {channels.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Youtube className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum canal cadastrado</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Adicione seus canais do YouTube para começar a monitorar crescimento e performance
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Canal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Canal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Idioma Principal</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (BR)</SelectItem>
                  <SelectItem value="en-US">Inglês (US)</SelectItem>
                  <SelectItem value="es-ES">Espanhol</SelectItem>
                  <SelectItem value="fr-FR">Francês</SelectItem>
                  <SelectItem value="de-DE">Alemão</SelectItem>
                  <SelectItem value="it-IT">Italiano</SelectItem>
                  <SelectItem value="ja-JP">Japonês (JP)</SelectItem>
                  <SelectItem value="ko-KR">Coreano</SelectItem>
                  <SelectItem value="zh-CN">Chinês</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nicho</Label>
              <Input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Tecnologia, Gaming, Educação"
              />
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações sobre este canal..."
                rows={3}
              />
            </div>
            <Button
              onClick={handleSaveEdit}
              className="w-full gradient-primary"
            >
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gráfico de Crescimento */}
      {selectedChannelForChart && (
        <ChannelGrowthChart
          channelId={selectedChannelForChart.id}
          channelTitle={selectedChannelForChart.title}
          isOpen={isGrowthChartOpen}
          onClose={() => {
            setIsGrowthChartOpen(false);
            setSelectedChannelForChart(null);
          }}
        />
      )}
    </div>
  );
};

export default MyChannels;
