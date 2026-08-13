import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Copy, Trash2, Music2, Instagram, Link as LinkIcon, Loader2, Star, ClipboardPaste } from "lucide-react";
import { toast } from "sonner";
import { useSocialLinks, SocialLink } from "@/hooks/use-social-links";

const platformMeta: Record<SocialLink["platform"], { label: string; icon: typeof Music2; className: string }> = {
  tiktok: { label: "TikTok", icon: Music2, className: "bg-white/10 text-white" },
  instagram: { label: "Instagram", icon: Instagram, className: "bg-pink-500/15 text-pink-400" },
  other: { label: "Link", icon: LinkIcon, className: "bg-white/[0.08] text-white/70" },
};

const PerfisSociais = () => {
  const { links, isLoading, addLink, removeLink, toggleFavorite } = useSocialLinks();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isQuickPasting, setIsQuickPasting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!url.trim()) {
      toast.error("Cole o link do perfil");
      return;
    }
    setIsSaving(true);
    const ok = await addLink(url.trim(), label.trim());
    setIsSaving(false);
    if (ok) {
      setUrl("");
      setLabel("");
      setIsAddOpen(false);
    }
  };

  const handleQuickPaste = async () => {
    setIsQuickPasting(true);
    try {
      const clipboardText = (await navigator.clipboard.readText()).trim();
      if (!clipboardText) {
        toast.error("A área de transferência está vazia");
        return;
      }
      if (!/^https?:\/\//i.test(clipboardText)) {
        toast.error("Copie um link válido antes de clicar");
        return;
      }
      await addLink(clipboardText);
    } catch {
      toast.error("Não foi possível ler a área de transferência. Cole manualmente.");
    } finally {
      setIsQuickPasting(false);
    }
  };

  const handleCopy = async (linkUrl: string) => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Perfis Salvos</h1>
          <p className="text-sm text-muted-foreground">Links de perfis, vídeos e etc. para acessar rápido</p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleQuickPaste}
            disabled={isQuickPasting}
            title="Cola o link copiado e salva na hora"
          >
            {isQuickPasting ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <ClipboardPaste className="w-4 h-4 mr-1.5" />}
            Colar e Salvar
          </Button>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary">
                <Plus className="w-4 h-4 mr-1.5" />Adicionar Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Link</Label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@usuario, instagram.com/usuario, link de vídeo..."
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome (opcional)</Label>
                  <Input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Como quer identificar esse link"
                  />
                </div>
                <Button onClick={handleAdd} disabled={isSaving} className="w-full gradient-primary">
                  {isSaving ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adicionando...</>) : "Adicionar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : links.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LinkIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">Nenhum link salvo ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((link) => {
            const meta = platformMeta[link.platform];
            const Icon = meta.icon;
            return (
              <Card
                key={link.id}
                className={`shadow-card hover:bg-white/[0.03] transition-colors ${link.favorite ? "border-amber-400/40 ring-1 ring-amber-400/20" : ""}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${meta.className}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{link.label || meta.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                  </a>
                  <div className="flex items-center shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title={link.favorite ? "Remover dos favoritos" : "Favoritar"}
                      onClick={() => toggleFavorite(link.id, !link.favorite)}
                    >
                      <Star className={`w-3.5 h-3.5 ${link.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Copiar link"
                      onClick={() => handleCopy(link.url)}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive/60 hover:text-destructive"
                      title="Remover"
                      onClick={() => setDeleteId(link.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover perfil?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) removeLink(deleteId);
                setDeleteId(null);
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PerfisSociais;
