import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Youtube, Edit, Trash2, RefreshCw } from "lucide-react";
import { useMyChannels, MyChannelData } from "@/hooks/use-my-channels";
import { getChannelDetails, formatNumber } from "@/lib/youtube-api";
import { toast } from "sonner";

const MyChannels = () => {
  const { channels, addChannel, updateChannel, removeChannel, updateChannelStats } = useMyChannels();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [channelUrl, setChannelUrl] = useState("");
  const [niche, setNiche] = useState("");
  const [language, setLanguage] = useState("pt");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddChannel = async () => {
    if (!channelUrl.trim()) {
      toast.error("Digite a URL do canal");
      return;
    }

    if (!niche.trim()) {
      toast.error("Selecione um nicho");
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
      setChannelUrl("");
      setNiche("");
      setLanguage("pt");
      setNotes("");
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

  const totalSubscribers = channels.reduce((acc, ch) => acc + ch.currentSubscribers, 0);
  const totalViews = channels.reduce((acc, ch) => acc + ch.currentViews, 0);
  const totalGrowth = channels.reduce((acc, ch) => acc + (ch.currentSubscribers - ch.initialSubscribers), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Canais</h1>
          <p className="text-muted-foreground">
            Gerencie e monitore seus canais do YouTube
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Meu Canal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Meu Canal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>URL ou ID do Canal</Label>
                <Input
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="https://youtube.com/channel/UCxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label>Nicho</Label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um nicho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Educação">Educação</SelectItem>
                    <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                    <SelectItem value="Música">Música</SelectItem>
                    <SelectItem value="Esportes">Esportes</SelectItem>
                    <SelectItem value="Culinária">Culinária</SelectItem>
                    <SelectItem value="Viagens">Viagens</SelectItem>
                    <SelectItem value="Finanças">Finanças</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Idioma Principal</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                    <SelectItem value="fr">Francês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total de Inscritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(totalSubscribers)}</div>
            <p className="text-xs text-green-500 mt-1">
              +{formatNumber(totalGrowth)} desde o início
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(totalViews)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Todos os seus canais
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Canais Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{channels.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Canais gerenciados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <Card key={channel.id} className="shadow-card hover:shadow-primary transition-smooth">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {channel.channelThumbnail && (
                    <img
                      src={channel.channelThumbnail}
                      alt={channel.channelTitle}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <CardTitle className="text-base">{channel.channelTitle}</CardTitle>
                    <p className="text-xs text-muted-foreground">{channel.niche}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Inscritos</p>
                  <p className="text-lg font-bold">{formatNumber(channel.currentSubscribers)}</p>
                  <p className="text-xs text-green-500">
                    +{formatNumber(channel.currentSubscribers - channel.initialSubscribers)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Visualizações</p>
                  <p className="text-lg font-bold">{formatNumber(channel.currentViews)}</p>
                </div>
              </div>

              {channel.notes && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground line-clamp-2">{channel.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateChannelStats(channel.id)}
                  className="flex-1"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Atualizar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeChannel(channel.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {channels.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Youtube className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Adicione Seus Canais</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Comece adicionando seus canais do YouTube para monitorar crescimento e performance
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Canal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyChannels;
