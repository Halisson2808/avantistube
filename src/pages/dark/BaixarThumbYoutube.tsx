import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Link as LinkIcon, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BaixarThumbYoutube() {
    const [url, setUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [videoTitle, setVideoTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const extractVideoId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
            /youtube\.com\/embed\/([^&\s]+)/,
            /youtube\.com\/v\/([^&\s]+)/,
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) return match[1];
        }
        return null;
    };

    const fetchVideoTitle = async (videoId: string): Promise<string> => {
        try {
            const response = await fetch(`/api/proxy/oembed?videoId=${videoId}`);
            if (response.ok) {
                const data = await response.json();
                return data.title || "";
            }
        } catch (error) { console.error("Erro ao buscar título:", error); }
        return "";
    };

    const handleLoadThumbnail = async () => {
        const videoId = extractVideoId(url);
        if (!videoId) {
            toast({ title: "Link inválido", description: "Por favor, insira um link válido do YouTube.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        const title = await fetchVideoTitle(videoId);
        setVideoTitle(title);
        setThumbnailUrl(`/api/proxy/thumbnail?videoId=${videoId}`);
        setIsLoading(false);
    };

    const handleCopyTitle = async () => {
        if (!videoTitle) return;
        try {
            await navigator.clipboard.writeText(videoTitle);
            setCopied(true);
            toast({ title: "Título copiado!", description: "O título foi copiado para a área de transferência." });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast({ title: "Erro ao copiar", description: "Não foi possível copiar o título.", variant: "destructive" });
        }
    };

    const handleDownload = async () => {
        if (!thumbnailUrl) return;
        const videoId = extractVideoId(url);
        try {
            const response = await fetch(thumbnailUrl);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `thumbnail-${videoId}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            toast({ title: "Download concluído", description: "Thumbnail baixada com sucesso!" });
        } catch {
            toast({ title: "Erro ao baixar", description: "Verifique se o servidor local está rodando (npm run dev).", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-gradient">Baixar Thumbnail do YouTube</h1>
                <p className="text-white/50">Cole o link do vídeo do YouTube para visualizar e baixar a thumbnail em alta qualidade.</p>
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Link do Vídeo</CardTitle>
                    <CardDescription className="text-white/50">Cole aqui o link completo do vídeo do YouTube</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLoadThumbnail()}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                            />
                        </div>
                        <Button onClick={handleLoadThumbnail} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            {isLoading ? "Carregando..." : "Carregar"}
                        </Button>
                    </div>

                    {thumbnailUrl && (
                        <div className="space-y-4">
                            {videoTitle && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Título do Vídeo</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 p-3 bg-white/5 rounded-lg text-sm text-white select-text cursor-text border border-white/10">
                                            {videoTitle}
                                        </div>
                                        <Button variant="outline" size="icon" onClick={handleCopyTitle} className="border-white/10 bg-white/5">
                                            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 max-w-lg mx-auto">
                                <img
                                    src={thumbnailUrl}
                                    alt="Thumbnail preview"
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="flex justify-center">
                                <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-500">
                                    <Download className="h-4 w-4 mr-2" />
                                    Baixar Thumbnail
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
