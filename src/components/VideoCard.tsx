import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsUp, Clock, Calendar } from "lucide-react";
import { formatNumber, formatDuration } from "@/lib/youtube-api";
import { format } from "date-fns";

export interface VideoData {
  id: string;
  type?: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId?: string;
  channelCreatedAt?: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  channelSubscribers?: string;
  subscriberCount?: string;
}

interface VideoCardProps {
  video: VideoData;
  onChannelClick?: (channelId: string) => void;
}

export const VideoCard = ({ video, onChannelClick }: VideoCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-primary transition-smooth group">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        {video.duration && (
          <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(video.duration)}
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold line-clamp-2 text-sm group-hover:text-primary transition-smooth">
          {video.title}
        </h3>

        <button
          onClick={() => video.channelId && onChannelClick?.(video.channelId)}
          className="text-xs text-muted-foreground hover:text-primary transition-smooth"
        >
          {video.channelTitle}
        </button>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatNumber(video.viewCount)}
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            {formatNumber(video.likeCount)}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(video.publishedAt), "dd/MM/yy")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
