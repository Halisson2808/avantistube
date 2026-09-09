/**
 * AnalyticsSites.tsx — cadastro dos sites/ofertas e código de instalação do pixel.
 */
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Globe, Plus, Trash2, Code2, ExternalLink } from "lucide-react";

import { useTrackingSites, type TrackingSite } from "@/hooks/use-analytics";
import { Panel, EmptyState } from "@/components/analytics/AnalyticsShell";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const KIND_LABEL: Record<TrackingSite["kind"], string> = {
    organic: "Orgânico",
    paid: "Tráfego pago",
    both: "Pago + orgânico",
};

export default function AnalyticsSites() {
    const { sites, isLoading, addSite, removeSite } = useTrackingSites();
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [kind, setKind] = useState<TrackingSite["kind"]>("organic");
    const [saving, setSaving] = useState(false);
    const [openSnippet, setOpenSnippet] = useState<string | null>(null);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;
        setSaving(true);
        const created = await addSite({ name: name.trim(), domain: domain.trim(), kind });
        setSaving(false);
        if (created) {
            setName("");
            setDomain("");
            setOpenSnippet(created.site_key);
        }
    }

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Meus Sites</h1>
                <p className="text-white/40 text-xs mt-0.5">
                    Cada site recebe uma chave própria — é ela que o pixel usa para separar os dados.
                </p>
            </div>

            {/* Cadastro */}
            <Panel title="Cadastrar site ou página de oferta" icon={Plus}>
                <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome (ex.: Oferta Curso VSL)"
                        className="h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs px-3 outline-none focus:border-emerald-500/40 placeholder:text-white/25"
                    />
                    <input
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="Domínio (ex.: minhaoferta.com.br)"
                        className="h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs px-3 outline-none focus:border-emerald-500/40 placeholder:text-white/25"
                    />
                    <Select value={kind} onValueChange={(v) => setKind(v as TrackingSite["kind"])}>
                        <SelectTrigger className="h-9 w-full sm:w-[150px] rounded-lg bg-white/[0.04] border-white/[0.08] text-white text-xs focus:ring-0 focus:border-emerald-500/40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[rgba(16,16,20,0.98)] border-white/10 text-white">
                            {(Object.keys(KIND_LABEL) as Array<TrackingSite["kind"]>).map((k) => (
                                <SelectItem key={k} value={k} className="text-xs focus:bg-white/10 focus:text-white">
                                    {KIND_LABEL[k]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <button
                        type="submit"
                        disabled={saving || !name.trim()}
                        className="h-9 px-4 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-200 hover:bg-emerald-500/25 transition-colors text-xs disabled:opacity-40"
                    >
                        {saving ? "Salvando…" : "Cadastrar"}
                    </button>
                </form>
            </Panel>

            {/* Lista */}
            {isLoading ? (
                <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
                    ))}
                </div>
            ) : sites.length === 0 ? (
                <EmptyState
                    title="Nenhum site cadastrado"
                    description="Cadastre o primeiro site acima para gerar a chave do pixel."
                />
            ) : (
                <div className="space-y-2">
                    {sites.map((site) => (
                        <div key={site.id} className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                            <div className="flex items-center gap-3 p-3">
                                <div className="w-9 h-9 rounded-lg bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                    <Globe className="h-4 w-4 text-emerald-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-white text-sm font-medium truncate">{site.name}</p>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/50">
                                            {KIND_LABEL[site.kind]}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <code className="text-[10px] text-emerald-300/80">{site.site_key}</code>
                                        {site.domain && (
                                            <a
                                                href={`https://${site.domain}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] text-white/35 hover:text-white flex items-center gap-1"
                                            >
                                                {site.domain}
                                                <ExternalLink className="h-2.5 w-2.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => copy(site.site_key, "Chave copiada.")}
                                    className="p-2 rounded-lg text-white/45 hover:text-white hover:bg-white/[0.06] transition-colors"
                                    title="Copiar chave"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => setOpenSnippet(openSnippet === site.site_key ? null : site.site_key)}
                                    className="p-2 rounded-lg text-white/45 hover:text-white hover:bg-white/[0.06] transition-colors"
                                    title="Ver código de instalação"
                                >
                                    <Code2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm(`Remover "${site.name}" e todos os eventos dele?`)) removeSite(site.id);
                                    }}
                                    className="p-2 rounded-lg text-white/45 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                    title="Remover"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            {openSnippet === site.site_key && <Snippet siteKey={site.site_key} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function copy(text: string, msg: string) {
    navigator.clipboard.writeText(text).then(
        () => toast.success(msg),
        () => toast.error("Não foi possível copiar."),
    );
}

function Snippet({ siteKey }: { siteKey: string }) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const tag = `<script defer src="${origin}/avantis-pixel.js" data-site="${siteKey}"></script>`;
    const eventos = [
        `avantis.track("lead");`,
        `avantis.track("purchase", { value: 97 });`,
        `<button data-avantis="botao_comprar">Comprar</button>`,
    ].join("\n");

    return (
        <div className="border-t border-white/[0.06] p-4 space-y-3 bg-black/20">
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <p className="text-white/50 text-[11px]">1. Cole antes do <code>&lt;/body&gt;</code> do site:</p>
                    <button
                        onClick={() => copy(tag, "Código copiado.")}
                        className="text-[10px] text-emerald-300 hover:text-emerald-200 flex items-center gap-1"
                    >
                        <Copy className="h-3 w-3" /> Copiar
                    </button>
                </div>
                <pre className="text-[10px] text-emerald-200/90 bg-black/40 border border-white/[0.06] rounded-lg p-3 overflow-x-auto">
                    {tag}
                </pre>
            </div>

            <div className="space-y-1.5">
                <p className="text-white/50 text-[11px]">
                    2. Visitas e cliques em links externos já são registrados sozinhos. Para marcar botões e conversões:
                </p>
                <pre className="text-[10px] text-white/70 bg-black/40 border border-white/[0.06] rounded-lg p-3 overflow-x-auto whitespace-pre">
                    {eventos}
                </pre>
            </div>
        </div>
    );
}
