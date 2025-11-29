import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Download, Filter, TrendingUp, BarChart3, RefreshCw, Tag } from "lucide-react";
import { ChannelCard } from "@/components/ChannelCard";
import { ChannelGrowthChart } from "@/components/ChannelGrowthChart";
import { useMonitoredChannels, ChannelMonitorData } from "@/hooks/use-monitored-channels";
import { useNiches } from "@/hooks/use-niches";
import { getChannelDetails } from "@/lib/youtube-api";
import { toast } from "sonner";

const MonitoredChannels = () => {
  const { channels, addChannel, updateChannelStats, removeChannel } = useMonitoredChannels();
  const { niches } = useNiches();
  
  // Filtros
  const [nicheFilter, setNicheFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [metricsFilter, setMetricsFilter] = useState<string>("7days");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [chartChannel, setChartChannel] = useState<{ id: string; title: string } | null>(null);
  
  // Form
  const [channelUrl, setChannelUrl] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [newNotes, setNewNotes] = useState("");
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

    // Ordenar
    switch (sortBy) {
      case "recent":
        return filtered.sort((a, b) => 
          new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
      case "subscribers":
        return filtered.sort((a, b) => b.currentSubscribers - a.currentSubscribers);
      case "views":
        if (metricsFilter === "lastday") {
          return filtered.sort((a, b) => (b.viewsLastDay || 0) - (a.viewsLastDay || 0));
        } else {
          return filtered.sort((a, b) => (b.viewsLast7Days || 0) - (a.viewsLast7Days || 0));
        }
      case "growth":
        return filtered.sort((a, b) => {
          const growthA = a.initialSubscribers > 0 
            ? ((a.currentSubscribers - a.initialSubscribers) / a.initialSubscribers) * 100 
            : 0;
          const growthB = b.initialSubscribers > 0
            ? ((b.currentSubscribers - b.initialSubscribers) / b.initialSubscribers) * 100
            : 0;
          return growthB - growthA;
        });
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
      const channelId = extractChannelId(channelUrl);
      if (!channelId) {
        toast.error("URL inválida");
        return;
      }

      const details = await getChannelDetails(channelId);
      
      // Determine final niche value
      const finalNiche = selectedNiche === "__new__" ? customNiche : selectedNiche;
      
      const newChannel: ChannelMonitorData = {
        id: crypto.randomUUID(),
        channelId: details.id,
        channelTitle: details.title,
        channelThumbnail: details.thumbnail,
        currentSubscribers: details.subscriberCount,
        currentViews: details.viewCount,
        initialSubscribers: details.subscriberCount,
        initialViews: details.viewCount,
        addedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        niche: finalNiche,
        notes: newNotes,
      };

      await addChannel(newChannel);
      toast.success("Canal adicionado com sucesso!");
      setIsAddDialogOpen(false);
      setChannelUrl("");
      setSelectedNiche("");
      setCustomNiche("");
      setNewNotes("");
    } catch (error) {
      toast.error("Erro ao adicionar canal");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractChannelId = (url: string): string | null => {
    const input = url.trim();
    
    // 1. Channel ID direto: UCxxxxxx
    if (input.startsWith('UC') && input.length === 24) {
      return input;
    }
    
    // 2. URL completa: youtube.com/channel/UCxxxxxx
    const channelMatch = input.match(/youtube\.com\/channel\/([^/?]+)/);
    if (channelMatch) {
      return channelMatch[1];
    }
    
    // 3. Username: youtube.com/@username ou youtube.com/c/username
    const usernameMatch = input.match(/youtube\.com\/(@|c\/)([^/?]+)/);
    if (usernameMatch) {
      return `@${usernameMatch[2]}`;
    }
    
    return null;
  };

  const exportToCSV = () => {
    const csv = [
      ["Canal", "Inscritos", "Visualizações", "Crescimento 7d", "Nicho", "Data Adicionado"].join(","),
      ...filteredChannels.map(ch => [
        `"${ch.channelTitle}"`,
        ch.currentSubscribers,
        ch.currentViews,
        ch.subscribersLast7Days || 0,
        `"${ch.niche || ""}"`,
        new Date(ch.addedAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canais-monitorados.csv";
    a.click();
    toast.success("Exportado com sucesso!");
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
          <Button variant="outline" onClick={() => toast.info("Atualizando todos os canais...")}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Canais
          </Button>
          <Button variant="outline" onClick={() => toast.info("Gerenciamento de nichos em breve...")}>
            <Tag className="w-4 h-4 mr-2" />
            Gerenciar Nichos
          </Button>
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
          <div key={channel.id} className="relative">
            <ChannelCard
              channel={channel}
              onUpdate={updateChannelStats}
              onRemove={removeChannel}
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setChartChannel({ id: channel.channelId, title: channel.channelTitle })}
            >
              <BarChart3 className="w-3 h-3" />
            </Button>
          </div>
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
