import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, FileText, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CSVRow {
  channelName?: string;
  channelLink: string;
  niche: string;
}

export const ImportChannelsCSV = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractChannelIdFromLink = (link: string): string | null => {
    const trimmed = link.trim();
    
    // ID direto
    if (/^UC[\w-]{22}$/.test(trimmed)) {
      return trimmed;
    }
    
    // URL com /channel/
    const channelMatch = trimmed.match(/youtube\.com\/channel\/(UC[\w-]{22})/);
    if (channelMatch) {
      return channelMatch[1];
    }
    
    // URL com @username
    const handleMatch = trimmed.match(/@([\w-]+)/);
    if (handleMatch) {
      return handleMatch[1]; // Retorna o handle (será resolvido depois)
    }
    
    // URL com /c/ ou /user/
    const customMatch = trimmed.match(/youtube\.com\/(?:c|user)\/([\w-]+)/);
    if (customMatch) {
      return customMatch[1]; // Retorna username (será resolvido depois)
    }
    
    return null;
  };

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Remove header (primeira linha)
    const dataLines = lines.slice(1);
    
    const parsed: CSVRow[] = [];
    
    for (const line of dataLines) {
      // Parse CSV considerando que pode ter vírgulas dentro de aspas
      const columns = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
      const cleaned = columns.map(col => col.replace(/^"|"$/g, '').trim());
      
      // Formato esperado: Nome do Canal, Link do Canal, Nicho, [outros campos ignorados]
      if (cleaned.length >= 3) {
        const channelName = cleaned[0];
        const channelLink = cleaned[1];
        const niche = cleaned[2];
        
        if (channelLink && niche) {
          parsed.push({
            channelName: channelName || undefined,
            channelLink,
            niche,
          });
        }
      }
    }
    
    return parsed;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseCSV(text);
        
        if (parsed.length === 0) {
          toast({
            variant: "destructive",
            title: "CSV vazio",
            description: "Nenhum canal válido encontrado no arquivo.",
          });
          return;
        }
        
        // Inverte a ordem: última linha do CSV será adicionada por último
        const reversed = parsed.reverse();
        setPreview(reversed);
        
        toast({
          title: "CSV carregado",
          description: `${reversed.length} canais encontrados. Ordem invertida aplicada.`,
        });
      } catch (error) {
        console.error('Erro ao ler CSV:', error);
        toast({
          variant: "destructive",
          title: "Erro ao ler arquivo",
          description: "Não foi possível processar o arquivo CSV.",
        });
      }
    };
    
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum canal",
        description: "Carregue um arquivo CSV primeiro.",
      });
      return;
    }
    
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;
    
    // Calcula datas progressivas (mais antiga para mais recente)
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    for (let i = 0; i < preview.length; i++) {
      const row = preview[i];
      
      try {
        const channelId = extractChannelIdFromLink(row.channelLink);
        
        if (!channelId) {
          console.error(`Link inválido: ${row.channelLink}`);
          errorCount++;
          continue;
        }
        
        // Calcula a data: primeiro canal terá a data mais antiga
        // Espaçamento de 1 hora entre cada canal
        const addedAt = new Date(now - (preview.length - i) * 60 * 60 * 1000);
        
        const { data, error } = await supabase.functions.invoke('add-channel', {
          body: {
            channelInput: channelId,
            niche: row.niche,
            notes: `Importado via CSV${row.channelName ? ` - ${row.channelName}` : ''}`,
            contentType: 'longform',
            customAddedAt: addedAt.toISOString(), // Data customizada
          },
        });
        
        if (error || data?.error) {
          console.error(`Erro ao adicionar ${channelId}:`, error || data.error);
          errorCount++;
        } else {
          successCount++;
        }
        
        // Pequeno delay para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Erro ao processar canal:', error);
        errorCount++;
      }
    }
    
    setIsProcessing(false);
    setIsOpen(false);
    setPreview([]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Importação concluída",
      description: `${successCount} canais adicionados, ${errorCount} erros. Recarregando página...`,
    });
    
    // Recarrega a página após 2 segundos
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Canais via CSV</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Instruções */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2 text-sm">
                <p><strong>Formato esperado do CSV:</strong></p>
                <code className="block bg-muted p-2 rounded text-xs">
                  Nome do Canal, Link do Canal, Nicho, [outros campos...]
                </code>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li><strong>Nome do Canal:</strong> Opcional (pode deixar vazio)</li>
                  <li><strong>Link do Canal:</strong> URL completa ou ID do canal</li>
                  <li><strong>Nicho:</strong> Categoria do canal</li>
                  <li>Demais colunas (Inscritos, Views, etc) serão ignoradas</li>
                </ul>
                <p className="text-amber-600 mt-2">
                  ⚠️ <strong>Ordem invertida:</strong> A última linha do CSV será adicionada por último (mais recente)
                </p>
              </div>
            </AlertDescription>
          </Alert>
          
          {/* Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">Selecionar arquivo CSV</Label>
            <Input
              id="csv-file"
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </div>
          
          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-2">
              <Label>Preview ({preview.length} canais)</Label>
              <div className="border rounded-md p-3 max-h-60 overflow-y-auto bg-muted/30">
                <div className="space-y-2">
                  {preview.slice(0, 10).map((row, idx) => (
                    <div key={idx} className="text-xs bg-background p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        <span className="font-medium">
                          {row.channelName || row.channelLink.substring(0, 30)}
                        </span>
                      </div>
                      <div className="text-muted-foreground ml-5 mt-1">
                        Nicho: {row.niche}
                      </div>
                    </div>
                  ))}
                  {preview.length > 10 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      ... e mais {preview.length - 10} canais
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Ordem de adição: do mais antigo (topo) ao mais recente (baixo)
              </p>
            </div>
          )}
          
          {/* Botão de importar */}
          <Button
            onClick={handleImport}
            disabled={isProcessing || preview.length === 0}
            className="w-full gradient-primary"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importando {preview.length} canais...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Importar {preview.length} Canais
              </>
            )}
          </Button>
          
          {isProcessing && (
            <Alert>
              <AlertDescription className="text-xs">
                Este processo pode levar alguns minutos. Não feche esta janela.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
