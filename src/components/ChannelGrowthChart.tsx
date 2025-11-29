import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatNumber } from "@/lib/youtube-api";
import { format } from "date-fns";

interface ChannelHistory {
  channelId: string;
  recordedAt: string;
  subscribers: number;
  views: number;
  videoCount?: number;
}

interface ChannelGrowthChartProps {
  channelId: string;
  channelTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChannelGrowthChart = ({ channelId, channelTitle, isOpen, onClose }: ChannelGrowthChartProps) => {
  const [history] = useLocalStorage<ChannelHistory[]>('channel-history', []);

  // Filtrar histórico do canal específico e ordenar por data
  const channelData = history
    .filter(h => h.channelId === channelId)
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

  // Consolidar dados por dia (pega o último registro de cada dia)
  const consolidatedData = channelData.reduce((acc: Record<string, any>, item) => {
    const dateKey = format(new Date(item.recordedAt), 'dd/MM');

    if (!acc[dateKey]) {
      acc[dateKey] = { 
        date: dateKey, 
        subscribers: item.subscribers, 
        views: item.views, 
        recordedAt: item.recordedAt 
      };
    } else {
      // Se já existe, pega o mais recente do dia
      if (new Date(item.recordedAt) > new Date(acc[dateKey].recordedAt)) {
        acc[dateKey].subscribers = item.subscribers;
        acc[dateKey].views = item.views;
        acc[dateKey].recordedAt = item.recordedAt;
      }
    }
    return acc;
  }, {});

  const dailyData = Object.values(consolidatedData);

  // Calcular ganhos diários
  const chartData = dailyData.map((item: any, index) => {
    if (index === 0) {
      return { 
        date: item.date, 
        inscritos: 0, 
        views: 0,
        inscritosTotal: item.subscribers,
        viewsTotal: item.views
      };
    }
    const prevItem = dailyData[index - 1] as any;
    return {
      date: item.date,
      inscritos: item.subscribers - prevItem.subscribers,
      views: item.views - prevItem.views,
      inscritosTotal: item.subscribers,
      viewsTotal: item.views
    };
  });

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
          {chartData.length === 0 ? (
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

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total de Registros</p>
                  <p className="text-2xl font-bold">{chartData.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Maior Ganho Diário</p>
                  <p className="text-2xl font-bold text-primary">
                    {chartData.length > 1 
                      ? `+${formatNumber(Math.max(...chartData.map(d => d.inscritos)))}` 
                      : '-'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Crescimento Total</p>
                  <p className="text-2xl font-bold text-green-500">
                    {chartData.length > 1
                      ? `+${formatNumber(
                          chartData[chartData.length - 1].inscritosTotal - chartData[0].inscritosTotal
                        )}`
                      : '-'}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
