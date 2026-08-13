import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RefreshCw, Loader2, Filter, X, Clock, TrendingUp, ChevronDown, Plus, Tag, Download, Pencil, Trash2, BarChart3, Users, Eye, Video, CheckSquare, Square, Search, LayoutGrid, AlignJustify } from "lucide-react";
import { useRecentVideos } from "@/hooks/use-recent-videos";
import { RecentVideoCard } from "@/components/RecentVideoCard";
import { toast } from "sonner";
import { useNiches } from "@/hooks/use-niches";
import { formatNumber } from "@/lib/youtube-api";
const LOCAL_API = '/api';
import { ChannelGrowthChart } from "@/components/ChannelGrowthChart";

/* Sub-componente: chip de filtro inline */
type FilterChipProps = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  defaultValue: string;
};

const FilterChip = React.memo(function FilterChip({ label, value, options, onChange, defaultValue }: FilterChipProps) {
  const isActive = value !== defaultValue;
  const activeLabel = options.find(o => o.value === value)?.label;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`h-7 px-2.5 text-xs rounded-lg gap-1 border transition-colors w-auto shrink-0 ${
          isActive
            ? "bg-white/[0.08] border-white/20 text-white font-medium"
            : "bg-transparent border-white/[0.08] text-white/50 hover:text-white/70 hover:bg-white/[0.05]"
        }`}
      >
        {isActive ? activeLabel : label}
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4}>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
})

/* Sub-componente: card compacto para modo grade */
type CompactCardProps = {
  channelData: {
    channel: { channelId: string; channelTitle: string; channelThumbnail: string; niche: string | null; contentType: string; currentSubscribers: number; currentViews: number; currentVideos: number; subscribersLast7Days: number; viewsLast7Days: number; addedAt: string };
    videos: { videoId: string; title: string; thumbnailUrl: string; publishedAt: string; viewCount: number }[];
    lastFetched: Date | null;
    isLoading: boolean;
    error: string | null;
  };
  isUpdating: boolean;
  isDeleted: boolean;
  channelExists?: boolean;
  selectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onChart: () => void;
};

