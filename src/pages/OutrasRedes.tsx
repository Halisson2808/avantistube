import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, RefreshCw, Pencil, Trash2, Loader2, Music2, Instagram, Facebook, AlertTriangle, Users } from "lucide-react";
import { formatNumber } from "@/lib/youtube-api";
import { useSocialProfiles, SocialNetwork, SocialProfile } from "@/hooks/use-social-profiles";

const NETWORKS: Record<SocialNetwork, { label: string; icon: typeof Music2; badge: string }> = {
  tiktok: { label: "TikTok", icon: Music2, badge: "bg-white/10 text-white" },
  instagram: { label: "Instagram", icon: Instagram, badge: "bg-pink-500/15 text-pink-400" },
  facebook: { label: "Facebook", icon: Facebook, badge: "bg-blue-500/15 text-blue-400" },
};

type Filter = "all" | SocialNetwork;

function timeAgo(iso: string | null) {
  if (!iso) return null;
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (h < 1) return "agora";
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d} dia${d > 1 ? "s" : ""}`;
}

const Avatar = ({ p }: { p: SocialProfile }) => {
  const [broken, setBroken] = useState(false);
  const Icon = NETWORKS[p.platform].icon;
  return (
    <div className="relative shrink-0">
      {p.avatar_url && !broken ? (
        <img
          src={p.avatar_url}
          alt={p.display_name || p.username}
          className="w-14 h-14 rounded-full object-cover bg-white/[0.05]"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-white/[0.06] flex items-center justify-center text-lg font-semibold text-white/40">
          {(p.display_name || p.username).slice(0, 1).toUpperCase()}
        </div>
      )}
      <span className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0f0f11] ${NETWORKS[p.platform].badge}`}>
        <Icon className="w-2.5 h-2.5" />
      </span>
    </div>
  );
};

const OutrasRedes = () => {
  const { profiles, isLoading, refreshingIds, addProfile, refreshProfile, refreshAll, updateProfile, removeProfile } = useSocialProfiles();
  const [filter, setFilter] = useState<Filter>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newNiche, setNewNiche] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [editing, setEditing] = useState<{ id: string; display_name: string; avatar_url: string; niche: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { all: profiles.length, tiktok: 0, instagram: 0, facebook: 0 };
    profiles.forEach(p => c[p.platform]++);
    return c;
  }, [profiles]);

  const visible = filter === "all" ? profiles : profiles.filter(p => p.platform === filter);

  const handleAdd = async () => {
    if (!newUrl.trim()) return;
    setIsAdding(true);
    const ok = await addProfile(newUrl.trim(), newNiche.trim() || undefined);
    setIsAdding(false);
    if (ok) { setNewUrl(""); setNewNiche(""); setAddOpen(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">Outras Redes</h1>
          <p className="text-sm text-muted-foreground">Perfis do TikTok, Instagram e Facebook</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm" variant="outline"
            disabled={isRefreshingAll || profiles.length === 0}
            onClick={async () => { setIsRefreshingAll(true); await refreshAll(); setIsRefreshingAll(false); }}
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isRefreshingAll ? "animate-spin" : ""}`} />Atualizar todos
          </Button>
          <Button size="sm" className="gradient-primary" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />Adicionar Perfil
          </Button>
        </div>
      </div>

      {/* Filtro por rede */}
      <div className="flex gap-1.5 flex-wrap">
        {(["all", "tiktok", "instagram", "facebook"] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-8 px-3 rounded-lg text-xs border transition-colors ${filter === f ? "bg-white/[0.1] border-white/[0.15] text-white" : "border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.04]"}`}
          >
            {f === "all" ? "Todos" : NETWORKS[f].label} <span className="text-white/30 ml-1">{counts[f]}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] py-14 text-center">
          <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum perfil salvo ainda.</p>
          <p className="text-xs text-white/30 mt-1">Cole o link de um perfil do TikTok, Instagram ou Facebook.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {visible.map(p => {
            const busy = refreshingIds.has(p.id);
            const stats = [
              { label: "Seguidores", value: p.followers },
              { label: p.platform === "tiktok" ? "Vídeos" : "Posts", value: p.posts },
              { label: "Curtidas", value: p.likes },
            ].filter(s => s.value != null);
            return (
              <div key={p.id} className="rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-colors p-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <a href={p.url} target="_blank" rel="noopener noreferrer"><Avatar p={p} /></a>
                  <div className="flex-1 min-w-0">
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="block">
                      <p className="text-sm font-semibold truncate hover:text-primary transition-colors">{p.display_name || p.username}</p>
                    </a>
                    <p className="text-xs text-white/40 truncate">@{p.username}</p>
                    {p.niche && <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/50">{p.niche}</span>}
                  </div>
                </div>

                {stats.length > 0 && (
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
                    {stats.map(s => (
                      <div key={s.label} className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                        <p className="text-xs font-bold leading-none">{formatNumber(s.value!)}</p>
                        <p className="text-[8px] text-white/30 uppercase tracking-wide leading-none">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {p.fetch_error && (
                  <p className="flex items-start gap-1.5 text-[10px] text-amber-400/80">
                    <AlertTriangle className="w-3 h-3 shrink-0 mt-px" />
                    <span>Não consegui puxar os dados ({p.fetch_error}). Tente atualizar ou edite à mão.</span>
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-2 mt-auto">
                  <span className="text-[10px] text-white/30">{timeAgo(p.last_fetched_at) ?? "—"}</span>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Atualizar" disabled={busy} onClick={() => refreshProfile(p.id)}>
                      <RefreshCw className={`w-3.5 h-3.5 ${busy ? "animate-spin" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost" size="sm" className="h-7 w-7 p-0" title="Editar"
                      onClick={() => setEditing({ id: p.id, display_name: p.display_name || "", avatar_url: p.avatar_url || "", niche: p.niche || "" })}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive/60 hover:text-destructive" title="Remover" onClick={() => setDeleteId(p.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Adicionar */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Perfil</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Link do perfil</Label>
              <Input
                value={newUrl} onChange={e => setNewUrl(e.target.value)} autoFocus
                placeholder="tiktok.com/@usuario · instagram.com/usuario · facebook.com/pagina"
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div className="space-y-2">
              <Label>Nicho (opcional)</Label>
              <Input value={newNiche} onChange={e => setNewNiche(e.target.value)} placeholder="Ex.: Curiosidades" />
            </div>
            <Button onClick={handleAdd} disabled={isAdding || !newUrl.trim()} className="w-full gradient-primary">
              {isAdding ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Buscando perfil...</> : "Adicionar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Editar (reserva manual quando o scraping falha) */}
      <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Perfil</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={editing.display_name} onChange={e => setEditing({ ...editing, display_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Link da foto</Label>
                <Input value={editing.avatar_url} onChange={e => setEditing({ ...editing, avatar_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Nicho</Label>
                <Input value={editing.niche} onChange={e => setEditing({ ...editing, niche: e.target.value })} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                <Button
                  className="gradient-primary"
                  onClick={async () => {
                    const { id, ...updates } = editing;
                    if (await updateProfile(id, updates)) setEditing(null);
                  }}
                >
                  Salvar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover perfil?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) removeProfile(deleteId); setDeleteId(null); }}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OutrasRedes;
