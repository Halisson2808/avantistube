import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useFavoriteStatus } from '@/hooks/use-video-favorites';
import type { FavoriteVideoInput } from '@/lib/video-favorites';

export function VideoFavoriteButton({ video, className = '' }: {
  video: FavoriteVideoInput;
  className?: string;
}) {
  const { saved, toggleFavorite } = useFavoriteStatus(video.videoId);
  const label = `${saved ? 'Remover dos favoritos' : 'Salvar nos favoritos'}: ${video.title}`;
  return (
    <button type="button" aria-label={label} aria-pressed={saved} title={saved ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      className={`z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-black/85 transition hover:border-amber-300/60 hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${saved ? 'text-amber-300' : 'text-white/80'} ${className}`}
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
        try {
          const added = toggleFavorite(video);
          toast.success(added ? 'Vídeo salvo nos favoritos' : 'Vídeo removido dos favoritos');
        } catch {
          toast.error('Não foi possível guardar os favoritos neste navegador. Verifique o espaço disponível e as permissões de armazenamento.');
        }
      }}>
      <Star aria-hidden="true" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
