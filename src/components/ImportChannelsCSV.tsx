import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, FileText, AlertCircle, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from 'xlsx';

interface CSVRow {
  channelLink: string;
  niche: string;
  contentType: "longform" | "shorts";
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
      return handleMatch[1];
    }
    
    // URL com /c/ ou /user/
    const customMatch = trimmed.match(/youtube\.com\/(?:c|user)\/([\w-]+)/);
    if (customMatch) {
      return customMatch[1];
    }
    
    return null;
  };

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    
    console.log(`CSV total de linhas: ${lines.length}`);
    
    // Remove header (primeira linha)
    const dataLines = lines.slice(1);
    
    const parsed: CSVRow[] = [];
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      // Parse CSV considerando que pode ter vírgulas dentro de aspas
      const columns = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
      const cleaned = columns.map(col => col.replace(/^"|"$/g, '').trim());
      
      // Formato esperado: Link do Canal, Nicho (exatamente 2 colunas)
      if (cleaned.length >= 2) {
        const channelLink = cleaned[0];
        const niche = cleaned[1];
        
        if (channelLink && niche) {
          parsed.push({
            channelLink,
            niche,
            contentType: "longform", // Default
          });
        } else {
          console.log(`Linha ${i + 2} ignorada (dados vazios):`, cleaned);
        }
      } else {
        console.log(`Linha ${i + 2} ignorada (precisa de 2 colunas: Link, Nicho):`, cleaned);
      }
    }
    
    console.log(`CSV canais parseados: ${parsed.length}`);
    return parsed;
  };

  const parseExcel = (file: File): Promise<CSVRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          
          // Pega a primeira planilha
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Converte para JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
          
          console.log(`Excel total de linhas: ${jsonData.length}`);
          
          // Remove header (primeira linha)
          const dataRows = jsonData.slice(1);
          
          const parsed: CSVRow[] = [];
          
          for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            
            // Formato esperado: Link do Canal, Nicho (exatamente 2 colunas)
            if (row.length >= 2) {
              const channelLink = row[0]?.toString().trim();
              const niche = row[1]?.toString().trim();
              
              if (channelLink && niche) {
                parsed.push({
                  channelLink,
                  niche,
                  contentType: "longform", // Default
                });
              } else {
                console.log(`Linha ${i + 2} ignorada (dados vazios):`, row);
              }
            } else {
              console.log(`Linha ${i + 2} ignorada (precisa de 2 colunas: Link, Nicho):`, row);
            }
          }
          
          console.log(`Excel canais parseados: ${parsed.length}`);
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsBinaryString(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const isCSV = file.name.endsWith('.csv');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    
    if (!isCSV && !isExcel) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV ou Excel (.xlsx, .xls).",
      });
      return;
    }
    
    try {
      let parsed: CSVRow[] = [];
      
      if (isCSV) {
        const text = await file.text();
        parsed = parseCSV(text);
      } else {
        parsed = await parseExcel(file);
      }
      
      if (parsed.length === 0) {
        toast({
          variant: "destructive",
          title: "Arquivo vazio",
          description: "Nenhum canal válido encontrado no arquivo.",
        });
        return;
      }
      
      // Inverte a ordem: última linha será adicionada por último
      const reversed = parsed.reverse();
      setPreview(reversed);
      
      console.log(`Total final a importar: ${reversed.length}`);
      
      toast({
        title: "Arquivo carregado",
        description: `${reversed.length} canais encontrados. Configure o tipo de conteúdo.`,
      });
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao ler arquivo",
        description: "Não foi possível processar o arquivo.",
      });
    }
  };

  const updateContentType = (index: number, contentType: "longform" | "shorts") => {
    setPreview(prev => {
      const updated = [...prev];
      updated[index].contentType = contentType;
      return updated;
    });
  };

  const setAllContentType = (contentType: "longform" | "shorts") => {
    setPreview(prev => prev.map(item => ({ ...item, contentType })));
    toast({
      title: "Tipo aplicado",
      description: `Todos os canais definidos como "${contentType === "longform" ? "Vídeos Longos" : "Shorts"}".`,
    });
  };

  const handleImport = async () => {
    if (preview.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum canal",
        description: "Carregue um arquivo primeiro.",
      });
      return;
    }
    
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0; // Canais que não existem mais
    const failedChannels: { name: string; reason: string }[] = [];
    
    // Calcula datas progressivas (mais antiga para mais recente)
    const now = Date.now();
    
    for (let i = 0; i < preview.length; i++) {
      const row = preview[i];
      const channelDisplayName = row.channelLink.substring(0, 40);
      
      try {
        const channelId = extractChannelIdFromLink(row.channelLink);
        
        if (!channelId) {
          console.error(`Link inválido: ${row.channelLink}`);
          failedChannels.push({ 
            name: channelDisplayName, 
            reason: "Link inválido" 
          });
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
            contentType: row.contentType,
            customAddedAt: addedAt.toISOString(),
          },
        });
        
        if (error) {
          console.error(`Erro ao adicionar ${channelId}:`, error);
          failedChannels.push({ 
            name: channelDisplayName, 
            reason: error.message || "Erro desconhecido" 
          });
          errorCount++;
        } else if (data?.error) {
          // Se o canal não existe mais (foi deletado/derrubado), apenas pula
          if (data.error === "Channel not found") {
            console.log(`Canal removido/não encontrado (pulando): ${channelDisplayName}`);
            skippedCount++;
          } else if (data.error === "Channel already being monitored") {
            // Canal já existe, também pula sem erro
            console.log(`Canal já monitorado (pulando): ${channelDisplayName}`);
            skippedCount++;
          } else {
            // Outros erros são reportados
            console.error(`Erro da API ao adicionar ${channelId}:`, data.error);
            failedChannels.push({ 
              name: channelDisplayName, 
              reason: data.error 
            });
            errorCount++;
          }
        } else {
          successCount++;
        }
        
        // Pequeno delay para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Erro ao processar canal:', error);
        failedChannels.push({ 
          name: channelDisplayName, 
          reason: "Erro ao processar" 
        });
        errorCount++;
      }
    }
    
    setIsProcessing(false);
    setIsOpen(false);
    setPreview([]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Log dos canais que falharam
    if (failedChannels.length > 0) {
      console.log("Canais que falharam:", failedChannels);
    }
    
    // Toast com resultado
    let description = `${successCount} canais adicionados`;
    if (skippedCount > 0) {
      description += `, ${skippedCount} ignorados (não existem mais ou já monitorados)`;
    }
    if (errorCount > 0) {
      description += `, ${errorCount} erros`;
    }
    
    if (successCount > 0 && errorCount === 0) {
      toast({
        title: "✅ Importação concluída",
        description: description + ". Recarregando...",
      });
    } else if (successCount > 0 && errorCount > 0) {
      toast({
        title: "⚠️ Importação parcial",
        description: description + ". Veja o console para detalhes.",
        variant: "default",
      });
    } else if (successCount === 0 && skippedCount > 0) {
      toast({
        title: "ℹ️ Nenhum canal novo",
        description: `${skippedCount} canais ignorados (não existem mais ou já monitorados).`,
      });
      return; // Não recarrega se não houve sucesso
    } else {
      toast({
        variant: "destructive",
        title: "❌ Importação falhou",
        description: `Nenhum canal foi adicionado. ${errorCount} erros. Veja o console.`,
      });
      return; // Não recarrega se falhou
    }
    
    // Recarrega a página após 2 segundos se houve sucesso
    if (successCount > 0) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Importar Planilha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar Canais via Planilha</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Instruções */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2 text-sm">
                <p><strong>Formato esperado:</strong></p>
                <code className="block bg-muted p-2 rounded text-xs">
                  Link do Canal, Nicho
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  Aceita CSV/Excel (.csv, .xlsx, .xls) com exatamente 2 colunas
                </p>
              </div>
            </AlertDescription>
          </Alert>
          
          {/* Upload */}
          <div className="space-y-3">
            <Label htmlFor="csv-file" className="text-base font-semibold">
              Selecionar arquivo
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium mb-1">
                    Clique para selecionar ou arraste o arquivo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV/Excel com 2 colunas: Link, Nicho
                  </p>
                </div>
                <Input
                  id="csv-file"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>
          
          {/* Preview com seleção de tipo de conteúdo */}
          {preview.length > 0 && (
            <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between">
                <Label>Configurar Tipo de Conteúdo ({preview.length} canais)</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAllContentType("longform")}
                  >
                    Todos: Vídeos Longos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAllContentType("shorts")}
                  >
                    Todos: Shorts
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setPreview([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      toast({
                        title: "Lista limpa",
                        description: "Todos os canais foram removidos.",
                      });
                    }}
                  >
                    Limpar Lista
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="h-[400px] border rounded-md p-3">
                <div className="space-y-2">
                  {preview.map((row, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-sm truncate">
                            {row.channelLink.substring(0, 50)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground ml-6">
                          Nicho: {row.niche}
                        </div>
                      </div>
                      
                      <Select 
                        value={row.contentType} 
                        onValueChange={(value: "longform" | "shorts") => updateContentType(idx, value)}
                      >
                        <SelectTrigger className="w-40">
                          <Video className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="longform">Vídeos Longos</SelectItem>
                          <SelectItem value="shorts">Shorts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <p className="text-xs text-muted-foreground">
                Ordem de adição: do mais antigo (topo) ao mais recente (baixo)
              </p>
            </div>
          )}
          
          {/* Botão de importar */}
          {preview.length > 0 && (
            <>
              <Button
                onClick={handleImport}
                disabled={isProcessing}
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
