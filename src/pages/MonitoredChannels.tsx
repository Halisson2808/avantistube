import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Download, Filter, TrendingUp, RefreshCw, Tag } from "lucide-react";
import { ChannelCard } from "@/components/ChannelCard";
import { ChannelGrowthChart } from "@/components/ChannelGrowthChart";
import { useMonitoredChannels, ChannelMonitorData } from "@/hooks/use-monitored-channels";
import { useNiches } from "@/hooks/use-niches";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MonitoredChannels = () => {
  const { channels, addChannel, updateChannelStats, removeChannel, updateNotes, updateNiche, updateContentType } = useMonitoredChannels();
  const { niches } = useNiches();
  
  // Filtros
  const [nicheFilter, setNicheFilter] = useState<string>("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [metricsFilter, setMetricsFilter] = useState<string>("7days");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [chartChannel, setChartChannel] = useState<{ id: string; title: string } | null>(null);
  const [isManageNichesOpen, setIsManageNichesOpen] = useState(false);
  const [editingNiche, setEditingNiche] = useState<{ old: string; new: string } | null>(null);
  
  // Form
  const [channelUrl, setChannelUrl] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [contentType, setContentType] = useState<"longform" | "shorts">("longform");
  const [isLoading, setIsLoading] = useState(false);

  // Get unique niches from all channels
  const uniqueNiches = niches;

  // Função para filtrar e ordenar
  const getFilteredAndSortedChannels = () => {
    let filtered = [...channels];

    // Filtrar por busca
    if (searchQuery.trim()) {
      filtered = filtered.filter(c => 
        c.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por nicho
    if (nicheFilter !== "all") {
      filtered = filtered.filter(c => 
        c.niche?.toLowerCase() === nicheFilter.toLowerCase()
      );
    }

    // Filtrar por tipo de conteúdo
    if (contentTypeFilter !== "all") {
      filtered = filtered.filter(c => 
        c.contentType === contentTypeFilter
      );
    }

    // Ordenar
    switch (sortBy) {
      case "recent":
        return filtered.sort((a, b) => 
          new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
      case "subscribers":
        if (metricsFilter === "lastday") {
          return filtered.sort((a, b) => (b.subscribersLastDay || 0) - (a.subscribersLastDay || 0));
        } else {
          return filtered.sort((a, b) => (b.subscribersLast7Days || 0) - (a.subscribersLast7Days || 0));
        }
      case "views":
        if (metricsFilter === "lastday") {
          return filtered.sort((a, b) => (b.viewsLastDay || 0) - (a.viewsLastDay || 0));
        } else {
          return filtered.sort((a, b) => (b.viewsLast7Days || 0) - (a.viewsLast7Days || 0));
        }
      case "growth":
        if (metricsFilter === "lastday") {
          return filtered.sort((a, b) => (b.subscribersLastDay || 0) - (a.subscribersLastDay || 0));
        } else {
          return filtered.sort((a, b) => (b.subscribersLast7Days || 0) - (a.subscribersLast7Days || 0));
        }
      case "exploding":
        return filtered.sort((a, b) => {
          if (a.isExploding && !b.isExploding) return -1;
          if (!a.isExploding && b.isExploding) return 1;
          return 0;
        });
      default:
        return filtered;
    }
  };

  const filteredChannels = getFilteredAndSortedChannels();
  const explodingChannels = channels.filter(ch => ch.isExploding);

  const handleAddChannel = async () => {
    if (!channelUrl.trim()) {
      toast.error("Digite a URL do canal");
      return;
    }

    setIsLoading(true);
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
        throw new Error(data.error);
      }

      toast.success("Canal adicionado com sucesso!");
      setIsAddDialogOpen(false);
      setChannelUrl("");
      setSelectedNiche("");
      setCustomNiche("");
      setNewNotes("");
      setContentType("longform");
      
      // Recarrega a lista de canais
      window.location.reload();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao adicionar canal";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const exportToCSV = () => {
    const csv = [
      [
        "Nome do Canal",
        "Tipo de Conteúdo", 
        "Nicho",
        "URL do Canal",
        "Inscritos Totais",
        "Views Totais",
        "Vídeos Totais",
        "Crescimento 7d (Inscritos)",
        "Views 7d",
        "Data Adicionado",
        "Notas"
      ].join(","),
      ...filteredChannels.map(ch => [
        `"${ch.channelTitle.replace(/"/g, '""')}"`,
        ch.contentType === "shorts" ? "Shorts" : "Vídeos Longos",
        `"${(ch.niche || "").replace(/"/g, '""')}"`,
        `"https://youtube.com/channel/${ch.channelId}"`,
        ch.currentSubscribers || 0,
        ch.currentViews || 0,
        ch.currentVideos || 0,
        ch.subscribersLast7Days || 0,
        ch.viewsLast7Days || 0,
        new Date(ch.addedAt).toLocaleDateString("pt-BR"),
        `"${(ch.notes || "").replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `canais-monitorados-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("CSV exportado com sucesso!");
  };

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Atualizar monitored_channels
      const { error: monitoredError } = await supabase
        .from('monitored_channels')
        .update({ niche: newNiche })
        .eq('user_id', user.id)
        .eq('niche', oldNiche);

      if (monitoredError) throw monitoredError;

      // Atualizar my_channels
      const { error: myChannelsError } = await supabase
        .from('my_channels')
        .update({ niche: newNiche })
        .eq('user_id', user.id)
        .eq('niche', oldNiche);

      if (myChannelsError) throw myChannelsError;

      toast.success(`Nicho "${oldNiche}" renomeado para "${newNiche}"`);
      setEditingNiche(null);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao renomear nicho:', error);
      toast.error("Erro ao renomear nicho");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Canais Monitorados</h1>
          <p className="text-muted-foreground">
            {channels.length} canais • {explodingChannels.length} em crescimento explosivo
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={async () => {
              toast.info("Atualizando todos os canais...");
              for (const channel of channels) {
                await updateChannelStats(channel.channelId);
              }
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Canais
          </Button>
          <Dialog open={isManageNichesOpen} onOpenChange={setIsManageNichesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Gerenciar Nichos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Gerenciar Nichos</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {uniqueNiches.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum nicho cadastrado ainda.
                  </p>
                ) : (
                  uniqueNiches.map((niche) => (
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
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Canal
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
                      {uniqueNiches.map((niche) => (
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
                  disabled={isLoading}
                  className="w-full gradient-primary"
                >
                  {isLoading ? "Adicionando..." : "Adicionar Canal"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {explodingChannels.length > 0 && (
        <Card className="shadow-card border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Canais em Crescimento Explosivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {explodingChannels.map((channel) => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onUpdate={updateChannelStats}
                  onRemove={removeChannel}
                  onShowChart={(channelId, channelTitle) => setChartChannel({ id: channelId, title: channelTitle })}
                  onUpdateNotes={updateNotes}
                  onUpdateNiche={updateNiche}
                  onUpdateContentType={updateContentType}
                  metricsFilter={metricsFilter as "7days" | "lastday"}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <Input
          placeholder="Buscar canais por nome..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <div className="flex gap-4 flex-wrap">
        <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="longform">Vídeos Longos</SelectItem>
            <SelectItem value="shorts">Shorts</SelectItem>
          </SelectContent>
        </Select>

        <Select value={nicheFilter} onValueChange={setNicheFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Nichos</SelectItem>
            {niches.map((niche) => (
              <SelectItem key={niche} value={niche}>
                {niche}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais Recentes</SelectItem>
            <SelectItem value="subscribers">Mais Inscritos</SelectItem>
            <SelectItem value="views">Mais Visualizações</SelectItem>
            <SelectItem value="growth">Maior Crescimento</SelectItem>
            <SelectItem value="exploding">Em Explosão</SelectItem>
          </SelectContent>
        </Select>

        <Select value={metricsFilter} onValueChange={setMetricsFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Últimos 7 Dias</SelectItem>
            <SelectItem value="lastday">Último Dia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChannels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            onUpdate={updateChannelStats}
            onRemove={removeChannel}
            onShowChart={(channelId, channelTitle) => setChartChannel({ id: channelId, title: channelTitle })}
            onUpdateNotes={updateNotes}
            onUpdateNiche={updateNiche}
            onUpdateContentType={updateContentType}
            metricsFilter={metricsFilter as "7days" | "lastday"}
          />
        ))}
      </div>

      {filteredChannels.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {nicheFilter !== "all" || searchQuery.trim()
                ? "Nenhum canal encontrado com este filtro."
                : "Nenhum canal monitorado ainda. Adicione um canal para começar!"}
            </p>
          </CardContent>
        </Card>
      )}
      </div>

      {chartChannel && (
        <ChannelGrowthChart
          channelId={chartChannel.id}
          channelTitle={chartChannel.title}
          isOpen={!!chartChannel}
          onClose={() => setChartChannel(null)}
        />
      )}
    </div>
  );
};

export default MonitoredChannels;
