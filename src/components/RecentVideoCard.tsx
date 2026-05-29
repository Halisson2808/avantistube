import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, AlertTriangle, Download } from "lucide-react";
import { formatNumber, formatDuration } from "@/lib/youtube-api";
import { RecentVideo } from "@/hooks/use-recent-videos";
import { format } from "date-fns";

interface RecentVideoCardProps {
  video: RecentVideo;
  onVideoClick?: (videoId: string) => void;
  showExactTime?: boolean;
}

export const RecentVideoCard = ({ video, onVideoClick, showExactTime = false }: RecentVideoCardProps) => {
  const [thumbHover, setThumbHover] = useState(false);

  const handleClick = () => {
    if (video.isDeleted) return;
    if (onVideoClick) {
      onVideoClick(video.videoId);
    } else {
      window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank');
    }
  };

  const isDeleted = video.isDeleted || video.title.startsWith('[EXCLUÍDO]');

  const getExactTime = () => {
    if (!video.publishedAt) return '';
    try {
      return format(new Date(video.publishedAt), 'HH:mm');
    } catch {
      return '';
    }
  };

  const handleDownloadThumb = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video.thumbnailUrl) return;

    // Tentar baixar na maior qualidade disponível
    const baseUrl = video.thumbnailUrl.replace(/\/[^/]+\.jpg(\?.*)?$/, '');
    const qualities = ['maxresdefault', 'sddefault', 'hqdefault'];

    for (const quality of qualities) {
      try {
        const url = `${baseUrl}/${quality}.jpg`;
        const res = await fetch(url);
        if (!res.ok) continue; // tenta próxima qualidade

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        const safeName = video.title.replace(/[^a-z0-9]/gi, '_').slice(0, 60);
        a.download = `${safeName}_${quality}.jpg`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        return; // sucesso, para aqui
      } catch {
        continue;
      }
    }

    // Fallback final: abre a URL original em nova aba
    window.open(video.thumbnailUrl, '_blank');
  };

  return (
    <div
      className={`group ${isDeleted ? 'opacity-70' : 'cursor-pointer'}`}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div
        className="relative mb-2"
        onMouseEnter={() => setThumbHover(true)}
        onMouseLeave={() => setThumbHover(false)}
      >
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`w-full aspect-video object-cover rounded-lg transition-opacity ${isDeleted ? 'grayscale' : 'group-hover:opacity-80'
              }`}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground opacity-50">Sem Imagem</span>
          </div>
        )}

        {/* Botão download no canto superior direito — aparece no hover */}
        {video.thumbnailUrl && !isDeleted && (
          <button
            title="Baixar thumbnail"
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'hsl(var(--primary))',
              border: '2px solid rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: thumbHover ? 1 : 0,
              transform: thumbHover ? 'scale(1)' : 'scale(0.7)',
              transition: 'opacity 0.15s, transform 0.15s',
              zIndex: 20,
              padding: 0,
            }}
            onClick={handleDownloadThumb}
          >
            <Download style={{ width: 11, height: 11, color: 'white' }} />
          </button>
        )}

        {/* Duration Badge */}
        {video.duration && !isDeleted && (
          <Badge className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1 py-0.5 font-medium">
            {formatDuration(video.duration)}
          </Badge>
        )}

        {video.isViral && !isDeleted && (
          <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-[10px] px-1 py-0.5">
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
      <h3 className={`font-medium text-sm line-clamp-2 mb-1 ${isDeleted ? 'text-muted-foreground' : 'group-hover:text-primary transition-colors'
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
          <span>{showExactTime ? getExactTime() : video.timeAgo}</span>
        </div>
      </div>
    </div>
  );
};
