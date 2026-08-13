import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RefreshCw, Loader2, Plus, Trash2, Video, Search, X, Users, Eye } from "lucide-react";
import { toast } from "sonner";
import { formatNumber } from "@/lib/youtube-api";
import { useMyChannels, MyChannelVideosData } from "@/hooks/use-my-channels";

const ChannelCard = ({
  data,
  isUpdating,
  onUpdate,
  onDelete,
}: {
  data: MyChannelVideosData;
  isUpdating: boolean;
  onUpdate: () => void;
  onDelete: () => void;
}) => {
  const { channel, videos } = data;
  const isDeleted = !!data.channelDeleted;
  const sorted = [...videos].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const top3 = sorted.slice(0, 3);

  if (isDeleted) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 overflow-hidden">
        <div className="p-3 flex items-center gap-2">
          {channel.channelThumbnail ? (
            <img src={channel.channelThumbnail} alt={channel.channelTitle} className="w-8 h-8 rounded-full grayscale opacity-60 shrink-0" loading="lazy" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/[0.08] shrink-0 flex items-center justify-center">
              <Video className="w-3.5 h-3.5 text-white/30" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate leading-tight line-through text-white/50">{channel.channelTitle}</p>
            <p className="text-[9px] text-destructive mt-0.5">⚠️ Canal caído / sem vídeos</p>
          </div>
          <div className="flex gap-0.5 shrink-0">
            <Button variant="ghost" size="sm" onClick={onUpdate} disabled={isUpdating} className="h-5 w-5 p-0 hover:bg-white/[0.08]" title="Tentar de novo">
              {isUpdating ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <RefreshCw className="w-2.5 h-2.5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="h-5 w-5 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10" title="Remover">
              <Trash2 className="w-2.5 h-2.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-all overflow-hidden flex flex-col">
      <div className="p-3 flex flex-col gap-2.5 flex-1">
        <div className="flex items-start gap-2">
          {channel.channelThumbnail ? (
            <a href={`https://youtube.com/channel/${channel.channelId}`} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <img src={channel.channelThumbnail} alt={channel.channelTitle} className="w-8 h-8 rounded-full" loading="lazy" referrerPolicy="no-referrer" />
            </a>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/[0.08] shrink-0 flex items-center justify-center">
              <Video className="w-3.5 h-3.5 text-white/30" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <a href={`https://youtube.com/channel/${channel.channelId}`} target="_blank" rel="noopener noreferrer">
              <p className="text-xs font-semibold truncate leading-tight hover:text-primary transition-colors">{channel.channelTitle}</p>
            </a>
          </div>
          <div className="flex gap-0.5 shrink-0">
            <Button variant="ghost" size="sm" onClick={onUpdate} disabled={isUpdating} className="h-5 w-5 p-0 hover:bg-white/[0.08]" title="Atualizar">
              {isUpdating ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <RefreshCw className="w-2.5 h-2.5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="h-5 w-5 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10" title="Remover">
              <Trash2 className="w-2.5 h-2.5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {top3.map(v => (
            <a key={v.videoId} href={`https://youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noopener noreferrer" className="relative block aspect-video rounded overflow-hidden bg-white/[0.05]">
              {v.thumbnailUrl && <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />}
              <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] px-1 py-0.5 rounded font-medium leading-none">{formatNumber(v.viewCount)}</span>
            </a>
          ))}
          {Array.from({ length: Math.max(0, 3 - top3.length) }).map((_, i) => (
            <div key={i} className="aspect-video rounded bg-white/[0.03] border border-white/[0.05]" />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1">
          {[
            { icon: Users, value: formatNumber(channel.currentSubscribers), label: 'Inscritos' },
            { icon: Eye, value: formatNumber(channel.currentViews), label: 'Views' },
            { icon: Video, value: String(channel.currentVideos), label: 'Vídeos' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-center">
              <p className="text-[11px] font-bold leading-none">{value}</p>
              <p className="text-[8px] text-white/30 uppercase tracking-wide leading-none">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MeusCanais = () => {
  const { channels, isLoading, videosData, isUpdatingAll, loadChannels, addOneChannel, refreshChannel, removeChannel, updateAllChannels } = useMyChannels();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [channelUrl, setChannelUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const resetAddForm = () => {
    setChannelUrl("");
    setBulkUrls("");
    setIsBulkMode(false);
  };

  const runUpdate = async (channelId: string) => {
    setUpdatingIds(prev => new Set(prev).add(channelId));
    try {
      await refreshChannel(channelId);
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(channelId);
        return next;
      });
    }
  };

  const handleAdd = async () => {
    if (isBulkMode) {
      const lines = Array.from(new Set(bulkUrls.split('\n').map(l => l.trim()).filter(Boolean)));
      if (lines.length === 0) {
        toast.error("Cole ao menos um link de canal (1 por linha)");
        return;
      }
      setIsAdding(true);
      const settled = await Promise.allSettled(lines.map(url => addOneChannel(url)));
      let added = 0, duplicated = 0, failed = 0;
      const newIds: string[] = [];
      settled.forEach(r => {
        if (r.status === 'fulfilled') {
          if (r.value.status === 'duplicate') duplicated++;
          else { added++; if (r.value.channelId) newIds.push(r.value.channelId); }
        } else failed++;
      });
      const parts = [`${added} canal(is) adicionado(s)`];
      if (duplicated) parts.push(`${duplicated} já salvo(s)`);
      if (failed) parts.push(`${failed} falharam`);
      toast[failed > 0 && added === 0 ? 'error' : 'success'](parts.join(' • '));
      setIsAddOpen(false);
      resetAddForm();
      setIsAdding(false);
      await loadChannels();
      newIds.forEach(id => runUpdate(id));
      return;
    }

    if (!channelUrl.trim()) {
      toast.error("Digite a URL do canal");
      return;
    }
    setIsAdding(true);
    try {
      const result = await addOneChannel(channelUrl.trim());
      if (result.status === 'duplicate') {
        toast.info('Este canal já está salvo');
      } else {
        toast.success('Canal salvo! Buscando dados em segundo plano...');
        if (result.channelId) runUpdate(result.channelId);
      }
      setIsAddOpen(false);
      resetAddForm();
      await loadChannels();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar canal');
    } finally {
      setIsAdding(false);
    }
  };

  const list = useMemo(() => {
    const all = Array.from(videosData.values());
    const filtered = search.trim()
      ? all.filter(d => d.channel.channelTitle.toLowerCase().includes(search.trim().toLowerCase()))
      : all;
    return filtered.sort((a, b) => new Date(b.channel.addedAt).getTime() - new Date(a.channel.addedAt).getTime());
  }, [videosData, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Meus Canais</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {channels.length} canal(is) salvo(s) • sem nicho, só salva e pronto
          </p>
        </div>

        <div className="flex gap-1.5 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            disabled={isUpdatingAll || channels.length === 0}
            onClick={updateAllChannels}
            className="text-xs h-8 px-3 bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-40"
          >
            {isUpdatingAll ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
            Atualizar Todos
          </Button>

          <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetAddForm(); }}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs h-8 px-3 bg-red-500/15 border border-red-500/25 text-red-300 hover:bg-red-500/25 hover:text-red-200 transition-all">
                <Plus className="w-3.5 h-3.5 mr-1.5" />Salvar Canal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Salvar Canal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="mb-0">{isBulkMode ? "Vários Canais (1 por linha)" : "URL ou ID do Canal"}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsBulkMode(v => !v)}
                  >
                    {isBulkMode ? "Adicionar 1 canal" : "Adicionar vários"}
                  </Button>
                </div>
                {isBulkMode ? (
                  <Textarea
                    value={bulkUrls}
                    onChange={(e) => setBulkUrls(e.target.value)}
                    placeholder={"youtube.com/@canal1\nyoutube.com/@canal2\nUCxxxxxxxxxxxxxxxxxxxxxx"}
                    rows={6}
                    className="font-mono text-xs"
                  />
                ) : (
                  <Input
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    placeholder="UCxxxx, youtube.com/channel/UCxxxx ou youtube.com/@username"
                    autoFocus
                  />
                )}
                <Button onClick={handleAdd} disabled={isAdding} className="w-full gradient-primary">
                  {isAdding
                    ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>)
                    : (isBulkMode ? "Salvar Canais" : "Salvar Canal")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {channels.length > 0 && (
        <div className="flex items-center gap-2 px-3 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03]">
          <Search className="w-4 h-4 text-white/30 shrink-0" />
          <Input
            placeholder="Buscar por nome do canal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-0 bg-transparent h-full p-0 text-sm focus-visible:ring-0 focus-visible:outline-none placeholder:text-white/30 min-w-0"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-white/30 hover:text-white/60 shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {search ? 'Nenhum canal encontrado.' : 'Nenhum canal salvo ainda. Clique em "Salvar Canal".'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {list.map((data) => (
            <ChannelCard
              key={data.channel.channelId}
              data={data}
              isUpdating={updatingIds.has(data.channel.channelId)}
              onUpdate={() => runUpdate(data.channel.channelId)}
              onDelete={() => setDeleteId(data.channel.channelId)}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Canal</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja remover este canal? Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) removeChannel(deleteId);
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeusCanais;
