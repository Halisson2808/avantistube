import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/youtube-api";
import { format, subDays, eachDayOfInterval, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ChannelHistory {
  channel_id: string;
  recorded_at: string;
  subscriber_count: number;
  view_count: number;
  video_count?: number;
}

interface ChannelGrowthChartProps {
  channelId: string;
  channelTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChannelGrowthChart = ({ channelId, channelTitle, isOpen, onClose }: ChannelGrowthChartProps) => {
  const [history, setHistory] = useState<ChannelHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<'7days' | '30days' | 'all'>('7days');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from('channel_history')
        .select('*')
        .eq('channel_id', channelId)
        .order('recorded_at', { ascending: true });

      if (error) {
        console.error('Error fetching channel history:', error);
      } else {
        setHistory(data || []);
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, [channelId, isOpen]);

  // Filtrar por período
  let filteredHistory = history;
  const now = new Date();
  
  if (periodFilter === '7days') {
    const sevenDaysAgo = subDays(now, 7);
    filteredHistory = history.filter(item => new Date(item.recorded_at) >= sevenDaysAgo);
  } else if (periodFilter === '30days') {
    const thirtyDaysAgo = subDays(now, 30);
    filteredHistory = history.filter(item => new Date(item.recorded_at) >= thirtyDaysAgo);
  }

  // Consolidar dados por dia (pega o último registro de cada dia)
  const consolidatedData = filteredHistory.reduce((acc: Record<string, any>, item) => {
    const date = new Date(item.recorded_at);
    const dateKey = format(date, 'yyyy-MM-dd');

    if (!acc[dateKey]) {
      acc[dateKey] = { 
        date: dateKey,
        displayDate: format(date, 'dd/MM'),
        subscribers: item.subscriber_count, 
        views: item.view_count, 
        recordedAt: item.recorded_at 
      };
    } else {
      // Se já existe, pega o mais recente do dia
      if (new Date(item.recorded_at) > new Date(acc[dateKey].recordedAt)) {
        acc[dateKey].subscribers = item.subscriber_count;
        acc[dateKey].views = item.view_count;
        acc[dateKey].recordedAt = item.recorded_at;
      }
    }
    return acc;
  }, {});

  // Preencher dias faltantes com valores anteriores
  let dailyData = Object.values(consolidatedData);
  
  if (dailyData.length > 0) {
    const sortedDates = dailyData.sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const firstDate = parseISO(sortedDates[0].date);
    const lastDate = parseISO(sortedDates[sortedDates.length - 1].date);
    
    const allDates = eachDayOfInterval({ start: firstDate, end: lastDate });
    
    const filledData: any[] = [];
    let lastKnownData = sortedDates[0];
    
    allDates.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const existingData = consolidatedData[dateKey];
      
      if (existingData) {
        filledData.push(existingData);
        lastKnownData = existingData;
      } else {
        // Preenche com o último valor conhecido
        filledData.push({
          date: dateKey,
          displayDate: format(date, 'dd/MM'),
          subscribers: lastKnownData.subscribers,
          views: lastKnownData.views,
          recordedAt: lastKnownData.recordedAt
        });
      }
    });
    
    dailyData = filledData;
  }

  // Calcular ganhos diários
  const chartData = dailyData.map((item: any, index) => {
    if (index === 0) {
      return { 
        date: item.displayDate, 
        inscritos: 0, 
        views: 0,
        inscritosTotal: item.subscribers,
        viewsTotal: item.views
      };
    }
    const prevItem = dailyData[index - 1] as any;
    return {
      date: item.displayDate,
      inscritos: item.subscribers - prevItem.subscribers,
      views: item.views - prevItem.views,
      inscritosTotal: item.subscribers,
      viewsTotal: item.views
    };
  });

  // Calcular estatísticas do período
  const totalGrowthSubs = chartData.length > 1 
    ? chartData[chartData.length - 1].inscritosTotal - chartData[0].inscritosTotal 
    : 0;
  const totalGrowthViews = chartData.length > 1 
    ? chartData[chartData.length - 1].viewsTotal - chartData[0].viewsTotal 
    : 0;
  const maxDailyGainSubs = chartData.length > 1 
    ? Math.max(...chartData.slice(1).map(d => d.inscritos)) 
    : 0;
  const maxDailyGainViews = chartData.length > 1 
    ? Math.max(...chartData.slice(1).map(d => d.views)) 
    : 0;
  const avgDailyGainSubs = chartData.length > 1
    ? totalGrowthSubs / (chartData.length - 1)
    : 0;
  const avgDailyGainViews = chartData.length > 1
    ? totalGrowthViews / (chartData.length - 1)
    : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-card">
          <p className="font-semibold mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-sm text-primary">
              Inscritos: {formatNumber(payload[0].payload.inscritosTotal)}
              <span className="text-xs ml-2">
                ({payload[0].value >= 0 ? '+' : ''}{formatNumber(payload[0].value)} hoje)
              </span>
            </p>
            <p className="text-sm text-accent">
              Views: {formatNumber(payload[0].payload.viewsTotal)}
              <span className="text-xs ml-2">
                ({payload[1].value >= 0 ? '+' : ''}{formatNumber(payload[1].value)} hoje)
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Crescimento: {channelTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={periodFilter === '7days' ? 'default' : 'outline'}
              onClick={() => setPeriodFilter('7days')}
              size="sm"
            >
              Últimos 7 dias
            </Button>
            <Button 
              variant={periodFilter === '30days' ? 'default' : 'outline'}
              onClick={() => setPeriodFilter('30days')}
              size="sm"
            >
              Últimos 30 dias
            </Button>
            <Button 
              variant={periodFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setPeriodFilter('all')}
              size="sm"
            >
              Todo o período
            </Button>
          </div>
          {isLoading ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum dado histórico ainda. Atualize as estatísticas do canal para começar a rastrear o crescimento.
              </p>
            </div>
          ) : (
            <>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
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
                    <Legend 
                      wrapperStyle={{ fontSize: '14px' }}
                      formatter={(value) => value === 'inscritos' ? 'Ganho de Inscritos' : 'Ganho de Views'}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="inscritos" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {chartData.length === 1 && (
                <div className="text-center text-sm text-muted-foreground">
                  Apenas 1 registro disponível. Atualize novamente para ver o crescimento ao longo do tempo.
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Crescimento Total</p>
                  <p className="text-xl font-bold text-primary">
                    {chartData.length > 1 ? `+${formatNumber(totalGrowthSubs)}` : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">inscritos</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Média Diária</p>
                  <p className="text-xl font-bold text-primary">
                    {chartData.length > 1 ? `+${formatNumber(Math.round(avgDailyGainSubs))}` : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">inscritos/dia</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Maior Ganho Diário</p>
                  <p className="text-xl font-bold text-primary">
                    {chartData.length > 1 ? `+${formatNumber(maxDailyGainSubs)}` : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">inscritos</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total de Dias</p>
                  <p className="text-xl font-bold">{chartData.length > 0 ? chartData.length : '-'}</p>
                  <p className="text-xs text-muted-foreground">registrados</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Crescimento Views</p>
                  <p className="text-xl font-bold text-accent">
                    {chartData.length > 1 ? `+${formatNumber(totalGrowthViews)}` : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">views totais</p>
                </div>
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Média Views/Dia</p>
                  <p className="text-xl font-bold text-accent">
                    {chartData.length > 1 ? `+${formatNumber(Math.round(avgDailyGainViews))}` : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">views/dia</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