const CompactChannelCard = ({ channelData, isUpdating, isDeleted, channelExists, selectionMode, isSelected, onToggleSelect, onUpdate, onEdit, onDelete, onChart }: CompactCardProps) => {
  const { channel, videos, lastFetched } = channelData;

  if (isDeleted) {
    // Mostra as últimas thumbs conhecidas (guardadas no Supabase antes do
    // canal cair) em vez de esconder tudo — é o "retrato" de como estava.
    const sortedDown = [...videos].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const top3Down = sortedDown.slice(0, 3);
    const downLabel = channelExists === false
      ? '⚠️ Canal encerrado ou excluído'
      : '🔒 Vídeos privados/removidos — canal ativo';
    return (
      <div className={`rounded-xl border overflow-hidden ${isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-destructive/30'} bg-destructive/5`}>
        <div className="p-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            {selectionMode && (
              <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} className="shrink-0" />
            )}
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
            {!selectionMode && (
              <div className="flex gap-0.5 shrink-0">
                <Button variant="ghost" size="sm" onClick={onUpdate} disabled={isUpdating} className="h-5 w-5 p-0 hover:bg-white/[0.08]" title="Tentar de novo"><RefreshCw className="w-2.5 h-2.5" /></Button>
                <Button variant="ghost" size="sm" onClick={onDelete} className="h-5 w-5 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10" title="Remover"><Trash2 className="w-2.5 h-2.5" /></Button>
              </div>
            )}
          </div>
          {top3Down.length > 0 && (
            <div className="grid grid-cols-3 gap-1 opacity-50 grayscale">
              {top3Down.map(v => (
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

  const sorted = [...videos].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const top3 = sorted.slice(0, 3);

  const isExploding = (channel.subscribersLast7Days || 0) > 1000 || (channel.viewsLast7Days || 0) > 50000;

  const postingFreq = (() => {
    if (sorted.length < 2) return null;
    const ms = new Date(sorted[0].publishedAt).getTime() - new Date(sorted[sorted.length - 1].publishedAt).getTime();
    const days = ms / (1000 * 60 * 60 * 24 * (sorted.length - 1));
    return days < 1 ? `${Math.round(days * 24)}h/vid` : `${days.toFixed(1)}d/vid`;
  })();

  const updatedText = (() => {
    if (!lastFetched) return null;
    const h = Math.floor((Date.now() - lastFetched.getTime()) / 3600000);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d} dia${d > 1 ? 's' : ''}`;
    if (h > 0) return `${h}h`;
    return 'agora';
  })();

  const addedText = (() => {
    if (!channel.addedAt) return null;
    const d = Math.floor((Date.now() - new Date(channel.addedAt).getTime()) / 86400000);
    if (d === 0) return 'hoje';
    if (d === 1) return '1 dia';
    return `${d} dias`;
  })();

  const totalVideoViews = videos.reduce((sum, v) => sum + (v.viewCount || 0), 0);

  return (
    <div className={`rounded-xl border bg-white/[0.03] hover:bg-white/[0.05] transition-all overflow-hidden flex flex-col ${isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-white/[0.08]'}`}>
      <div className="p-3 flex flex-col gap-2.5 flex-1">
        {/* Header */}
        <div className="flex items-start gap-2">
          {selectionMode && (
            <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} className="mt-0.5 shrink-0" />
          )}
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
            <div className="flex items-center gap-1.5 mt-0.5">
              {channel.niche && channel.contentType !== 'shorts' && <p className="text-[10px] text-white/40 truncate leading-none">{channel.niche}</p>}
              {channel.contentType === 'shorts' && <span className="text-[8px] px-1 py-0.5 rounded bg-purple-500/10 text-purple-400 leading-none shrink-0">Shorts</span>}
            </div>
          </div>
          <div className="flex items-center shrink-0">
            {isExploding && <span className="text-[9px] mr-1">🔥</span>}
            {!selectionMode && (
              <div className="flex gap-0.5">
                <Button variant="ghost" size="sm" onClick={onUpdate} disabled={isUpdating} className="h-5 w-5 p-0 hover:bg-white/[0.08]"><RefreshCw className="w-2.5 h-2.5" /></Button>
                <Button variant="ghost" size="sm" onClick={onEdit} className="h-5 w-5 p-0 hover:bg-white/[0.08]"><Pencil className="w-2.5 h-2.5" /></Button>
                <Button variant="ghost" size="sm" onClick={onChart} className="h-5 w-5 p-0 hover:bg-white/[0.08]"><BarChart3 className="w-2.5 h-2.5" /></Button>
                <Button variant="ghost" size="sm" onClick={onDelete} className="h-5 w-5 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-2.5 h-2.5" /></Button>
              </div>
            )}
          </div>
        </div>

        {/* 3 thumbnails */}
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

        {/* Stats */}
        <div className="grid grid-cols-4 gap-1">
          {[
            { value: formatNumber(channel.currentSubscribers), label: 'Inscritos', color: '' },
            { value: formatNumber(channel.currentViews),        label: 'Views',     color: '' },
            { value: formatNumber(totalVideoViews),             label: 'Views Vids',color: 'text-sky-400' },
            { value: String(channel.currentVideos),             label: 'Vídeos',    color: 'text-white/70' },
          ].map(({ value, label, color }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-center">
              <p className={`text-[11px] font-bold leading-none ${color}`}>{value}</p>
              <p className="text-[8px] text-white/30 uppercase tracking-wide leading-none">{label}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.06] pt-2 space-y-1 mt-auto">
          <div className="flex items-center justify-between text-[10px] text-white/35">
            <span>{postingFreq ? `${postingFreq} por vídeo` : '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            {addedText && (
              <span className="text-white/30">
                <span className="text-white/20">Add.</span> {addedText}
              </span>
            )}
            {updatedText && (
              <span className="text-white/20">
                · <span>Att.</span> {updatedText}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* Sub-componente: thumbnail do canal com botão de download no hover */
const ChannelThumb = ({ channelId, channelTitle, channelThumbnail }: {
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
}) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: 40, height: 40 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a href={`https://youtube.com/channel/${channelId}`} target="_blank" rel="noopener noreferrer">
        <img
          src={channelThumbnail}
          alt={channelTitle}
          className="w-10 h-10 rounded-full ring-2 ring-transparent hover:ring-primary transition-all cursor-pointer"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </a>
      <button
        title="Baixar thumbnail do canal"
        style={{
          position: 'absolute',
          top: -5,
          right: -5,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'hsl(var(--primary))',
          border: '2px solid hsl(var(--background))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.15s',
          zIndex: 10,
          padding: 0,
        }}
        onClick={async (e) => {
          e.preventDefault();
          try {
            const res = await fetch(channelThumbnail);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${channelTitle.replace(/[^a-z0-9]/gi, '_')}_thumb.jpg`;
            a.click();
            URL.revokeObjectURL(url);
          } catch { window.open(channelThumbnail, '_blank'); }
        }}
      >
        <Download style={{ width: 9, height: 9, color: 'white' }} />
      </button>
    </div>
  );
};

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
    updateSingleChannel,
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

  const { niches, renameNiche, loadNiches } = useNiches();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Dialog de adicionar canal
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [channelUrl, setChannelUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
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
  const [showExactTime, setShowExactTime] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const nicheListRef = useRef<HTMLDivElement | null>(null);
  const nicheItemRefs = useRef<Map<string, HTMLLabelElement | null>>(new Map());

  // Multi-select
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteAlert, setShowBulkDeleteAlert] = useState(false);
  const [showBulkNicheDialog, setShowBulkNicheDialog] = useState(false);
  const [bulkNiche, setBulkNiche] = useState("");
  const [bulkCustomNiche, setBulkCustomNiche] = useState("");
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

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

  const normalizeLetter = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  // Atalho de teclado no popover "Por Nicho":
  // ao pressionar uma letra, rola para o primeiro nicho que começa com ela.
  useEffect(() => {
    if (!isPopoverOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.key.length !== 1) return;
      const target = event.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);
      if (isTyping) return;

      const key = normalizeLetter(event.key);
      if (!/^[a-z]$/.test(key)) return;

      const match = availableNiches.find((niche) =>
        normalizeLetter(niche).startsWith(key)
      );
      if (!match) return;

      event.preventDefault();
      const item = nicheItemRefs.current.get(match);
      item?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      item?.focus();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPopoverOpen, availableNiches]);

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
    // Força atualização (ignora cache) quando usuário clica em Atualizar
    await updateChannelsByNiches(selectedNiches, undefined, true);
  };

  const totalSelectedChannels = selectedNiches.reduce(
    (sum, niche) => sum + getChannelCountByNiche(niche),
    0
  );

  // POST de um único canal. Não busca vídeos/stats aqui — isso fica pra depois,
  // em segundo plano, pra não travar o botão de adicionar esperando a captura
  // dos dados do canal anterior.
  const addOneChannel = async (
    url: string,
    niche: string,
    ct: "longform" | "shorts",
    notes: string,
  ): Promise<{ status: "added" | "duplicate"; channelId?: string }> => {
    const res = await fetch(`${LOCAL_API}/channels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelInput: url, niche, notes, contentType: ct }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.status === 409 || data.error?.includes('already being monitored')) {
      return { status: 'duplicate' };
    }
    if (!res.ok) throw new Error(data.error || `Erro ao adicionar "${url}"`);
    return { status: 'added', channelId: data.channel?.channel_id };
  };

  const handleAddChannel = async () => {
    if (isBulkMode) {
      await handleBulkAddChannels();
      return;
    }
    if (!channelUrl.trim()) {
      toast.error("Digite a URL do canal");
      return;
    }

    setIsAddingChannel(true);
    const finalNiche = contentType === "shorts"
      ? "Shorts"
      : (selectedNiche === "__new__" ? customNiche : selectedNiche);

    try {
      const result = await addOneChannel(channelUrl.trim(), finalNiche, contentType, newNotes);
      if (result.status === 'duplicate') {
        toast.info('Este canal já está sendo monitorado');
      } else {
        toast.success('Canal adicionado! Buscando dados em segundo plano...');
        if (result.channelId) updateSingleChannel(result.channelId).catch(() => {});
      }
      setIsAddDialogOpen(false);
      resetAddForm();
      loadNiches();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar canal';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsAddingChannel(false);
    }
  };

  // Adiciona vários canais de uma vez (1 por linha), todos com o mesmo
  // nicho/formato. Os cadastros saem em paralelo e não esperam a busca de
  // vídeos/stats de cada um — isso roda depois, em segundo plano.
  const handleBulkAddChannels = async () => {
    const lines = Array.from(new Set(bulkUrls.split('\n').map(l => l.trim()).filter(Boolean)));
    if (lines.length === 0) {
      toast.error("Cole ao menos um link de canal (1 por linha)");
      return;
    }

    setIsAddingChannel(true);
    const finalNiche = contentType === "shorts"
      ? "Shorts"
      : (selectedNiche === "__new__" ? customNiche : selectedNiche);

    const settled = await Promise.allSettled(
      lines.map(url => addOneChannel(url, finalNiche, contentType, newNotes))
    );

    let added = 0, duplicated = 0, failed = 0;
    const newChannelIds: string[] = [];
    settled.forEach((r) => {
      if (r.status === 'fulfilled') {
        if (r.value.status === 'duplicate') duplicated++;
        else {
          added++;
          if (r.value.channelId) newChannelIds.push(r.value.channelId);
        }
      } else {
        failed++;
      }
    });

    const parts = [`${added} canal(is) adicionado(s)`];
    if (duplicated) parts.push(`${duplicated} já existia(m)`);
    if (failed) parts.push(`${failed} falharam`);
    toast[failed > 0 && added === 0 ? 'error' : 'success'](parts.join(' • '));

    setIsAddDialogOpen(false);
    resetAddForm();
    setIsAddingChannel(false);
    loadNiches();

    // Busca vídeos/stats de cada canal novo em segundo plano, sem travar a UI.
    newChannelIds.forEach(id => { updateSingleChannel(id).catch(() => {}); });
  };

  const resetAddForm = () => {
    setChannelUrl("");
    setBulkUrls("");
    setIsBulkMode(false);
    setSelectedNiche("");
    setCustomNiche("");
    setNewNotes("");
    setContentType("longform");
  };

  // ── Multi-select handlers ──────────────────────────────────────────────────
  const toggleChannelSelect = (channelId: string) => {
    setSelectedChannelIds(prev => {
      const next = new Set(prev);
      if (next.has(channelId)) next.delete(channelId);
      else next.add(channelId);
      return next;
    });
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedChannelIds(new Set());
  };

  const handleBulkDelete = async () => {
    setIsBulkProcessing(true);
    try {
      for (const channelId of Array.from(selectedChannelIds)) {
        await removeChannel(channelId);
      }
      toast.success(`${selectedChannelIds.size} canal(is) removido(s)`);
      setShowBulkDeleteAlert(false);
      exitSelectionMode();
    } catch {
      toast.error("Erro ao remover canais");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkChangeNiche = async () => {
    const finalNiche = bulkNiche === "__new__" ? bulkCustomNiche : bulkNiche;
    if (!finalNiche?.trim()) { toast.error("Selecione ou digite um nicho"); return; }
    setIsBulkProcessing(true);
    try {
      for (const channelId of Array.from(selectedChannelIds)) {
        await updateNiche(channelId, finalNiche);
      }
      toast.success(`Nicho atualizado para ${selectedChannelIds.size} canal(is)`);
      setShowBulkNicheDialog(false);
      setBulkNiche("");
      setBulkCustomNiche("");
      exitSelectionMode();
      await loadNiches();
    } catch {
      toast.error("Erro ao atualizar nicho");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const videosByChannel = useMemo(() => getVideosByChannel(), [getVideosByChannel]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Monitoramento</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {channels.length} canais monitorados • Últimos 7 vídeos de cada
            {videosByChannel.length > 0 && (
              <span className="ml-2">
                • Mostrando {videosByChannel.length} de {channels.length} canal(is)
              </span>
            )}
          </p>
        </div>

        {/* Topo: Adicionar Canal + Por Nicho */}
        <div className="flex gap-1.5 w-full sm:w-auto">

          {/* Adicionar Canal */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs h-8 px-3 bg-red-500/15 border border-red-500/25 text-red-300 hover:bg-red-500/25 hover:text-red-200 transition-all">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />Adicionar Canal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Canal ao Monitoramento</DialogTitle>
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
                    <div className="space-y-2">
                      <Textarea
                        value={bulkUrls}
                        onChange={(e) => setBulkUrls(e.target.value)}
                        placeholder={"youtube.com/@canal1\nyoutube.com/@canal2\nUCxxxxxxxxxxxxxxxxxxxxxx"}
                        rows={6}
                        className="font-mono text-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        Um canal por linha. O nicho/formato abaixo é aplicado a todos.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        value={channelUrl}
                        onChange={(e) => setChannelUrl(e.target.value)}
                        placeholder="UCxxxx, youtube.com/channel/UCxxxx ou youtube.com/@username"
                      />
                      <p className="text-xs text-muted-foreground">
                        Formatos aceitos: ID do canal, URL completa ou username (@)
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Tipo de Conteúdo *</Label>
                    <Select value={contentType} onValueChange={(value: "longform" | "shorts") => setContentType(value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="longform">Vídeos Longos</SelectItem>
                        <SelectItem value="shorts">Shorts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {contentType !== "shorts" && (
                    <div className="space-y-2">
                      <Label>Nicho (opcional)</Label>
                      <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                        <SelectTrigger><SelectValue placeholder="Selecione ou crie um nicho" /></SelectTrigger>
                        <SelectContent>
                          {niches.map((niche) => (
                            <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                          ))}
                          <SelectItem value="__new__">➕ Novo Nicho</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedNiche === "__new__" && (
                        <Input value={customNiche} onChange={(e) => setCustomNiche(e.target.value)} placeholder="Digite o nome do novo nicho" />
                      )}
                    </div>
                  )}
                  <Button onClick={handleAddChannel} disabled={isAddingChannel} className="w-full gradient-primary">
                    {isAddingChannel
                      ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adicionando...</>)
                      : (isBulkMode ? "Adicionar Canais" : "Adicionar Canal")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

          {/* Por Nicho */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isUpdating || channels.length === 0} className="text-xs h-8 px-3 bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-40">
                  <Filter className="w-3.5 h-3.5 mr-1.5" />Por Nicho<ChevronDown className="w-3 h-3 ml-1 opacity-60" />
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

                  <div ref={nicheListRef} className="max-h-60 overflow-y-auto space-y-2">
                    {availableNiches.map((niche) => (
                      <label
                        key={niche}
                        ref={(el) => {
                          nicheItemRefs.current.set(niche, el);
                        }}
                        tabIndex={-1}
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

      {/* Barra de Filtros inline */}
      <div className="flex items-center gap-2 px-3 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03]">
        <Search className="w-4 h-4 text-white/30 shrink-0" />
        <Input
          placeholder="Buscar por nome, nicho, título de vídeo..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="flex-1 border-0 bg-transparent h-full p-0 text-sm focus-visible:ring-0 focus-visible:outline-none placeholder:text-white/30 min-w-0"
        />
        {filters.search && (
          <button onClick={() => setFilters({ ...filters, search: '' })} className="text-white/30 hover:text-white/60 shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="w-px h-5 bg-white/[0.08] mx-0.5 shrink-0" />

        <FilterChip
          label="Nicho"
          value={filters.category}
          defaultValue="Todos"
          onChange={(v) => setFilters({ ...filters, category: v })}
          options={categories.map(c => ({ label: c === 'Todos' ? 'Todos os nichos' : c, value: c }))}
        />
        <FilterChip
          label="Formato"
          value={filters.contentType || 'Todos'}
          defaultValue="Todos"
          onChange={(v) => setFilters({ ...filters, contentType: v })}
          options={[
            { label: 'Todos os formatos', value: 'Todos' },
            { label: 'LongForm', value: 'longform' },
            { label: 'Shorts', value: 'shorts' },
          ]}
        />
        <FilterChip
          label="Status"
          value={filters.channelStatus || 'active'}
          defaultValue="active"
          onChange={(v) => setFilters({ ...filters, channelStatus: v as 'all' | 'active' | 'deleted' })}
          options={[
            { label: 'Ativos', value: 'active' },
            { label: 'Caídos', value: 'deleted' },
            { label: 'Todos', value: 'all' },
          ]}
        />
        <FilterChip
          label="Período"
          value={filters.datePeriod || 'all'}
          defaultValue="all"
          onChange={(v) => setFilters({ ...filters, datePeriod: v as 'all' | '7days' | '30days' })}
          options={[
            { label: 'Todo o tempo', value: 'all' },
            { label: 'Últimos 7 dias', value: '7days' },
            { label: 'Últimos 30 dias', value: '30days' },
          ]}
        />
        <FilterChip
          label="Ordenar"
          value={filters.sortBy || 'recent'}
          defaultValue="recent"
          onChange={(v) => setFilters({ ...filters, sortBy: v })}
          options={[
            { label: 'Recente', value: 'recent' },
            { label: 'Nome (A-Z)', value: 'name' },
            { label: 'Mais Views', value: 'totalViews' },
          ]}
        />

        {(filters.search || filters.category !== 'Todos' || (filters.contentType && filters.contentType !== 'Todos') || (filters.channelStatus && filters.channelStatus !== 'active') || (filters.datePeriod && filters.datePeriod !== 'all') || (filters.sortBy && filters.sortBy !== 'recent')) && (
          <button
            onClick={clearFilters}
            className="shrink-0 text-[11px] text-white/40 hover:text-white/70 px-2 py-1 rounded hover:bg-white/[0.05] transition-colors"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Barra de ferramentas */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Selecionar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => selectionMode ? exitSelectionMode() : setSelectionMode(true)}
          className={`text-xs h-8 px-3 border transition-all ${selectionMode
            ? "bg-white/10 border-white/20 text-white"
            : "bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          {selectionMode
            ? <><Square className="w-3.5 h-3.5 mr-1.5" />Cancelar</>
            : <><CheckSquare className="w-3.5 h-3.5 mr-1.5" />Selecionar</>
          }
        </Button>

        {/* Gerenciar Nichos */}
        <Dialog open={isManageNichesOpen} onOpenChange={setIsManageNichesOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs h-8 px-3 bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all">
              <Tag className="w-3.5 h-3.5 mr-1.5" />Nichos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Gerenciar Nichos</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {niches.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum nicho cadastrado ainda.</p>
              ) : (
                niches.map((niche) => (
                  <div key={niche} className="flex items-center gap-2">
                    {editingNiche?.old === niche ? (
                      <>
                        <Input value={editingNiche.new} onChange={(e) => setEditingNiche({ old: niche, new: e.target.value })} className="flex-1" placeholder="Novo nome do nicho" />
                        <Button size="sm" onClick={() => handleRenameNiche(editingNiche.old, editingNiche.new)}>Salvar</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingNiche(null)}>Cancelar</Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 px-3 py-2 rounded-md bg-muted text-sm">{niche}</div>
                        <Button size="sm" variant="outline" onClick={() => setEditingNiche({ old: niche, new: niche })}>Renomear</Button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Tempo Relativo / Hora Exata */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExactTime(!showExactTime)}
          className={`text-xs h-8 px-3 border transition-all ${showExactTime
            ? "bg-white/10 border-white/20 text-white"
            : "bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5 mr-1.5" />{showExactTime ? "Hora Exata" : "Tempo Relativo"}
        </Button>

        {/* Toggle de layout */}
        <div className="flex items-center border border-white/[0.08] rounded-lg overflow-hidden ml-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`h-8 px-2.5 flex items-center transition-colors ${viewMode === 'list' ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05]'}`}
            title="Modo lista"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`h-8 px-2.5 flex items-center border-l border-white/[0.08] transition-colors ${viewMode === 'grid' ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05]'}`}
            title="Modo grade compacto"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Barra de controle de seleção múltipla */}
      {selectionMode && (
        <div className="flex items-center justify-between px-1 py-2 bg-muted/40 rounded-lg border border-border">
          <span className="text-sm text-muted-foreground">
            {selectedChannelIds.size} de {videosByChannel.length} selecionado(s)
          </span>
          <div className="flex gap-2">
            <Button
              size="sm" variant="ghost" className="h-7 text-xs"
              onClick={() => setSelectedChannelIds(new Set(videosByChannel.map(cd => cd.channel.channelId)))}
            >
              Selecionar todos
            </Button>
            <Button
              size="sm" variant="ghost" className="h-7 text-xs"
              onClick={() => setSelectedChannelIds(new Set())}
              disabled={selectedChannelIds.size === 0}
            >
              Limpar
            </Button>
          </div>
        </div>
      )}

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
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3' : 'space-y-6'}>
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

            const isDeletedChannel = !!channelData.channelDeleted ||
              channelData.error?.toLowerCase().includes('not found');

            // Lógica de filtro de status:
            // - 'active': mostra apenas canais normais (pula os caídos)
            // - 'deleted': mostra apenas canais caídos (pula os normais)
            // - 'all': mostra tudo
            const statusFilter = filters.channelStatus || 'active';
            if (statusFilter === 'active' && isDeletedChannel) return null;
            if (statusFilter === 'deleted' && !isDeletedChannel) return null;

            // Modo grade compacto
            if (viewMode === 'grid') {
              return (
                <CompactChannelCard
                  key={channelData.channel.channelId}
                  channelData={channelData as any}
                  isUpdating={isUpdating}
                  isDeleted={isDeletedChannel}
                  channelExists={channelData.channelExists}
                  selectionMode={selectionMode}
                  isSelected={selectedChannelIds.has(channelData.channel.channelId)}
                  onToggleSelect={() => toggleChannelSelect(channelData.channel.channelId)}
                  onUpdate={async () => { await updateChannelVideos(channelData.channel.channelId, true); await updateChannelStats(channelData.channel.channelId); }}
                  onEdit={() => setShowEditDialog({ channelId: channelData.channel.channelId, niche: channelData.channel.niche || '', contentType: channelData.channel.contentType as 'longform' | 'shorts' || 'longform' })}
                  onDelete={() => setShowDeleteAlert(channelData.channel.channelId)}
                  onChart={() => setShowChartDialog({ channelId: channelData.channel.channelId, channelTitle: channelData.channel.channelTitle })}
                />
              );
            }

            // Renderização especial para canais caídos — mostra as últimas
            // thumbs conhecidas (guardadas no Supabase antes do canal cair)
            // em vez de esconder tudo.
            if (isDeletedChannel) {
              const sortedDown = [...channelData.videos].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
              const downLabel = channelData.channelExists === false
                ? '⚠️ Canal Indisponível ou Excluído'
                : '🔒 Vídeos privados/removidos — canal ainda ativo';
              return (
                <div
                  key={channelData.channel.channelId}
                  className={`flex flex-col gap-3 p-4 bg-muted/20 border rounded-lg opacity-90 ${selectionMode && selectedChannelIds.has(channelData.channel.channelId) ? 'border-primary ring-2 ring-primary/30' : 'border-destructive/30'}`}
                >
                  <div className="flex items-center gap-2">
                    {selectionMode && (
                      <Checkbox
                        checked={selectedChannelIds.has(channelData.channel.channelId)}
                        onCheckedChange={() => toggleChannelSelect(channelData.channel.channelId)}
                        className="flex-shrink-0"
                      />
                    )}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {channelData.channel.channelThumbnail ? (
                        <img src={channelData.channel.channelThumbnail} alt={channelData.channel.channelTitle} className="w-10 h-10 rounded-full grayscale" loading="lazy" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Video className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-sm font-bold truncate line-through decoration-muted-foreground">{channelData.channel.channelTitle}</h2>
                        <p className="text-xs text-destructive">{downLabel}</p>
                        {channelData.channel.niche && channelData.channel.contentType !== 'shorts' && (
                          <p className="text-xs text-muted-foreground">{channelData.channel.niche}</p>
                        )}
                      </div>
                    </div>
                    {!selectionMode && (
                      <Button
                        variant="ghost" size="sm" onClick={() => setShowDeleteAlert(channelData.channel.channelId)}
                        className="text-destructive hover:text-destructive flex-shrink-0" title="Remover da lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {sortedDown.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 opacity-60 grayscale">
                      {sortedDown.map((video) => (
                        <RecentVideoCard key={video.videoId} video={video} showExactTime={showExactTime} />
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={channelData.channel.channelId}
                className={`space-y-4 ${selectionMode && selectedChannelIds.has(channelData.channel.channelId) ? 'ring-2 ring-primary/40 rounded-xl p-3 bg-primary/5' : ''}`}
              >
                {/* Checkbox de seleção múltipla */}
                {selectionMode && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox
                      checked={selectedChannelIds.has(channelData.channel.channelId)}
                      onCheckedChange={() => toggleChannelSelect(channelData.channel.channelId)}
                    />
                    <span className="text-xs text-muted-foreground">
                      {selectedChannelIds.has(channelData.channel.channelId) ? 'Selecionado' : 'Selecionar este canal'}
                    </span>
                  </label>
                )}
                {/* Header do Canal */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {channelData.channel.channelThumbnail && (
                    <ChannelThumb
                      channelId={channelData.channel.channelId}
                      channelTitle={channelData.channel.channelTitle}
                      channelThumbnail={channelData.channel.channelThumbnail}
                    />
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
                        {/* Download Thumbnail - movido para overlay na thumb */}
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
                      {channelData.channel.niche && channelData.channel.contentType !== 'shorts' && (
                        <span className="px-2 py-0.5 bg-muted rounded">{channelData.channel.niche}</span>
                      )}
                      {channelData.channel.contentType && (
                        <span className={`px-2 py-0.5 rounded ${channelData.channel.contentType === 'shorts'
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
                  <div className={`p-3 rounded-lg border ${(channelData.channel.subscribersLast7Days || 0) >= 0
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                    }`}>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>7 Dias</span>
                    </div>
                    <p className={`text-lg font-bold ${(channelData.channel.subscribersLast7Days || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                      {(channelData.channel.subscribersLast7Days || 0) >= 0 ? '+' : ''}
                      {formatNumber(channelData.channel.subscribersLast7Days || 0)}
                    </p>
                  </div>
                  {/* Views 7 Dias */}
                  <div className={`p-3 rounded-lg border ${(channelData.channel.viewsLast7Days || 0) >= 0
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                    }`}>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>7 Dias</span>
                    </div>
                    <p className={`text-lg font-bold ${(channelData.channel.viewsLast7Days || 0) >= 0 ? 'text-green-500' : 'text-red-500'
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
                  /* Grid de Vídeos - 7 colunas no desktop, menor no mobile */
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                    {channelData.videos.map((video) => (
                      <RecentVideoCard key={video.videoId} video={video} showExactTime={showExactTime} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={!!showEditDialog} onOpenChange={(open) => !open && setShowEditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Canal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {showEditDialog?.contentType !== 'shorts' && (
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
            )}
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
                    if (showEditDialog.contentType === 'shorts') {
                      await updateNiche(showEditDialog.channelId, "Shorts");
                    } else {
                      const finalNiche = showEditDialog.niche === "__new__" ? editedCustomNiche : showEditDialog.niche;
                      if (finalNiche && finalNiche.trim()) {
                        await updateNiche(showEditDialog.channelId, finalNiche);
                      }
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

      {/* ── Barra flutuante de ações em massa ───────────────────────────────── */}
      {selectionMode && selectedChannelIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-border bg-background/95 backdrop-blur">
          <span className="text-sm font-semibold whitespace-nowrap">
            {selectedChannelIds.size} selecionado(s)
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => setShowBulkNicheDialog(true)}
          >
            <Tag className="w-3.5 h-3.5 mr-1.5" />
            Mudar Nicho
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8"
            onClick={() => setShowBulkDeleteAlert(true)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Excluir
          </Button>
          <Button size="sm" variant="ghost" className="h-8" onClick={exitSelectionMode}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* ── Bulk Delete ──────────────────────────────────────────────────────── */}
      <AlertDialog open={showBulkDeleteAlert} onOpenChange={setShowBulkDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {selectedChannelIds.size} canal(is)</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover os {selectedChannelIds.size} canais selecionados do monitoramento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isBulkProcessing}
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBulkProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Removendo...</> : "Remover todos"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Bulk Change Niche ─────────────────────────────────────────────────── */}
      <Dialog open={showBulkNicheDialog} onOpenChange={(o) => { if (!isBulkProcessing) setShowBulkNicheDialog(o); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mudar nicho de {selectedChannelIds.size} canal(is)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Novo Nicho</Label>
              <Select value={bulkNiche} onValueChange={setBulkNiche}>
                <SelectTrigger><SelectValue placeholder="Selecione ou crie um nicho" /></SelectTrigger>
                <SelectContent>
                  {niches.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  <SelectItem value="__new__">➕ Novo Nicho</SelectItem>
                </SelectContent>
              </Select>
              {bulkNiche === "__new__" && (
                <Input
                  value={bulkCustomNiche}
                  onChange={(e) => setBulkCustomNiche(e.target.value)}
                  placeholder="Digite o nome do novo nicho"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkNicheDialog(false)} disabled={isBulkProcessing}>Cancelar</Button>
            <Button onClick={handleBulkChangeNiche} disabled={isBulkProcessing} className="gradient-primary">
              {isBulkProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</> : "Aplicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default RecentVideos;
