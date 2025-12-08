import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Eye, RefreshCw, Trash2, BarChart3, StickyNote, Pencil } from "lucide-react";
import { formatNumber } from "@/lib/youtube-api";
import { ChannelMonitorData } from "@/hooks/use-monitored-channels";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNiches } from "@/hooks/use-niches";

interface ChannelCardProps {
  channel: ChannelMonitorData;
  onUpdate?: (channelId: string) => void;
  onRemove?: (channelId: string) => void;
  onEdit?: (channel: ChannelMonitorData) => void;
  onShowChart?: (channelId: string, channelTitle: string) => void;
  onUpdateNotes?: (channelId: string, notes: string) => void;
  onUpdateNiche?: (channelId: string, niche: string) => void;
  onUpdateContentType?: (channelId: string, contentType: 'longform' | 'shorts') => void;
  metricsFilter?: "7days";
}

export const ChannelCard = ({ channel, onUpdate, onRemove, onEdit, onShowChart, onUpdateNotes, onUpdateNiche, onUpdateContentType, metricsFilter = "7days" }: ChannelCardProps) => {
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editedNotes, setEditedNotes] = useState(channel.notes || "");
  const [editedNiche, setEditedNiche] = useState(channel.niche || "");
  const [editedContentType, setEditedContentType] = useState<'longform' | 'shorts'>(channel.contentType || 'longform');
  const [customNiche, setCustomNiche] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const { niches } = useNiches();
  
  const handleDelete = () => {
    if (onRemove) {
      onRemove(channel.channelId);
      setShowDeleteAlert(false);
    }
  };
  
  const handleSaveNotes = async () => {
    if (!onUpdateNotes) return;
    setIsSavingNotes(true);
    try {
      await onUpdateNotes(channel.channelId, editedNotes);
      setShowNotesDialog(false);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleSaveEdit = async () => {
    setIsSavingEdit(true);
    try {
      const finalNiche = editedNiche === "__new__" ? customNiche : editedNiche;
      
      // Always update if niche is provided
      if (onUpdateNiche && finalNiche && finalNiche.trim() !== "") {
        await onUpdateNiche(channel.channelId, finalNiche);
      }
      
      // Always update content type
      if (onUpdateContentType) {
        await onUpdateContentType(channel.channelId, editedContentType);
      }
      
      setShowEditDialog(false);
    } finally {
      setIsSavingEdit(false);
    }
  };
  
  // Cálculos dos quadros superiores (totais desde que foi adicionado)
  const totalSubsGained = (channel.currentSubscribers || 0) - (channel.initialSubscribers || 0);
  const totalViewsGained = (channel.currentViews || 0) - (channel.initialViews || 0);
  
  const subscribersGrowth = channel.initialSubscribers > 0
    ? ((totalSubsGained / channel.initialSubscribers) * 100).toFixed(1)
    : "0.0";
  
  const viewsGrowth = channel.initialViews > 0
    ? ((totalViewsGained / channel.initialViews) * 100).toFixed(1)
    : "0.0";

  // Cálculos dos quadros inferiores (últimos 7 dias)
  const recentSubs = channel.subscribersLast7Days || 0;
  const recentViews = channel.viewsLast7Days || 0;

  // Calcular dias desde adição
  const daysAdded = Math.max(0, Math.floor(
    (new Date().getTime() - new Date(channel.addedAt).getTime()) / (1000 * 60 * 60 * 24)
  ));

  // Formatar data de atualização
  const lastUpdatedDate = new Date(channel.lastUpdated).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Card className="overflow-hidden hover:shadow-primary transition-smooth">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        {/* Mobile: Layout vertical / Desktop: Layout horizontal */}
        <div className="flex flex-col gap-2">
          {/* Linha 1: Thumbnail + Nome + Badge Explodindo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {channel.channelThumbnail && (
              <a
                href={`https://youtube.com/channel/${channel.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0"
              >
                <img
                  src={channel.channelThumbnail}
                  alt={channel.channelTitle}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:ring-2 hover:ring-primary transition-all cursor-pointer"
                />
              </a>
            )}
            <div className="flex-1 min-w-0">
              <a
                href={`https://youtube.com/channel/${channel.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-smooth block"
              >
                <CardTitle className="text-sm sm:text-base font-semibold truncate max-w-[180px] sm:max-w-none">
                  {channel.channelTitle}
                </CardTitle>
              </a>
              {/* Badges inline no mobile */}
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {channel.niche && (
                  <span className="text-[10px] sm:text-xs text-muted-foreground px-1.5 sm:px-2 py-0.5 border border-border rounded-full">
                    {channel.niche}
                  </span>
                )}
                {channel.contentType && (
                  <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                    channel.contentType === 'shorts' 
                      ? 'bg-purple-500/10 text-purple-600 border border-purple-500/30' 
                      : 'bg-blue-500/10 text-blue-600 border border-blue-500/30'
                  }`}>
                    {channel.contentType === 'shorts' ? 'Shorts' : 'Longos'}
                  </span>
                )}
              </div>
            </div>
            {/* Badge Explodindo */}
            {channel.isExploding && (
              <Badge variant="destructive" className="animate-pulse text-[10px] sm:text-xs flex-shrink-0">
                🔥
              </Badge>
            )}
          </div>
          
          {/* Linha 2: Botões de ação - sempre em linha */}
          <div className="flex gap-1 justify-end">
            {onShowChart && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onShowChart(channel.channelId, channel.channelTitle)}
                className="h-7 w-7 sm:h-8 sm:w-8"
                title="Ver Gráfico"
              >
                <BarChart3 className="w-3 h-3" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowNotesDialog(true)}
              className="h-7 w-7 sm:h-8 sm:w-8"
              title="Notas"
            >
              <StickyNote className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setEditedNiche(channel.niche || "");
                setEditedContentType(channel.contentType || 'longform');
                setCustomNiche("");
                setShowEditDialog(true);
              }}
              className="h-7 w-7 sm:h-8 sm:w-8"
              title="Editar"
            >
              <Pencil className="w-3 h-3" />
            </Button>
            {onUpdate && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdate(channel.channelId)}
                className="h-7 w-7 sm:h-8 sm:w-8"
                title="Atualizar"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            )}
            {onRemove && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteAlert(true)}
                className="h-7 w-7 sm:h-8 sm:w-8"
                title="Remover"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* 4 Quadros de Informação - Compacto no mobile */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Quadro 1: Inscritos Atuais */}
          <div className="space-y-0.5 sm:space-y-1 p-2 sm:p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>Inscritos</span>
            </div>
            <p className="text-base sm:text-xl font-bold">{formatNumber(channel.currentSubscribers)}</p>
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className={totalSubsGained >= 0 ? 'text-green-500' : 'text-red-500'}>
                {totalSubsGained >= 0 ? '+' : ''}{subscribersGrowth}%
              </span>
              <span className="text-muted-foreground">
                {totalSubsGained >= 0 ? '+' : ''}{formatNumber(totalSubsGained)}
              </span>
            </div>
          </div>

          {/* Quadro 2: Views Totais */}
          <div className="space-y-0.5 sm:space-y-1 p-2 sm:p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>Views</span>
            </div>
            <p className="text-base sm:text-xl font-bold">{formatNumber(channel.currentViews)}</p>
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className={totalViewsGained >= 0 ? 'text-green-500' : 'text-red-500'}>
                {totalViewsGained >= 0 ? '+' : ''}{viewsGrowth}%
              </span>
              <span className="text-muted-foreground">
                {totalViewsGained >= 0 ? '+' : ''}{formatNumber(totalViewsGained)}
              </span>
            </div>
          </div>

          {/* Quadro 3: Inscritos 7 Dias */}
          <div className={`space-y-0.5 sm:space-y-1 p-2 sm:p-3 rounded-lg border ${
            recentSubs >= 0 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>7 Dias</span>
            </div>
            <p className={`text-base sm:text-xl font-bold ${
              recentSubs >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {recentSubs >= 0 ? '+' : ''}{formatNumber(recentSubs)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">inscritos</p>
          </div>

          {/* Quadro 4: Views 7 Dias */}
          <div className={`space-y-0.5 sm:space-y-1 p-2 sm:p-3 rounded-lg border ${
            recentViews >= 0 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>7 Dias</span>
            </div>
            <p className={`text-base sm:text-xl font-bold ${
              recentViews >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {recentViews >= 0 ? '+' : ''}{formatNumber(recentViews)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">views</p>
          </div>
        </div>

        {/* Notas */}
        {channel.notes && (
          <div className="pt-2 border-t border-border">
            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{channel.notes}</p>
          </div>
        )}

        {/* Rodapé */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground pt-2 border-t border-border">
          <span>Há {daysAdded}d</span>
          <span>Atualizado: {lastUpdatedDate}</span>
        </div>
      </CardContent>

      {/* Dialog de Notas */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{channel.channelTitle} - Notas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Adicione suas notas sobre este canal..."
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditedNotes(channel.notes || "");
                setShowNotesDialog(false);
              }}
              disabled={isSavingNotes}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="gradient-primary"
            >
              {isSavingNotes ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição de Nicho e Tipo de Conteúdo */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{channel.channelTitle} - Editar Informações</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nicho</Label>
              <Select value={editedNiche} onValueChange={setEditedNiche}>
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
              {editedNiche === "__new__" && (
                <Input
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  placeholder="Digite o nome do novo nicho"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Tipo de Conteúdo</Label>
              <Select value={editedContentType} onValueChange={(value: 'longform' | 'shorts') => setEditedContentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="longform">Vídeos Longos</SelectItem>
                  <SelectItem value="shorts">Shorts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditedNiche(channel.niche || "");
                setEditedContentType(channel.contentType || 'longform');
                setCustomNiche("");
                setShowEditDialog(false);
              }}
              disabled={isSavingEdit}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSavingEdit}
              className="gradient-primary"
            >
              {isSavingEdit ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o canal <strong>{channel.channelTitle}</strong> do monitoramento? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
