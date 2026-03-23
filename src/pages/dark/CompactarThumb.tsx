import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

interface ImageItem {
    id: string;
    fileName: string;
    originalImage: string;
    compressedImage: string | null;
    originalSize: number;
    compressedSize: number;
}

export default function CompactarThumb() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [quality, setQuality] = useState([100]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const compressImage = (imageData: string, qualityValue: number): Promise<{ compressed: string; size: number }> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (!ctx) { resolve({ compressed: imageData, size: 0 }); return; }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve({ compressed: reader.result as string, size: blob.size });
                        reader.readAsDataURL(blob);
                    } else { resolve({ compressed: imageData, size: 0 }); }
                }, "image/jpeg", qualityValue / 100);
            };
            img.src = imageData;
        });
    };

    const processFiles = async (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const imageFiles = fileArray.filter(f => f.type.startsWith("image/"));
        if (imageFiles.length === 0) { toast({ title: "Arquivo inválido", description: "Por favor, selecione imagens.", variant: "destructive" }); return; }
        for (const file of imageFiles) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const originalImage = e.target?.result as string;
                const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const { compressed, size } = await compressImage(originalImage, quality[0]);
                setImages(prev => [...prev, { id, fileName: file.name, originalImage, compressedImage: compressed, originalSize: file.size, compressedSize: size }]);
            };
            reader.readAsDataURL(file);
        }
        toast({ title: "Imagens adicionadas", description: `${imageFiles.length} imagem(s) processada(s).` });
    };

    const handleQualityChange = async (value: number[]) => {
        setQuality(value);
        const updatedImages = await Promise.all(images.map(async (img) => {
            const { compressed, size } = await compressImage(img.originalImage, value[0]);
            return { ...img, compressedImage: compressed, compressedSize: size };
        }));
        setImages(updatedImages);
    };

    const handleDownload = (image: ImageItem) => {
        if (!image.compressedImage) return;
        const link = document.createElement("a");
        link.href = image.compressedImage;
        link.download = image.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Download concluído", description: `${image.fileName} baixada!` });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-gradient">Compactar Thumbnail</h1>
                <p className="text-white/50">Comprima suas thumbnails para que fiquem abaixo de 2MB e sejam aceitas pelo YouTube.</p>
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Upload de Imagens</CardTitle>
                    <CardDescription className="text-white/50">Selecione uma ou mais thumbnails para compactar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-blue-500/50"}`}
                    >
                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files) processFiles(e.target.files); e.target.value = ""; }} className="hidden" />
                        <Upload className="h-12 w-12 mx-auto mb-4 text-white/30" />
                        <p className="text-sm text-white/40 mb-4">Arraste e solte suas imagens aqui ou</p>
                        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Selecionar Imagens
                        </Button>
                    </div>

                    {images.length > 0 && (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex-1 mr-4">
                                    <label className="text-sm font-medium mb-2 block text-white/70">Qualidade: {quality[0]}%</label>
                                    <Slider value={quality} onValueChange={handleQualityChange} min={10} max={100} step={5} />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setImages([])} className="border-white/20 text-white">Limpar</Button>
                                    <Button size="sm" onClick={() => images.forEach(img => handleDownload(img))} className="bg-blue-600 hover:bg-blue-500">
                                        <Download className="h-4 w-4 mr-2" /> Baixar Todas
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {images.map((image) => (
                                    <div key={image.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-white/5">
                                                {image.compressedImage && <img src={image.compressedImage} alt={image.fileName} className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate text-white">{image.fileName}</p>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-white/40">
                                                    <span>Original: {formatBytes(image.originalSize)}</span>
                                                    <span>→</span>
                                                    <span>Compactada: {formatBytes(image.compressedSize)}</span>
                                                    {image.compressedSize <= 2097152
                                                        ? <span className="text-green-400 flex items-center gap-1"><Check className="h-3 w-3" /> OK</span>
                                                        : <span className="text-red-400">Maior que 2MB</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleDownload(image)} className="border-white/20"><Download className="h-4 w-4" /></Button>
                                                <Button size="sm" variant="ghost" onClick={() => setImages(prev => prev.filter(img => img.id !== image.id))} className="text-white/40 hover:text-white"><X className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
