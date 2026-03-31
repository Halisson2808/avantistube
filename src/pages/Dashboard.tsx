import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Youtube, Users, Eye, Video, Flame, BarChart3, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { useMonitoredChannels } from "@/hooks/use-monitored-channels";
import { useMyChannels } from "@/hooks/use-my-channels";
import { formatNumber } from "@/lib/youtube-api";
import { useNavigate } from "react-router-dom";

const DeltaBadge = ({ value }: { value: number }) => {
  if (value > 0) return (
    <span className="inline-flex items-center gap-0.5 text-green-500 text-xs font-semibold">
      <ArrowUpRight className="w-3 h-3" />+{formatNumber(value)}
    </span>
  );
  if (value < 0) return (
    <span className="inline-flex items-center gap-0.5 text-red-500 text-xs font-semibold">
      <ArrowDownRight className="w-3 h-3" />{formatNumber(value)}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-muted-foreground text-xs">
      <Minus className="w-3 h-3" />0
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { channels: monitoredChannels, isLoading } = useMonitoredChannels();
  const { channels: myChannels } = useMyChannels();

  const stats = useMemo(() => {
    const active = monitoredChannels.filter(ch => ch.currentViews > 0 || ch.currentSubscribers > 0);
    const totalSubscribers = active.reduce((s, ch) => s + ch.currentSubscribers, 0);
    const totalViews = active.reduce((s, ch) => s + ch.currentViews, 0);
    const totalSubsDelta = active.reduce((s, ch) => s + (ch.subscribersLast7Days ?? 0), 0);
    const totalViewsDelta = active.reduce((s, ch) => s + (ch.viewsLast7Days ?? 0), 0);
    const exploding = active.filter(ch => ch.isExploding).length;
    return { totalSubscribers, totalViews, totalSubsDelta, totalViewsDelta, exploding, activeCount: active.length };
  }, [monitoredChannels]);

  const top5Longform = useMemo(() =>
    [...monitoredChannels]
      .filter(ch => ch.contentType === 'longform' && (ch.viewsLast7Days ?? 0) !== 0)
      .sort((a, b) => (b.viewsLast7Days ?? 0) - (a.viewsLast7Days ?? 0))
      .slice(0, 5),
    [monitoredChannels]
  );

  const top5Shorts = useMemo(() =>
    [...monitoredChannels]
      .filter(ch => ch.contentType === 'shorts' && (ch.viewsLast7Days ?? 0) !== 0)
      .sort((a, b) => (b.viewsLast7Days ?? 0) - (a.viewsLast7Days ?? 0))
      .slice(0, 5),
    [monitoredChannels]
  );

  const topBySubsGrowth = useMemo(() =>
    [...monitoredChannels]
      .filter(ch => (ch.subscribersLast7Days ?? 0) > 0)
      .sort((a, b) => (b.subscribersLast7Days ?? 0) - (a.subscribersLast7Days ?? 0))
      .slice(0, 5),
    [monitoredChannels]
  );

  const nicheBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; viewsDelta: number; subsDelta: number }>();
    monitoredChannels.forEach(ch => {
      const key = ch.niche || 'Sem Nicho';
      const prev = map.get(key) ?? { count: 0, viewsDelta: 0, subsDelta: 0 };
      map.set(key, {
        count: prev.count + 1,
        viewsDelta: prev.viewsDelta + (ch.viewsLast7Days ?? 0),
        subsDelta: prev.subsDelta + (ch.subscribersLast7Days ?? 0),
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1].viewsDelta - a[1].viewsDelta)
      .slice(0, 6);
  }, [monitoredChannels]);

  const hasData = monitoredChannels.length > 0 || myChannels.length > 0;
  const hasGrowthData = top5Longform.length > 0 || top5Shorts.length > 0 || topBySubsGrowth.length > 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="gradient-primary rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">Bem-vindo ao AvantisTube</h1>
        <p className="text-white/80 text-sm md:text-base">
          Monitore, analise e descubra canais do YouTube em crescimento
        </p>
      </div>

      {/* Stats gerais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Canais Monitorados</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "..." : monitoredChannels.length}</div>
            {stats.exploding > 0 && (
              <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                <Flame className="w-3 h-3" />{stats.exploding} explodindo
              </p>
            )}
            {stats.exploding === 0 && (
              <p className="text-xs text-muted-foreground mt-1">{stats.activeCount} com dados</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inscritos (total)</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(stats.totalSubscribers)}</div>
            <div className="mt-1">
              <DeltaBadge value={stats.totalSubsDelta} />
              <span className="text-xs text-muted-foreground ml-1">7d</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Views (total)</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(stats.totalViews)}</div>
            <div className="mt-1">
              <DeltaBadge value={stats.totalViewsDelta} />
              <span className="text-xs text-muted-foreground ml-1">7d</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Meus Canais</CardTitle>
            <Youtube className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myChannels.length}</div>
            <p className="text-xs text-muted-foreground mt-1">canais próprios</p>
          </CardContent>
        </Card>
      </div>

      {/* Aviso quando não há dados de crescimento ainda */}
      {!isLoading && hasData && !hasGrowthData && (
        <Card className="border-dashed border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <BarChart3 className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Ainda não há histórico suficiente para calcular crescimento dos últimos 7 dias.
              Use <strong>Por Nicho → Atualizar</strong> na aba Monitoramento para gerar os dados.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Top 5 Longform por views 7 dias */}
      {top5Longform.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-xs font-semibold">Longos</span>
              Top por Views (7 dias)
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/monitored")}>Ver todos</Button>
          </div>
          <div className="space-y-2">
            {top5Longform.map((ch, i) => (
              <div key={ch.channelId} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                <span className="text-lg font-bold text-muted-foreground w-6 text-center flex-shrink-0">
                  {i + 1}
                </span>
                {ch.channelThumbnail ? (
                  <img src={ch.channelThumbnail} alt={ch.channelTitle} className="w-9 h-9 rounded-full flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-muted flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <a href={`https://youtube.com/channel/${ch.channelId}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm truncate block hover:text-primary transition-colors">
                    {ch.channelTitle}
                  </a>
                  {ch.niche && <span className="text-xs text-muted-foreground">{ch.niche}</span>}
                </div>
                <div className="text-right flex-shrink-0 space-y-0.5">
                  <div className="text-sm font-bold"><DeltaBadge value={ch.viewsLast7Days ?? 0} /></div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Users className="w-3 h-3" /><DeltaBadge value={ch.subscribersLast7Days ?? 0} />
                  </div>
                </div>
                {ch.isExploding && <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 5 Shorts por views 7 dias */}
      {top5Shorts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 text-xs font-semibold">Shorts</span>
              Top por Views (7 dias)
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/monitored")}>Ver todos</Button>
          </div>
          <div className="space-y-2">
            {top5Shorts.map((ch, i) => (
              <div key={ch.channelId} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                <span className="text-lg font-bold text-muted-foreground w-6 text-center flex-shrink-0">
                  {i + 1}
                </span>
                {ch.channelThumbnail ? (
                  <img src={ch.channelThumbnail} alt={ch.channelTitle} className="w-9 h-9 rounded-full flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-muted flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <a href={`https://youtube.com/channel/${ch.channelId}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm truncate block hover:text-primary transition-colors">
                    {ch.channelTitle}
                  </a>
                  {ch.niche && <span className="text-xs text-muted-foreground">{ch.niche}</span>}
                </div>
                <div className="text-right flex-shrink-0 space-y-0.5">
                  <div className="text-sm font-bold"><DeltaBadge value={ch.viewsLast7Days ?? 0} /></div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Users className="w-3 h-3" /><DeltaBadge value={ch.subscribersLast7Days ?? 0} />
                  </div>
                </div>
                {ch.isExploding && <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 5 por crescimento de inscritos */}
      {topBySubsGrowth.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-green-500" />
              Maior Crescimento de Inscritos (7 dias)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {topBySubsGrowth.map((ch) => (
              <Card key={ch.channelId} className="shadow-card overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {ch.channelThumbnail ? (
                      <img src={ch.channelThumbnail} alt={ch.channelTitle} className="w-8 h-8 rounded-full flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                    )}
                    <a href={`https://youtube.com/channel/${ch.channelId}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold truncate hover:text-primary transition-colors">
                      {ch.channelTitle}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />Inscritos 7d</span>
                      <DeltaBadge value={ch.subscribersLast7Days ?? 0} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" />Views 7d</span>
                      <DeltaBadge value={ch.viewsLast7Days ?? 0} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1"><Video className="w-3 h-3" />Total</span>
                      <span className="font-medium">{formatNumber(ch.currentSubscribers)}</span>
                    </div>
                  </div>
                  {ch.isExploding && (
                    <div className="mt-2 flex items-center gap-1 text-orange-500 text-[10px] font-semibold">
                      <Flame className="w-3 h-3" />Explodindo!
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown por nicho */}
      {nicheBreakdown.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Crescimento por Nicho (7 dias)
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {nicheBreakdown.map(([niche, data]) => (
              <Card key={niche} className="shadow-card">
                <CardContent className="p-3 space-y-1">
                  <p className="text-xs font-semibold truncate">{niche}</p>
                  <p className="text-[10px] text-muted-foreground">{data.count} canal{data.count !== 1 ? 'is' : ''}</p>
                  <div className="text-xs">
                    <DeltaBadge value={data.viewsDelta} />
                    <span className="text-muted-foreground ml-1 text-[10px]">views</span>
                  </div>
                  <div className="text-xs">
                    <DeltaBadge value={data.subsDelta} />
                    <span className="text-muted-foreground ml-1 text-[10px]">inscritos</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Meus Canais (resumo) */}
      {myChannels.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Meus Canais</h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/my-channels")}>Ver todos</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myChannels.slice(0, 3).map((channel) => (
              <Card key={channel.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {channel.channelThumbnail && (
                      <img src={channel.channelThumbnail} alt={channel.channelTitle} className="w-10 h-10 rounded-full" loading="lazy" referrerPolicy="no-referrer" />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{channel.channelTitle}</p>
                      {channel.niche && <p className="text-xs text-muted-foreground">{channel.niche}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground mb-0.5">Inscritos</p>
                      <p className="font-bold text-sm">{formatNumber(channel.currentSubscribers)}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground mb-0.5">Visualizações</p>
                      <p className="font-bold text-sm">{formatNumber(channel.currentViews)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {!isLoading && !hasData && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Youtube className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comece a Monitorar Canais</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Adicione canais para começar a monitorar seu crescimento
            </p>
            <Button onClick={() => navigate("/monitored")} className="gradient-primary">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Canais Monitorados
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
