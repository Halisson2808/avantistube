import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RefreshCw, Loader2, Plus, Trash2, Video, Search, X, Users, Eye, Clock, AlignJustify, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { formatNumber } from "@/lib/youtube-api";
import { useRecentVideos, ChannelVideosData } from "@/hooks/use-recent-videos";
import { RecentVideoCard } from "@/components/RecentVideoCard";

const LOCAL_API = '/api';

/* Card compacto pro modo grade — mesmo visual do Monitoramento, sem tags. */
const CompactChannelCard = ({
  data,
  isUpdating,
  onUpdate,
  onDelete,
}: {
  data: ChannelVideosData;
  isUpdating: boolean;
  onUpdate: () => void;
  onDelete: () => void;
}) => {
  const { channel, videos } = data;
  const isDeleted = !!data.channelDeleted;
  const sorted = [...videos].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const top3 = sorted.slice(0, 3);

  if (isDeleted) {
    const downLabel = data.channelExists === false
      ? '⚠️ Canal caído / encerrado'
      : '🔒 Vídeos privados/removidos — canal ativo';
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 overflow-hidden">
        <div className="p-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            {channel.channelThumbnail ? (
              <img src={channel.channelThumbnail} alt={channel.channelTitle} className="w-8 h-8 rounded-full grayscale opacity-60 shrink-0" loading="lazy" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/[0.08] shrink-0 flex items-center justify-center">
                <Video className="w-3.5 h-3.5 text-white/30" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate leading-tight line-through text-white/50">{channel.channelTitle}</p>
              <p className="text-[9px] text-destructive mt-0.5">{downLabel}</p>
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
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-1 opacity-50 grayscale">
              {top3.map(v => (
                <div key={v.videoId} className="relative block aspect-video rounded overflow-hidden bg-white/[0.05]">
                  {v.thumbnailUrl && <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />}
                </div>
              ))}
            </div>
          )}
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
            { value: formatNumber(channel.currentSubscribers), label: 'Inscritos' },
            { value: formatNumber(channel.currentViews), label: 'Views' },
            { value: String(channel.currentVideos), label: 'Vídeos' },
          ].map(({ value, label }) => (
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
  const {
    channels,
    filters,
    setFilters,
    isUpdating,
    updateChannelVideos,
    updateSingleChannel,
    getVideosByChannel,
    loadVideosFromCache,
    updateChannelStats,
    removeChannel,
    updateAllChannels,
  } = useRecentVideos('own');

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showExactTime, setShowExactTime] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [channelUrl, setChannelUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Carrega vídeos do cache assim que os canais chegam.
  useEffect(() => {
    if (isInitialLoad && channels.length > 0) {
      setIsInitialLoad(false);
      loadVideosFromCache();
    }
  }, [isInitialLoad, channels.length, loadVideosFromCache]);

  // Lista pessoal pequena: mostra tudo por padrão, inclusive canal caído.
  useEffect(() => {
    setFilters(f => ({ ...f, channelStatus: 'all' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetAddForm = () => {
    setChannelUrl("");
    setBulkUrls("");
    setIsBulkMode(false);
  };

  const addOneChannel = async (url: string): Promise<{ status: 'added' | 'duplicate'; channelId?: string }> => {
    const res = await fetch(`${LOCAL_API}/channels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelInput: url, isOwnChannel: true }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 409 || data.error?.includes('already being monitored')) {
      return { status: 'duplicate' };
    }
    if (!res.ok) throw new Error(data.error || `Erro ao adicionar "${url}"`);
    return { status: 'added', channelId: data.channel?.channel_id };
  };

  const addManyChannels = async (urls: string[]) => {
    const lines = Array.from(new Set(urls.map(l => l.trim()).filter(Boolean)));
    if (lines.length === 0) {
      toast.error("Cole ao menos um link de canal");
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
    newIds.forEach(id => updateSingleChannel(id).catch(() => {}));
  };

  const handleAdd = async () => {
    if (isBulkMode) {
      await addManyChannels(bulkUrls.split(/[\s,]+/));
      return;
    }

    if (!channelUrl.trim()) {
      toast.error("Digite a URL do canal");
      return;
    }

    // Detecta automaticamente se vieram vários links colados no campo único.
    const tokens = Array.from(new Set(channelUrl.split(/[\s,]+/).map(t => t.trim()).filter(Boolean)));
    if (tokens.length > 1) {
      await addManyChannels(tokens);
      return;
    }

    setIsAdding(true);
    try {
      const result = await addOneChannel(channelUrl.trim());
      if (result.status === 'duplicate') {
        toast.info('Este canal já está salvo');
      } else {
        toast.success('Canal salvo! Buscando dados em segundo plano...');
        if (result.channelId) updateSingleChannel(result.channelId).catch(() => {});
      }
      setIsAddOpen(false);
      resetAddForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar canal');
    } finally {
      setIsAdding(false);
    }
  };

  const videosByChannel = useMemo(() => getVideosByChannel(), [getVideosByChannel]);

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
            disabled={isUpdating || channels.length === 0}
            onClick={updateAllChannels}
            className="text-xs h-8 px-3 bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-40"
          >
            {isUpdating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
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
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] flex-1">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <Input
              placeholder="Buscar por nome do canal..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 border-0 bg-transparent h-full p-0 text-sm focus-visible:ring-0 focus-visible:outline-none placeholder:text-white/30 min-w-0"
            />
            {filters.search && (
              <button onClick={() => setFilters({ ...filters, search: '' })} className="text-white/30 hover:text-white/60 shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExactTime(!showExactTime)}
            className={`text-xs h-11 px-3 border transition-all shrink-0 ${showExactTime
              ? "bg-white/10 border-white/20 text-white"
              : "bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" />{showExactTime ? "Hora Exata" : "Tempo Relativo"}
          </Button>

          <div className="flex items-center border border-white/[0.08] rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`h-11 px-2.5 flex items-center transition-colors ${viewMode === 'list' ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05]'}`}
              title="Modo lista"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`h-11 px-2.5 flex items-center border-l border-white/[0.08] transition-colors ${viewMode === 'grid' ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05]'}`}
              title="Modo grade compacto"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {videosByChannel.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {filters.search ? 'Nenhum canal encontrado.' : 'Nenhum canal salvo ainda. Clique em "Salvar Canal".'}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {videosByChannel.map((data) => (
            <CompactChannelCard
              key={data.channel.channelId}
              data={data}
              isUpdating={isUpdating}
              onUpdate={async () => { await updateChannelVideos(data.channel.channelId, true); await updateChannelStats(data.channel.channelId); }}
              onDelete={() => setDeleteId(data.channel.channelId)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {videosByChannel.map((data) => {
            const isDeletedChannel = !!data.channelDeleted;
            const sorted = [...data.videos].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

            const getUpdateTimeText = () => {
              if (!data.lastFetched) return null;
              const diffMs = Date.now() - data.lastFetched.getTime();
              const diffMinutes = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMs / 3600000);
              const diffDays = Math.floor(diffMs / 86400000);
              if (diffDays > 0) return `Atualizado há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
              if (diffHours > 0) return `Atualizado há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
              return `Atualizado há ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
            };

            const getDaysSinceAdded = () => {
              if (!data.channel.addedAt) return null;
              const diffDays = Math.floor((Date.now() - new Date(data.channel.addedAt).getTime()) / 86400000);
              if (diffDays === 0) return 'Adicionado hoje';
              if (diffDays === 1) return 'Adicionado há 1 dia';
              return `Adicionado há ${diffDays} dias`;
            };

            if (isDeletedChannel) {
              const downLabel = data.channelExists === false
                ? '⚠️ Canal caído / encerrado'
                : '🔒 Vídeos privados/removidos — canal ainda ativo';
              return (
                <div key={data.channel.channelId} className="flex flex-col gap-3 p-4 bg-muted/20 border border-destructive/30 rounded-lg opacity-90">
                  <div className="flex items-center gap-3">
                    {data.channel.channelThumbnail ? (
                      <img src={data.channel.channelThumbnail} alt={data.channel.channelTitle} className="w-10 h-10 rounded-full grayscale" loading="lazy" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Video className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-bold truncate line-through decoration-muted-foreground">{data.channel.channelTitle}</h2>
                      <p className="text-xs text-destructive">{downLabel}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={async () => { await updateChannelVideos(data.channel.channelId, true); await updateChannelStats(data.channel.channelId); }} className="h-7 px-2" title="Tentar de novo">
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(data.channel.channelId)} className="text-destructive hover:text-destructive h-7 px-2" title="Remover">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {sorted.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 opacity-60 grayscale">
                      {sorted.map((video) => (
                        <RecentVideoCard key={video.videoId} video={video} showExactTime={showExactTime} />
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={data.channel.channelId} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {data.channel.channelThumbnail && (
                    <a href={`https://youtube.com/channel/${data.channel.channelId}`} target="_blank" rel="noopener noreferrer">
                      <img src={data.channel.channelThumbnail} alt={data.channel.channelTitle} className="w-10 h-10 rounded-full" loading="lazy" referrerPolicy="no-referrer" />
                    </a>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={`https://youtube.com/channel/${data.channel.channelId}`} target="_blank" rel="noopener noreferrer">
                        <h2 className="text-xl font-bold hover:text-primary transition-colors">{data.channel.channelTitle}</h2>
                      </a>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost" size="sm"
                          onClick={async () => { await updateChannelVideos(data.channel.channelId, true); await updateChannelStats(data.channel.channelId); }}
                          disabled={isUpdating} className="h-7 px-2" title="Atualizar vídeos e stats"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(data.channel.channelId)} className="h-7 px-2 text-destructive hover:text-destructive" title="Remover">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{new Intl.NumberFormat('pt-BR').format(data.channel.currentSubscribers)} inscritos</span>
                      <span className="flex items-center gap-1"><Video className="w-3 h-3" />{new Intl.NumberFormat('pt-BR').format(data.channel.currentVideos)} vídeos</span>
                      {getUpdateTimeText() && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{getUpdateTimeText()}</span>
                      )}
                      {getDaysSinceAdded() && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-accent/20 rounded text-accent-foreground">
                          <Plus className="w-3 h-3" />{getDaysSinceAdded()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4 Quadros de Estatísticas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="w-3 h-3" /><span>Inscritos</span>
                    </div>
                    <p className="text-lg font-bold">{formatNumber(data.channel.currentSubscribers)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Eye className="w-3 h-3" /><span>Views</span>
                    </div>
                    <p className="text-lg font-bold">{formatNumber(data.channel.currentViews)}</p>
                  </div>
                  <div className={`p-3 rounded-lg border ${(data.channel.subscribersLast7Days || 0) >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="w-3 h-3" /><span>7 Dias</span>
                    </div>
                    <p className={`text-lg font-bold ${(data.channel.subscribersLast7Days || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {(data.channel.subscribersLast7Days || 0) >= 0 ? '+' : ''}{formatNumber(data.channel.subscribersLast7Days || 0)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg border ${(data.channel.viewsLast7Days || 0) >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Eye className="w-3 h-3" /><span>7 Dias</span>
                    </div>
                    <p className={`text-lg font-bold ${(data.channel.viewsLast7Days || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {(data.channel.viewsLast7Days || 0) >= 0 ? '+' : ''}{formatNumber(data.channel.viewsLast7Days || 0)}
                    </p>
                  </div>
                </div>

                {data.isLoading ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Carregando vídeos...</span>
                    </CardContent>
                  </Card>
                ) : data.error ? (
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-sm text-destructive">❌ Erro: {data.error}</p>
                    </CardContent>
                  </Card>
                ) : sorted.length === 0 ? (
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-sm text-muted-foreground">Este canal não possui vídeos recentes.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                    {sorted.map((video) => (
                      <RecentVideoCard key={video.videoId} video={video} showExactTime={showExactTime} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
