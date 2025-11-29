import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Users, Eye, RefreshCw, Trash2, Edit } from "lucide-react";
import { formatNumber } from "@/lib/youtube-api";
import { ChannelMonitorData } from "@/hooks/use-monitored-channels";

interface ChannelCardProps {
  channel: ChannelMonitorData;
  onUpdate?: (channelId: string) => void;
  onRemove?: (channelId: string) => void;
  onEdit?: (channel: ChannelMonitorData) => void;
}

export const ChannelCard = ({ channel, onUpdate, onRemove, onEdit }: ChannelCardProps) => {
  const subscriberGrowth = channel.currentSubscribers - channel.initialSubscribers;
  const viewGrowth = channel.currentViews - channel.initialViews;
  const isGrowing = subscriberGrowth > 0;

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

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>Inscritos</span>
            </div>
            <p className="text-lg font-bold">{formatNumber(channel.currentSubscribers)}</p>
            <div className={`flex items-center gap-1 text-xs ${isGrowing ? 'text-green-500' : 'text-red-500'}`}>
              {isGrowing ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatNumber(Math.abs(subscriberGrowth))}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>Visualizações</span>
            </div>
            <p className="text-lg font-bold">{formatNumber(channel.currentViews)}</p>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <TrendingUp className="w-3 h-3" />
              {formatNumber(viewGrowth)}
            </div>
          </div>
        </div>

        {channel.subscribersLast7Days !== undefined && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Últimos 7 dias</p>
            <div className="flex items-center justify-between text-xs">
              <span>+{formatNumber(channel.subscribersLast7Days)} inscritos</span>
              <span>+{formatNumber(channel.viewsLast7Days || 0)} views</span>
            </div>
          </div>
        )}

        {channel.notes && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground line-clamp-2">{channel.notes}</p>
          </div>
        )}

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
