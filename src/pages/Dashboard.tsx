import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Youtube, Users } from "lucide-react";
import { useMonitoredChannels } from "@/hooks/use-monitored-channels";
import { useMyChannels } from "@/hooks/use-my-channels";
import { ChannelCard } from "@/components/ChannelCard";
import { formatNumber } from "@/lib/youtube-api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { channels: monitoredChannels } = useMonitoredChannels();
  const { channels: myChannels } = useMyChannels();

  const totalMonitored = monitoredChannels.length;
  const totalMyChannels = myChannels.length;
  const explodingChannels = monitoredChannels.filter(ch => ch.isExploding).length;

  const top3LongformByViews7Days = [...monitoredChannels]
    .filter(ch => ch.contentType === 'longform')
    .sort((a, b) => (b.viewsLast7Days || 0) - (a.viewsLast7Days || 0))
    .slice(0, 3);
  
  const top3ShortsByViews7Days = [...monitoredChannels]
    .filter(ch => ch.contentType === 'shorts')
    .sort((a, b) => (b.viewsLast7Days || 0) - (a.viewsLast7Days || 0))
    .slice(0, 3);
  const recentMy = myChannels.slice(0, 3);

  const totalSubscribers = myChannels.reduce((acc, ch) => acc + ch.currentSubscribers, 0);
  const totalViews = myChannels.reduce((acc, ch) => acc + ch.currentViews, 0);
  const totalGrowth = myChannels.reduce((acc, ch) => acc + (ch.currentSubscribers - ch.initialSubscribers), 0);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="gradient-primary rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Bem-vindo ao AvantisTube Channels</h1>
        <p className="text-white/80">
          Monitore, analise e descubra canais do YouTube em crescimento
        </p>
      </div>

      {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Canais Monitorados</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalMonitored}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {explodingChannels} em crescimento explosivo
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Meus Canais</CardTitle>
                <Youtube className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalMyChannels}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Gerenciando seus canais
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Inscritos</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatNumber(totalSubscribers)}
                </div>
                <p className="text-xs text-green-500 mt-1">
                  +{formatNumber(totalGrowth)} de crescimento
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top 3 Longform Channels by Views 7 Days */}
          {top3LongformByViews7Days.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Top 3 Vídeos Longos - Views dos Últimos 7 Dias</h2>
                <Button variant="outline" onClick={() => navigate("/monitored")}>
                  Ver Todos
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {top3LongformByViews7Days.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} metricsFilter="7days" />
                ))}
              </div>
            </div>
          )}

          {/* Top 3 Shorts Channels by Views 7 Days */}
          {top3ShortsByViews7Days.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Top 3 Shorts - Views dos Últimos 7 Dias</h2>
                <Button variant="outline" onClick={() => navigate("/monitored")}>
                  Ver Todos
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {top3ShortsByViews7Days.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} metricsFilter="7days" />
                ))}
              </div>
            </div>
          )}

          {/* Recent My Channels */}
          {recentMy.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Meus Canais</h2>
                <Button variant="outline" onClick={() => navigate("/my-channels")}>
                  Ver Todos
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentMy.map((channel) => (
                  <Card key={channel.id} className="shadow-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {channel.channelThumbnail && (
                          <img
                            src={channel.channelThumbnail}
                            alt={channel.channelTitle}
                            className="w-12 h-12 rounded-full"
                          />
                        )}
                        <div>
                          <CardTitle className="text-base">{channel.channelTitle}</CardTitle>
                          <p className="text-xs text-muted-foreground">{channel.niche}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Inscritos</p>
                          <p className="font-bold">{formatNumber(channel.currentSubscribers)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Visualizações</p>
                          <p className="font-bold">{formatNumber(channel.currentViews)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

      {/* Empty State */}
      {totalMonitored === 0 && totalMyChannels === 0 && (
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
