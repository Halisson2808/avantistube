import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, HardDrive, Database, FileJson } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMonitoredChannels } from "@/hooks/use-monitored-channels";

const STORAGE_KEY = "yt_channel_videos_cache";

function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Exportar() {
  const { toast } = useToast();
  const { channels } = useMonitoredChannels();
  const [exporting, setExporting] = useState<string | null>(null);

  // Tamanho do cache localStorage
  const getCacheInfo = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return { count: 0, size: "0 B" };
      const parsed = JSON.parse(stored);
      const channelCount = Object.keys(parsed.channels || {}).length;
      const bytes = new Blob([stored]).size;
      const size = bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;
      return { count: channelCount, size };
    } catch {
      return { count: 0, size: "0 B" };
    }
  };

  const cacheInfo = getCacheInfo();

  const exportChannels = useCallback(async () => {
    setExporting("channels");
    try {
      const res = await fetch("http://localhost:3001/api/channels");
      const data = await res.json();
      downloadJSON({
        exportedAt: new Date().toISOString(),
        total: data.length,
        channels: data,
      }, `Canais-Monitorados-${new Date().toISOString().slice(0, 10)}.json`);
      toast({ title: "✅ Canais exportados!", description: `${data.length} canais baixados.` });
    } catch {
      toast({ title: "Erro", description: "Servidor local offline. Rode npm run dev.", variant: "destructive" });
    } finally {
      setExporting(null);
    }
  }, [toast]);

  const exportHistory = useCallback(async () => {
    setExporting("history");
    try {
      const res = await fetch("http://localhost:3001/api/history");
      const data = await res.json();
      downloadJSON({
        exportedAt: new Date().toISOString(),
        history: data,
      }, `Historico-Crescimento-${new Date().toISOString().slice(0, 10)}.json`);
      toast({ title: "✅ Histórico exportado!" });
    } catch {
      toast({ title: "Erro", description: "Servidor local offline.", variant: "destructive" });
    } finally {
      setExporting(null);
    }
  }, [toast]);

  const exportVideoCache = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};
      downloadJSON({ exportedAt: new Date().toISOString(), source: "localStorage", data }, "Cache-Videos.json");
      toast({ title: "✅ Cache exportado!" });
    } catch {
      toast({ title: "Erro ao exportar cache", variant: "destructive" });
    }
  }, [toast]);

  const exportAll = useCallback(async () => {
    setExporting("all");
    try {
      // 1. Canais
      const resC = await fetch("http://localhost:3001/api/channels");
      const dataC = await resC.json();
      downloadJSON({ exportedAt: new Date().toISOString(), total: dataC.length, channels: dataC }, "Canais-Monitorados.json");
      await new Promise(r => setTimeout(r, 400));

      // 2. Histórico
      const resH = await fetch("http://localhost:3001/api/history");
      const dataH = await resH.json();
      downloadJSON({ exportedAt: new Date().toISOString(), history: dataH }, "Historico-Crescimento.json");
      await new Promise(r => setTimeout(r, 400));

      // 3. Cache de vídeos
      const stored = localStorage.getItem(STORAGE_KEY);
      const dataLS = stored ? JSON.parse(stored) : {};
      downloadJSON({ exportedAt: new Date().toISOString(), data: dataLS }, "Cache-Videos.json");

      toast({ title: "✅ Backup completo!", description: "3 arquivos exportados." });
    } catch {
      toast({ title: "Erro no backup", description: "Servidor local offline.", variant: "destructive" });
    } finally {
      setExporting(null);
    }
  }, [toast]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Exportar Dados</h1>
        <p className="text-muted-foreground mt-1">
          Faça backup dos seus dados locais em JSON.
        </p>
      </div>

      {/* Exportar Tudo */}
      <Card className="border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="h-5 w-5 text-primary" />
            Backup Completo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Exporta 3 arquivos: canais monitorados, histórico de crescimento e cache de vídeos.
            <span className="font-medium text-foreground"> ({channels.length} canais)</span>
          </p>
          <Button onClick={exportAll} disabled={exporting === "all"} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {exporting === "all" ? "Exportando..." : "Exportar Backup Completo"}
          </Button>
        </CardContent>
      </Card>

      {/* Individual */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Database className="h-5 w-5" /> Exportar Individualmente
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Canais Monitorados</h3>
                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{channels.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Canais, nichos, notas e thumbnails</p>
              <Button size="sm" variant="outline" className="w-full" onClick={exportChannels} disabled={exporting === "channels"}>
                <FileJson className="h-3 w-3 mr-1" />
                {exporting === "channels" ? "..." : "Exportar"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Histórico de Crescimento</h3>
                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">history.json</span>
              </div>
              <p className="text-xs text-muted-foreground">Evolução de inscritos/views por canal</p>
              <Button size="sm" variant="outline" className="w-full" onClick={exportHistory} disabled={exporting === "history"}>
                <FileJson className="h-3 w-3 mr-1" />
                {exporting === "history" ? "..." : "Exportar"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Cache de Vídeos</h3>
                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{cacheInfo.count} canais • {cacheInfo.size}</span>
              </div>
              <p className="text-xs text-muted-foreground">Vídeos em cache com thumbnails e métricas</p>
              <Button size="sm" variant="outline" className="w-full" onClick={exportVideoCache} disabled={cacheInfo.count === 0}>
                <HardDrive className="h-3 w-3 mr-1" />
                Exportar Cache
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
