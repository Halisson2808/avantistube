import { useMonitoredChannels } from "@/hooks/use-monitored-channels";
import { ExternalLink, Youtube } from "lucide-react";

export default function CanaisMonitoradosMobile() {
    const { channels } = useMonitoredChannels();

    return (
        <div className="space-y-4 pb-20 pt-4 px-2">
            <div className="flex items-center gap-2 mb-6">
                <Youtube className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold">Canais Salvos ({channels.length})</h1>
            </div>

            <div className="space-y-2">
                {channels.length === 0 ? (
                    <p className="text-center text-muted-foreground mt-10">
                        Nenhum canal monitorado ainda. Adicione na aba "Monitorar".
                    </p>
                ) : (
                    channels.map((channel) => (
                        <a
                            key={channel.channelId}
                            href={`https://youtube.com/channel/${channel.channelId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50 hover:bg-muted/50 transition-colors"
                        >
                            {channel.channelThumbnail ? (
                                <img
                                    src={channel.channelThumbnail}
                                    alt={channel.channelTitle}
                                    className="w-12 h-12 rounded-full flex-shrink-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                    <Youtube className="w-6 h-6 text-muted-foreground" />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">
                                    {channel.channelTitle}
                                </p>
                                <div className="flex items-center gap-2 mt-1 hidden-scroll">
                                    {channel.niche && (
                                        <span className="text-xs bg-muted/80 text-muted-foreground px-2 py-0.5 rounded-full truncate max-w-[120px]">
                                            {channel.niche}
                                        </span>
                                    )}
                                    {channel.contentType && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${channel.contentType === 'shorts'
                                            ? 'bg-purple-500/10 text-purple-400'
                                            : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {channel.contentType === 'shorts' ? 'Shorts' : 'Longo'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}
