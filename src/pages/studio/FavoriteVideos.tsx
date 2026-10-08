import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Video } from 'lucide-react';
import { useVideoFavorites } from '@/hooks/use-video-favorites';
import { VideoFavoriteButton } from '@/components/VideoFavoriteButton';
import { formatDuration, formatNumber, ytThumb } from '@/lib/youtube-api';

const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
export default function FavoriteVideos() {
  const { favorites } = useVideoFavorites();
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    return favorites.filter(video => `${video.title} ${video.channelName}`.toLocaleLowerCase('pt-BR').includes(term));
  }, [favorites, search]);
  return (
    <div className="space-y-6 pb-10 text-white">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold"><Star className="h-5 w-5 text-amber-300" />Favoritos</h1>
          <p className="mt-1 text-xs text-white/45">{favorites.length} {favorites.length === 1 ? 'vídeo salvo' : 'vídeos salvos'} · Mais recentes primeiro</p>
        </div>
        <label className="flex w-full items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 sm:w-80">
          <Search aria-hidden="true" className="h-4 w-4 text-white/45" />
          <input aria-label="Buscar favoritos por vídeo ou canal" placeholder="Buscar vídeo ou canal…" value={search} onChange={event => setSearch(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
        </label>
      </header>
      <p className="text-xs text-white/40">Guardados neste navegador, mesmo depois de sair do feed. As visualizações são as que estavam disponíveis ao salvar.</p>
      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-10 text-center">
          <Star className="mx-auto mb-4 h-10 w-10 text-amber-300/60" />
          <h2 className="font-semibold">Seus vídeos favoritos ficam aqui</h2>
          <p className="mt-2 text-sm text-white/45">Clique na estrela de um vídeo no feed ou no monitoramento para guardar.</p>
          <div className="mt-5 flex justify-center gap-4 text-sm">
            <Link className="text-red-300 hover:underline" to="/youtube">Abrir feed</Link>
            <Link className="text-red-300 hover:underline" to="/youtube/monitoramento">Abrir monitoramento</Link>
          </div>
        </div>
      ) : filtered.length === 0 ? <p className="py-10 text-center text-sm text-white/45">Nenhum favorito encontrado para essa busca.</p> : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(video => (
            <article key={video.videoId} className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b]">
              <div className="relative">
                <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="block aspect-video bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">
                  {video.thumbnailUrl ? <img src={ytThumb(video.videoId, video.thumbnailUrl)} decoding="async" alt={video.title} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" /> : <Video className="mx-auto h-full w-10 text-white/30" />}
                </a>
                <VideoFavoriteButton video={video} className="absolute right-2 top-2" />
                {video.duration && <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/85 px-1 text-xs">{formatDuration(video.duration)}</span>}
              </div>
              <div className="space-y-2 p-3">
                <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="block hover:text-red-300"><h2 className="line-clamp-2 min-h-10 text-sm font-semibold" title={video.title}>{video.title}</h2></a>
                <a href={`https://www.youtube.com/channel/${encodeURIComponent(video.channelId)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white/60 hover:text-white hover:underline">
                  {video.channelThumbnail && <img src={video.channelThumbnail} alt="" className="h-5 w-5 rounded-full" loading="lazy" referrerPolicy="no-referrer" />}<span className="truncate">{video.channelName}</span>
                </a>
                <p className="text-xs text-white/40">{formatNumber(video.viewCount || 0)} views ao salvar</p>
                {Number.isFinite(Date.parse(video.savedAt)) && <p className="text-[10px] text-white/35">Salvo em <time dateTime={video.savedAt}>{date.format(new Date(video.savedAt))}</time></p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
