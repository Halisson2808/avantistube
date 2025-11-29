import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, Youtube, BarChart3, Loader2, Eye, Users } from "lucide-react";
import { useMonitoredChannels } from "@/hooks/use-monitored-channels";
import { useMyChannels } from "@/hooks/use-my-channels";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ChannelCard } from "@/components/ChannelCard";
import { formatNumber } from "@/lib/youtube-api";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format } from "date-fns";

interface ChannelHistory {
  channelId: string;
  recordedAt: string;
  subscribers: number;
  views: number;
  videoCount?: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { channels: monitoredChannels } = useMonitoredChannels();
  const { channels: myChannels } = useMyChannels();
  const [history] = useLocalStorage<ChannelHistory[]>('channel-history', []);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const totalMonitored = monitoredChannels.length;
  const totalMyChannels = myChannels.length;
  const explodingChannels = monitoredChannels.filter(ch => ch.isExploding).length;

  const recentMonitored = monitoredChannels.slice(0, 3);
  const recentMy = myChannels.slice(0, 3);

  const totalSubscribers = myChannels.reduce((acc, ch) => acc + ch.currentSubscribers, 0);
  const totalViews = myChannels.reduce((acc, ch) => acc + ch.currentViews, 0);
  const totalGrowth = myChannels.reduce((acc, ch) => acc + (ch.currentSubscribers - ch.initialSubscribers), 0);

  // Preparar dados para gráficos de crescimento agregado
  const getAggregatedGrowthData = () => {
    // Agrupar histórico por data
    const dailyData: Record<string, { date: string; subscribers: number; views: number; count: number }> = {};

    history.forEach(item => {
      const dateKey = format(new Date(item.recordedAt), 'dd/MM');
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { date: dateKey, subscribers: 0, views: 0, count: 0 };
      }
      dailyData[dateKey].subscribers += item.subscribers;
      dailyData[dateKey].views += item.views;
      dailyData[dateKey].count++;
    });

    // Converter para array e calcular médias
    return Object.values(dailyData)
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/').map(Number);
        const [dayB, monthB] = b.date.split('/').map(Number);
        return (monthA * 100 + dayA) - (monthB * 100 + dayB);
      })
      .map(item => ({
        date: item.date,
        subscribers: Math.round(item.subscribers / item.count),
        views: Math.round(item.views / item.count),
      }));
  };

  // Top canais por crescimento
  const topGrowingChannels = [...monitoredChannels]
    .sort((a, b) => {
      const growthA = a.initialSubscribers > 0 
        ? ((a.currentSubscribers - a.initialSubscribers) / a.initialSubscribers) * 100 
        : 0;
      const growthB = b.initialSubscribers > 0
        ? ((b.currentSubscribers - b.initialSubscribers) / b.initialSubscribers) * 100
        : 0;
      return growthB - growthA;
    })
    .slice(0, 5)
    .map(ch => ({
      name: ch.channelTitle.length > 20 ? ch.channelTitle.substring(0, 20) + '...' : ch.channelTitle,
      crescimento: ch.initialSubscribers > 0 
        ? Math.round(((ch.currentSubscribers - ch.initialSubscribers) / ch.initialSubscribers) * 100)
        : 0,
      inscritos: ch.currentSubscribers,
    }));

  const aggregatedData = getAggregatedGrowthData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-card">
          <p className="font-semibold mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-sm text-primary">
              Inscritos Médios: {formatNumber(payload[0].value)}
            </p>
            <p className="text-sm text-accent">
              Views Médias: {formatNumber(payload[1].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="gradient-primary rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Bem-vindo ao AvantisTube Channels</h1>
        <p className="text-white/80 mb-6">
          Monitore, analise e descubra canais do YouTube em crescimento
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar canais do YouTube..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
          <Button type="submit" variant="secondary">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </form>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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

          {/* Recent Monitored Channels */}
          {recentMonitored.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Canais Monitorados Recentes</h2>
                <Button variant="outline" onClick={() => navigate("/monitored")}>
                  Ver Todos
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentMonitored.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} />
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
                  Use a busca acima para encontrar canais do YouTube e adicione-os ao monitoramento
                </p>
                <Button onClick={() => navigate("/search")} className="gradient-primary">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Canais
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Monitorado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMonitored + totalMyChannels}</div>
                <p className="text-xs text-muted-foreground">Canais totais</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inscritos Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalSubscribers)}</div>
                <p className="text-xs text-green-500">+{formatNumber(totalGrowth)}</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Visualizações Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalViews)}</div>
                <p className="text-xs text-muted-foreground">Todos os canais</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Em Explosão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{explodingChannels}</div>
                <p className="text-xs text-muted-foreground">Crescimento rápido</p>
              </CardContent>
            </Card>
          </div>

          {/* Crescimento Agregado */}
          {aggregatedData.length > 1 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Crescimento Agregado - Todos os Canais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aggregatedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => formatNumber(value)}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="subscribers" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Inscritos Médios"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="views" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2}
                        name="Views Médias"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Canais por Crescimento */}
          {topGrowingChannels.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top 5 Canais - Maior Crescimento %</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topGrowingChannels}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '11px' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value: any, name: string) => {
                          if (name === 'crescimento') return [`${value}%`, 'Crescimento'];
                          return [formatNumber(value), 'Inscritos'];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="crescimento" fill="hsl(var(--primary))" name="Crescimento %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {history.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sem Dados de Analytics</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Adicione canais e atualize suas estatísticas para ver gráficos de crescimento
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
