import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Eye, RefreshCw, Trash2, Edit } from "lucide-react";
import { formatNumber } from "@/lib/youtube-api";
import { ChannelMonitorData } from "@/hooks/use-monitored-channels";

interface ChannelCardProps {
  channel: ChannelMonitorData;
  onUpdate?: (channelId: string) => void;
  onRemove?: (channelId: string) => void;
  onEdit?: (channel: ChannelMonitorData) => void;
  metricsFilter?: "7days" | "lastday";
}

export const ChannelCard = ({ channel, onUpdate, onRemove, onEdit, metricsFilter = "7days" }: ChannelCardProps) => {
  // Cálculos dos quadros superiores (totais desde que foi adicionado)
  const totalSubsGained = (channel.currentSubscribers || 0) - (channel.initialSubscribers || 0);
  const totalViewsGained = (channel.currentViews || 0) - (channel.initialViews || 0);
  
  const subscribersGrowth = channel.initialSubscribers > 0
    ? ((totalSubsGained / channel.initialSubscribers) * 100).toFixed(1)
    : "0.0";
  
  const viewsGrowth = channel.initialViews > 0
    ? ((totalViewsGained / channel.initialViews) * 100).toFixed(1)
    : "0.0";

  // Cálculos dos quadros inferiores (período recente)
  const recentSubs = metricsFilter === "lastday" 
    ? (channel.subscribersLastDay || 0)
    : (channel.subscribersLast7Days || 0);
  
  const recentViews = metricsFilter === "lastday"
    ? (channel.viewsLastDay || 0)
    : (channel.viewsLast7Days || 0);

  // Calcular dias desde adição
  const daysAdded = Math.floor(
    (new Date().getTime() - new Date(channel.addedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Formatar data de atualização
  const lastUpdatedDate = new Date(channel.lastUpdated).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Card className="overflow-hidden hover:shadow-primary transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
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
              {channel.niche && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {channel.niche}
                </Badge>
              )}
            </div>
          </div>
          {channel.isExploding && (
            <Badge variant="destructive" className="animate-pulse">
              🔥 Explodindo
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 4 Quadros de Informação */}
        <div className="grid grid-cols-2 gap-3">
          {/* Quadro 1: Inscritos Atuais (Superior Esquerdo) */}
          <div className="space-y-1 p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>Inscritos Atuais</span>
            </div>
            <p className="text-xl font-bold">{formatNumber(channel.currentSubscribers)}</p>
            <div className="flex items-center justify-between text-xs">
              <span className={totalSubsGained >= 0 ? 'text-green-500' : 'text-red-500'}>
                {totalSubsGained >= 0 ? '+' : ''}{subscribersGrowth}%
              </span>
              <span className="text-muted-foreground">
                {totalSubsGained >= 0 ? '+' : ''}{formatNumber(totalSubsGained)}
              </span>
            </div>
          </div>

          {/* Quadro 2: Views Totais (Superior Direito) */}
          <div className="space-y-1 p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>Views Totais</span>
            </div>
            <p className="text-xl font-bold">{formatNumber(channel.currentViews)}</p>
            <div className="flex items-center justify-between text-xs">
              <span className={totalViewsGained >= 0 ? 'text-green-500' : 'text-red-500'}>
                {totalViewsGained >= 0 ? '+' : ''}{viewsGrowth}%
              </span>
              <span className="text-muted-foreground">
                {totalViewsGained >= 0 ? '+' : ''}{formatNumber(totalViewsGained)}
              </span>
            </div>
          </div>

          {/* Quadro 3: Inscritos Recente (Inferior Esquerdo) */}
          <div className={`space-y-1 p-3 rounded-lg border ${
            recentSubs > 0 
              ? 'bg-green-500/10 border-green-500/30' 
              : recentSubs < 0 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-card border-border'
          }`}>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{metricsFilter === "lastday" ? "Último Dia" : "Últimos 7 Dias"}</span>
            </div>
            <p className={`text-xl font-bold ${
              recentSubs > 0 ? 'text-green-600' : recentSubs < 0 ? 'text-red-600' : ''
            }`}>
              {recentSubs >= 0 ? '+' : ''}{formatNumber(recentSubs)}
            </p>
            <p className="text-xs text-muted-foreground">inscritos</p>
          </div>

          {/* Quadro 4: Views Recente (Inferior Direito) */}
          <div className={`space-y-1 p-3 rounded-lg border ${
            recentViews > 0 
              ? 'bg-blue-500/10 border-blue-500/30' 
              : recentViews < 0 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-card border-border'
          }`}>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>{metricsFilter === "lastday" ? "Último Dia" : "Últimos 7 Dias"}</span>
            </div>
            <p className={`text-xl font-bold ${
              recentViews > 0 ? 'text-blue-600' : recentViews < 0 ? 'text-red-600' : ''
            }`}>
              {recentViews >= 0 ? '+' : ''}{formatNumber(recentViews)}
            </p>
            <p className="text-xs text-muted-foreground">views</p>
          </div>
        </div>

        {/* Notas */}
        {channel.notes && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground line-clamp-2">{channel.notes}</p>
          </div>
        )}

        {/* Rodapé com informações de data */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <span>Adicionado há {daysAdded} {daysAdded === 1 ? 'dia' : 'dias'}</span>
          <span>Atualizado: {lastUpdatedDate}</span>
        </div>

        <div className="flex gap-2 pt-2">
          {onUpdate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate(channel.channelId)}
              className="flex-1"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Atualizar
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(channel)}
            >
              <Edit className="w-3 h-3" />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(channel.channelId)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
