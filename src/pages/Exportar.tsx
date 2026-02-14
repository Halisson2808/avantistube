import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Database, HardDrive, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "yt_channel_videos_cache";

interface TableInfo {
  name: string;
  label: string;
  description: string;
  count: number | null;
  loading: boolean;
}

const TABLES_CONFIG = [
  { name: "monitored_channels", label: "Canais Monitorados", description: "Canais que você monitora com nicho, notas e métricas" },
  { name: "channel_history", label: "Histórico de Canais", description: "Histórico completo de métricas ao longo do tempo" },
  { name: "my_channels", label: "Meus Canais", description: "Seus próprios canais do YouTube" },
  { name: "video_snapshots", label: "Snapshots de Vídeos", description: "Dados salvos de vídeos (views, likes, comentários)" },
  { name: "profiles", label: "Perfil", description: "Dados do seu perfil de usuário" },
];

async function fetchAllRows(tableName: string) {
  const rows: any[] = [];
  const pageSize = 1000;
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from(tableName as any)
      .select("*")
      .range(from, from + pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      rows.push(...data);
      from += pageSize;
      if (data.length < pageSize) hasMore = false;
    }
  }
  return rows;
}

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
  const [tables, setTables] = useState<TableInfo[]>(
    TABLES_CONFIG.map((t) => ({ ...t, count: null, loading: true }))
  );
  const [localStorageSize, setLocalStorageSize] = useState<{ count: number; formatted: string }>({ count: 0, formatted: "0 B" });
  const [exportingAll, setExportingAll] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportingSingle, setExportingSingle] = useState<string | null>(null);

  useEffect(() => {
    // Count rows for each table
    TABLES_CONFIG.forEach(async (t) => {
      try {
        const { count, error } = await supabase
          .from(t.name as any)
          .select("*", { count: "exact", head: true });

        setTables((prev) =>
          prev.map((p) => (p.name === t.name ? { ...p, count: error ? 0 : (count ?? 0), loading: false } : p))
        );
      } catch {
        setTables((prev) =>
          prev.map((p) => (p.name === t.name ? { ...p, count: 0, loading: false } : p))
        );
      }
    });

    // localStorage info
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const channelCount = Object.keys(parsed.channels || {}).length;
        const bytes = new Blob([stored]).size;
        const formatted = bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;
        setLocalStorageSize({ count: channelCount, formatted });
      }
    } catch {}
  }, []);

  const exportSingleTable = useCallback(async (tableName: string) => {
    setExportingSingle(tableName);
    try {
      const data = await fetchAllRows(tableName);
      downloadJSON({ exportedAt: new Date().toISOString(), table: tableName, records: data.length, data }, `avantistube_${tableName}.json`);
      toast({ title: "Exportado!", description: `${data.length} registros de ${tableName}` });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setExportingSingle(null);
    }
  }, [toast]);

  const exportLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};
      downloadJSON({ exportedAt: new Date().toISOString(), source: "localStorage", data }, "avantistube_localStorage_cache.json");
      toast({ title: "Cache exportado!" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  }, [toast]);

  const exportAll = useCallback(async () => {
    setExportingAll(true);
    setExportProgress(0);
    const totalSteps = TABLES_CONFIG.length + 1; // +1 for localStorage
    const result: Record<string, any> = {};

    try {
      for (let i = 0; i < TABLES_CONFIG.length; i++) {
        const t = TABLES_CONFIG[i];
        result[t.name] = await fetchAllRows(t.name);
        setExportProgress(((i + 1) / totalSteps) * 100);
      }

      // localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        result.localStorage_cache = stored ? JSON.parse(stored) : {};
      } catch {
        result.localStorage_cache = {};
      }
      setExportProgress(100);

      const fullExport = {
        exportedAt: new Date().toISOString(),
        system: "AvantisTube",
        data: result,
      };

      downloadJSON(fullExport, `avantistube_backup_completo_${new Date().toISOString().slice(0, 10)}.json`);
      toast({ title: "Backup completo exportado!", description: "Todos os dados foram salvos em JSON." });
    } catch (err: any) {
      toast({ title: "Erro na exportação", description: err.message, variant: "destructive" });
    } finally {
      setExportingAll(false);
      setExportProgress(0);
    }
  }, [toast]);

  const totalRecords = tables.reduce((sum, t) => sum + (t.count ?? 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Exportar Dados</h1>
        <p className="text-muted-foreground mt-1">
          Exporte todos os dados do sistema para backup antes de remover o banco de dados.
        </p>
      </div>

      {/* Export All */}
      <Card className="border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="h-5 w-5 text-primary" />
            Exportar Tudo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Gera um único arquivo JSON com todos os dados do banco + cache local.
            {!tables.some((t) => t.loading) && (
              <span className="font-medium text-foreground"> ({totalRecords} registros + {localStorageSize.count} canais em cache)</span>
            )}
          </p>
          {exportingAll && <Progress value={exportProgress} className="h-2" />}
          <Button onClick={exportAll} disabled={exportingAll || tables.some((t) => t.loading)} className="w-full">
            {exportingAll ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Exportando...</>
            ) : (
              <><Download className="h-4 w-4" /> Exportar Backup Completo</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Individual tables */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Database className="h-5 w-5" /> Tabelas do Banco de Dados
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {tables.map((t) => (
            <Card key={t.name}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{t.label}</h3>
                  {t.loading ? (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  ) : (
                    <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{t.count} registros</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{t.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  disabled={exportingSingle === t.name || t.loading || (t.count ?? 0) === 0}
                  onClick={() => exportSingleTable(t.name)}
                >
                  {exportingSingle === t.name ? (
                    <><Loader2 className="h-3 w-3 animate-spin" /> Exportando...</>
                  ) : (
                    <><Download className="h-3 w-3" /> Exportar</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* localStorage */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <HardDrive className="h-5 w-5" /> Cache Local (localStorage)
        </h2>
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Cache de Vídeos Recentes</h3>
              <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                {localStorageSize.count} canais • {localStorageSize.formatted}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Vídeos em cache com thumbnails, métricas e duração</p>
            <Button size="sm" variant="outline" className="w-full" onClick={exportLocalStorage} disabled={localStorageSize.count === 0}>
              <Download className="h-3 w-3" /> Exportar Cache
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
