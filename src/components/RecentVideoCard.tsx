import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock } from "lucide-react";
import { formatNumber, calculateTimeAgo } from "@/lib/youtube-api";
import { RecentVideo } from "@/hooks/use-recent-videos";

interface RecentVideoCardProps {
  video: RecentVideo;
  onVideoClick?: (videoId: string) => void;
}

export const RecentVideoCard = ({ video, onVideoClick }: RecentVideoCardProps) => {
  const handleClick = () => {
    if (onVideoClick) {
      onVideoClick(video.videoId);
    } else {
      window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank');
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-32 h-20 object-cover rounded-md group-hover:opacity-80 transition-opacity"
          />
          {video.isViral && (
            <Badge className="absolute top-1 right-1 bg-orange-500 hover:bg-orange-600">
              🔥 VIRAL
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {video.title}
          </h3>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{formatNumber(video.viewCount)} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{video.timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

