import { Badge } from "@/components/ui/badge";
import { Eye, Clock, AlertTriangle } from "lucide-react";
import { formatNumber } from "@/lib/youtube-api";
import { RecentVideo } from "@/hooks/use-recent-videos";

interface RecentVideoCardProps {
  video: RecentVideo;
  onVideoClick?: (videoId: string) => void;
}

export const RecentVideoCard = ({ video, onVideoClick }: RecentVideoCardProps) => {
  const handleClick = () => {
    if (video.isDeleted) return; // Não abrir vídeos excluídos
    if (onVideoClick) {
      onVideoClick(video.videoId);
    } else {
      window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank');
    }
  };

  const isDeleted = video.isDeleted || video.title.startsWith('[EXCLUÍDO]');

  return (
    <div 
      className={`group ${isDeleted ? 'opacity-70' : 'cursor-pointer'}`}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative mb-2">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`w-full aspect-video object-cover rounded-lg transition-opacity ${
              isDeleted ? 'grayscale' : 'group-hover:opacity-80'
            }`}
          />
        ) : (
          <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        
        {video.isViral && !isDeleted && (
          <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
            🔥 VIRAL
          </Badge>
        )}
        
        {isDeleted && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            <AlertTriangle className="w-3 h-3 mr-1" />
            EXCLUÍDO
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className={`font-medium text-sm line-clamp-2 mb-1 ${
        isDeleted ? 'text-muted-foreground' : 'group-hover:text-primary transition-colors'
      }`}>
        {video.title.replace('[EXCLUÍDO] ', '')}
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
