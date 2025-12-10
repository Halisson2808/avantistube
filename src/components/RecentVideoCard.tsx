import { Badge } from "@/components/ui/badge";
import { Eye, Clock } from "lucide-react";
import { formatNumber } from "@/lib/youtube-api";
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
    <div 
      className="group cursor-pointer"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative mb-2">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-lg group-hover:opacity-80 transition-opacity"
        />
        {video.isViral && (
          <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
            🔥 VIRAL
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
        {video.title}
      </h3>
      
      {/* Views and Time */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
  );
};
