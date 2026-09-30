import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, Film, RefreshCw, Smartphone, TrendingUp, Users, Video } from "lucide-react";
import { useRecentVideos } from "@/hooks/use-recent-videos";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { calculateTimeAgo, formatDuration } from "@/lib/youtube-api";
import { getFeedChannels, getFeedPeriods, formatPublicationTime, type FeedVideo } from "@/lib/youtube-feed";

import "./FeedYoutube.css";

const views = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
const publishedDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" });
const sections = [
  { title: "Hoje", description: "Publicados hoje", icon: Clock3 },
  { title: "Últimos 7 dias", description: "Sem os vídeos de hoje", icon: TrendingUp },
  { title: "Últimos 30 dias", description: "Restante do período", icon: CalendarDays },
];

export default function FeedYoutube() {
  const { channels, isLoadingChannels: isLoading, serverOnline, channelVideosData,
    isStorageLoaded, videoStorageError, isUpdating: fetching, updateProgress, updateAllChannels,
  } = useRecentVideos('all');
  const [format, setFormat] = useLocalStorage<"shorts" | "longform">("studio-youtube-feed-format", "shorts");
  const [includeOwnChannels, setIncludeOwnChannels] = useLocalStorage<boolean>("studio-youtube-feed-include-own", false);
  const [showPublicationTime, setShowPublicationTime] = useLocalStorage<boolean>("studio-youtube-feed-publication-time", false);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);


  const selected = getFeedChannels(channels, includeOwnChannels, format);
  const videos: FeedVideo[] = selected.flatMap(channel =>
    (channelVideosData.get(channel.channelId)?.videos || []).map(video => ({
      ...video, channelId: channel.channelId, channelName: channel.channelTitle,
      channelThumbnail: channel.channelThumbnail,
    })));
  const periods = getFeedPeriods(videos, now);
  const pending = isLoading || !isStorageLoaded;
  const failed = channels.filter(channel => channelVideosData.get(channel.channelId)?.error).length;


  return (
    <div className="space-y-5 pb-10 text-white">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Feed Youtube</h1>
          <p className="mt-1 text-xs text-white/45">{selected.length} {selected.length === 1 ? "canal no feed" : "canais no feed"} · Vídeos por visualizações</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-pressed={showPublicationTime}
            onClick={() => setShowPublicationTime(value => !value)} title="Mostrar a hora exata da publicação no seu fuso horário, por exemplo 07:00"
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${showPublicationTime ? "border-red-400/40 bg-red-500/15 text-red-200" : "border-white/15 bg-black/20 text-white/50 hover:bg-white/5 hover:text-white"}`}>
            <Clock3 className="h-3.5 w-3.5" />
            Horário da publicação
            <span aria-hidden="true" className={`relative inline-block h-4 w-7 shrink-0 rounded-full transition-colors ${showPublicationTime ? "bg-red-500" : "bg-white/15"}`}>
              <span className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${showPublicationTime ? "translate-x-3" : "translate-x-0"}`} />
            </span>
          </button>
          <button type="button" aria-pressed={includeOwnChannels}
            onClick={() => setIncludeOwnChannels(value => !value)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${includeOwnChannels ? "border-red-400/40 bg-red-500/15 text-red-200" : "border-white/15 bg-black/20 text-white/50 hover:bg-white/5 hover:text-white"}`}>
            <Users className="h-3.5 w-3.5" />
            Incluir meus canais
            <span aria-hidden="true" className={`relative inline-block h-4 w-7 shrink-0 rounded-full transition-colors ${includeOwnChannels ? "bg-red-500" : "bg-white/15"}`}>
              <span className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${includeOwnChannels ? "translate-x-3" : "translate-x-0"}`} />
            </span>
          </button>
          <button type="button" onClick={() => { void updateAllChannels(); }}
            disabled={pending || fetching} aria-label="Atualizar todos os canais" title="Atualizar todos os canais cadastrados e salvar os vídeos dos últimos 30 dias no banco do monitoramento"
            className="rounded-lg border border-white/10 p-2 text-white/50 transition hover:bg-white/5 hover:text-white disabled:opacity-40">
            <RefreshCw className={`h-4 w-4 ${fetching || isLoading ? "animate-spin" : ""}`} />
          </button>
          <div role="group" aria-label="Formato dos canais" title="Usa a classificação Shorts ou Longos cadastrada no canal"
            className="flex gap-1 rounded-xl border border-white/15 bg-black/20 p-1">
            {([{ value: "shorts", label: "Shorts", icon: Smartphone }, { value: "longform", label: "Longos", icon: Film }] as const).map(option => (
              <button type="button" key={option.value} aria-pressed={format === option.value} onClick={() => setFormat(option.value)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${format === option.value ? "bg-white/10 text-white shadow-sm" : "text-white/45 hover:text-white"}`}>
                <option.icon className="h-3.5 w-3.5" />{option.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {fetching && <p role="status" className="text-xs text-white/45">Atualizando {updateProgress.current} de {updateProgress.total} canais cadastrados…</p>}
      <p className="text-xs text-white/40">Dados do banco do monitoramento. Shorts e Longos usam o formato cadastrado no canal. O YouTube só é consultado quando você solicita uma atualização.</p>
      {(!serverOnline || videoStorageError || failed > 0) && (
        <div role="alert" className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200">
          {!serverOnline || videoStorageError ? 'Não foi possível ler todos os dados do banco. ' : ''}
          {failed > 0 ? `Falha na atualização de ${failed} canais. Os últimos vídeos salvos foram preservados.` : ''}
        </div>
      )}
      {!isLoading && selected.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/50">
          Nenhum canal {includeOwnChannels ? "cadastrado nos canais do feed." : "cadastrado no monitoramento."}
          <Link to="/youtube/monitoramento" className="ml-2 text-white underline underline-offset-4">Gerenciar canais</Link>
        </div>
      )}

      <div aria-live="polite" className="space-y-5">
        {sections.map((section, index) => (
          <section key={section.title} aria-label={section.title} aria-busy={pending}
            className="min-w-0 rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <section.icon className="h-3.5 w-3.5 text-white/70" />
                <h2 className="text-xs font-bold">{section.title}</h2>
                <span className="text-[10px] text-white/30">{section.description}</span>
              </div>
              <span className="shrink-0 text-[10px] text-white/35">{pending ? "Carregando…" : `${periods[index].length} ${periods[index].length === 1 ? "vídeo" : "vídeos"}`}</span>
            </div>
            {periods[index].length > 0 ? (
              <div className="youtube-feed-scroll flex gap-4 overflow-x-auto pb-2">
                {periods[index].map((video, rank) => <FeedCard key={video.videoId} video={video} rank={rank + 1} shorts={format === "shorts"} showPublicationTime={showPublicationTime} />)}
              </div>
            ) : pending ? (
              <div className="flex gap-4 overflow-hidden" aria-hidden="true">
                {[0, 1, 2, 3, 4].map(item => <div key={item} className={`shrink-0 animate-pulse rounded-lg bg-white/5 ${format === "shorts" ? "aspect-[9/16] w-[156px]" : "aspect-video w-[260px]"}`} />)}
              </div>
            ) : (
              <p className="py-10 text-center text-xs text-white/35">{failed ? "Vídeos indisponíveis. Tente atualizar o feed." : "Nenhum vídeo publicado neste período."}</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

function FeedCard({ video, rank, shorts, showPublicationTime }: {
  video: FeedVideo;
  rank: number;
  shorts: boolean;
  showPublicationTime: boolean;

}) {
  return (
    <article className={`shrink-0 ${shorts ? "w-[156px] md:w-[174px]" : "w-[260px] md:w-[288px]"}`}>
      <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer"
        className="group block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">
        <div className={`relative overflow-hidden rounded-lg bg-white/5 ${shorts ? "aspect-[9/16]" : "aspect-video"}`}>
          <img src={video.thumbnailUrl} alt={video.title} loading="lazy" referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
          <span className="absolute left-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-md bg-black/85 px-1 text-[10px] font-bold">{rank}</span>
          {video.duration && <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[10px]">{formatDuration(video.duration)}</span>}
        </div>
        <h3 title={video.title} className="mt-2 line-clamp-2 min-h-8 text-[11px] font-semibold leading-4 group-hover:text-red-300">{video.title}</h3>
      </a>
      <p className="mt-1 text-[10px] text-white/40">
        {views.format(video.viewCount)} views · {" "}
        <time dateTime={video.publishedAt} title={`Publicado em ${publishedDate.format(new Date(video.publishedAt))}`}>
          {showPublicationTime ? formatPublicationTime(video.publishedAt) : calculateTimeAgo(video.publishedAt)}
        </time>
      </p>
      <a href={`https://www.youtube.com/channel/${encodeURIComponent(video.channelId)}`} target="_blank" rel="noopener noreferrer"
        title={`Abrir canal ${video.channelName}`}
        className="mt-1.5 flex items-center gap-1.5 rounded text-[10px] text-white/55 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">
        {video.channelThumbnail ? <img src={video.channelThumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-3.5 w-3.5 rounded-full" /> : <Video className="h-3.5 w-3.5" />}
        <span className="truncate">{video.channelName}</span>
      </a>
    </article>
  );
}
