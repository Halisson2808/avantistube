import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Download, Filter, TrendingUp } from "lucide-react";
import { ChannelCard } from "@/components/ChannelCard";
import { useMonitoredChannels, ChannelMonitorData } from "@/hooks/use-monitored-channels";
import { useNiches } from "@/hooks/use-niches";
import { getChannelDetails } from "@/lib/youtube-api";
import { toast } from "sonner";

const MonitoredChannels = () => {
  const { channels, addChannel, updateChannelStats, removeChannel, updateNotes, updateNiche } = useMonitoredChannels();
  const { niches } = useNiches();
  const [filterNiche, setFilterNiche] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [channelUrl, setChannelUrl] = useState("");
  const [newNiche, setNewNiche] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredChannels = channels.filter(ch => 
    filterNiche === "all" || ch.niche === filterNiche
  ).sort((a, b) => {
    if (sortBy === "recent") return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    if (sortBy === "subscribers") return b.currentSubscribers - a.currentSubscribers;
    if (sortBy === "growth") return (b.subscribersLast7Days || 0) - (a.subscribersLast7Days || 0);
    return 0;
  });

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
        niche: newNiche,
        notes: newNotes,
      };

      await addChannel(newChannel);
      setIsAddDialogOpen(false);
      setChannelUrl("");
      setNewNiche("");
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
    const channelIdMatch = input.match(/youtube\.com\/channel\/(UC[\w-]+)/);
    if (channelIdMatch) return channelIdMatch[1];
    if (/^UC[\w-]+$/.test(input)) return input;
    return null;
  };

  const exportToCSV = () => {
    const csv = [
      ["Canal", "Inscritos", "Visualizações", "Crescimento 7d", "Nicho", "Data Adicionado"].join(","),
      ...filteredChannels.map(ch => [
        ch.channelTitle,
        ch.currentSubscribers,
        ch.currentViews,
        ch.subscribersLast7Days || 0,
        ch.niche || "",
        new Date(ch.addedAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
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
                    placeholder="https://youtube.com/channel/UCxxxx ou UCxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nicho (opcional)</Label>
                  <Input
                    value={newNiche}
                    onChange={(e) => setNewNiche(e.target.value)}
                    placeholder="Ex: Tecnologia, Gaming, Educação"
                  />
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

      <div className="flex gap-4">
        <Select value={filterNiche} onValueChange={setFilterNiche}>
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
            <SelectItem value="growth">Maior Crescimento</SelectItem>
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
          />
        ))}
      </div>

      {filteredChannels.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum canal monitorado ainda. Adicione um canal para começar!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonitoredChannels;
